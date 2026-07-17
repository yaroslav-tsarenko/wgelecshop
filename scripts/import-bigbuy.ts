import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/utils/slugify";

const TOKEN = process.env.BIGBUY_API_PRODUCTION;
if (!TOKEN) {
  console.error("BIGBUY_API_PRODUCTION is not set");
  process.exit(1);
}

const BASE = "https://api.bigbuy.eu";
const ISO = "en";

const TARGET_CATEGORY_IDS = new Set<number>([
  2703, // Lamps
  2953, // Light bulbs
  2421, // LED Lighting
  2420, // Solar lighting
  2736, // Lighting and Outside Decoration
  3449, // LED/HID car lighting and bulbs
  3364, // Lighting for cycling
]);

const PARENT_CATEGORY_NAME = "Lighting";
const PARENT_CATEGORY_SLUG = "lighting";
const CACHE_FILE = path.resolve("/tmp/bb-lighting-ids-v2.json");
const IMPORTED_LOG = path.resolve("/tmp/bb-lighting-imported.json");
const REQUEST_GAP_MS = Number(process.env.BB_GAP_MS ?? 500);
const CONCURRENCY = Number(process.env.BB_CONC ?? 2);
const MAX_RETRIES = 8;
const FALLBACK_STOCK = 999;
const MAX_PRODUCTS = Number(process.env.BB_MAX ?? 5000);
const PAIRS_PAGE_SIZE = 5000;

type Category = {
  id: number;
  name: string;
  url: string;
  parentCategory: number | null;
};

type PC = { id: number; product: number; category: number; position: number };

type ProductBase = {
  id: number;
  sku: string;
  ean13?: string;
  manufacturer?: number;
  weight?: number;
  wholesalePrice?: number;
  retailPrice?: number;
  category?: number;
  taxonomy?: number;
  active?: number | boolean;
};

type ProductInfo = {
  id: number;
  productId?: number;
  name?: string;
  description?: string;
  url?: string;
  isoCode?: string;
};

type ImagesEnvelope = {
  id: number;
  images: Array<{
    id: number;
    url: string;
    name?: string;
    isCover?: boolean;
    position?: number;
  }>;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function bb<T>(pathname: string): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(`${BASE}${pathname}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (res.ok) {
        await sleep(REQUEST_GAP_MS);
        return (await res.json()) as T;
      }
      if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
        const wait = 1000 * Math.pow(2, attempt);
        attempt++;
        console.warn(
          `  ${res.status} ${pathname} — wait ${wait}ms (attempt ${attempt})`
        );
        await sleep(wait);
        continue;
      }
      const body = await res.text().catch(() => "");
      throw new Error(`BB ${res.status} ${pathname} :: ${body.slice(0, 160)}`);
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const wait = 1000 * Math.pow(2, attempt);
        attempt++;
        console.warn(
          `  network ${pathname} :: ${(err as Error).message} — wait ${wait}ms (attempt ${attempt})`
        );
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
}

async function safeBB<T>(pathname: string): Promise<T | null> {
  try {
    return await bb<T>(pathname);
  } catch (err) {
    console.warn(`  skip ${pathname}: ${(err as Error).message}`);
    return null;
  }
}

async function collectProductIds(): Promise<Map<number, number[]>> {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8")) as Record<
      string,
      number[]
    >;
    const map = new Map<number, number[]>();
    for (const [k, v] of Object.entries(raw)) map.set(Number(k), v);
    console.log(`Loaded ${map.size} product ids from cache ${CACHE_FILE}`);
    return map;
  }
  console.log("Paginating productscategories.json — collecting product ids");
  const partialFile = `${CACHE_FILE}.partial.json`;
  const productToCats = new Map<number, Set<number>>();
  let page = 1;
  let totalPairs = 0;
  if (fs.existsSync(partialFile)) {
    const rawPartial = JSON.parse(fs.readFileSync(partialFile, "utf-8")) as {
      page: number;
      totalPairs: number;
      data: Record<string, number[]>;
    };
    page = rawPartial.page + 1;
    totalPairs = rawPartial.totalPairs;
    for (const [k, v] of Object.entries(rawPartial.data))
      productToCats.set(Number(k), new Set(v));
    console.log(
      `  resuming from page ${page} (${productToCats.size} products so far)`
    );
  }
  while (true) {
    const rows = await bb<PC[]>(
      `/rest/catalog/productscategories.json?pageSize=${PAIRS_PAGE_SIZE}&page=${page}`
    );
    if (!rows || rows.length === 0) break;
    totalPairs += rows.length;
    for (const r of rows) {
      if (TARGET_CATEGORY_IDS.has(r.category)) {
        const set = productToCats.get(r.product) ?? new Set<number>();
        set.add(r.category);
        productToCats.set(r.product, set);
      }
    }
    if (page % 10 === 0) {
      console.log(
        `  scanned page ${page} (${totalPairs} pairs), matched products: ${productToCats.size}`
      );
    }
    if (page % 20 === 0) {
      const snap: Record<string, number[]> = {};
      for (const [pid, set] of productToCats) snap[String(pid)] = [...set];
      fs.writeFileSync(
        partialFile,
        JSON.stringify({ page, totalPairs, data: snap })
      );
    }
    if (rows.length < PAIRS_PAGE_SIZE) break;
    page += 1;
  }
  const map = new Map<number, number[]>();
  const raw: Record<string, number[]> = {};
  for (const [pid, set] of productToCats) {
    const arr = [...set];
    map.set(pid, arr);
    raw[String(pid)] = arr;
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(raw));
  if (fs.existsSync(partialFile)) fs.unlinkSync(partialFile);
  console.log(
    `Collected ${map.size} product ids from ${totalPairs} pairs (cached to ${CACHE_FILE}).`
  );
  return map;
}

async function ensureCategories(): Promise<Map<number, string>> {
  const cats = await bb<Category[]>(
    `/rest/catalog/categories.json?isoCode=${ISO}`
  );
  const byId = new Map(cats.map((c) => [c.id, c]));

  const parent = await prisma.category.upsert({
    where: { slug: PARENT_CATEGORY_SLUG },
    update: { name: PARENT_CATEGORY_NAME, isActive: true },
    create: {
      name: PARENT_CATEGORY_NAME,
      slug: PARENT_CATEGORY_SLUG,
      description: "All lighting products",
      isActive: true,
      sortOrder: 0,
    },
  });
  console.log(`  parent "Lighting" -> ${parent.id}`);

  const idToDbId = new Map<number, string>();
  let order = 1;
  for (const id of TARGET_CATEGORY_IDS) {
    const c = byId.get(id);
    if (!c) {
      console.warn(`  target category #${id} not found in BigBuy`);
      continue;
    }
    const slug = slugify(c.name) || c.url || `bb-cat-${c.id}`;
    const up = await prisma.category.upsert({
      where: { slug },
      update: {
        name: c.name,
        isActive: true,
        parentId: parent.id,
      },
      create: {
        name: c.name,
        slug,
        description: `Imported from BigBuy #${c.id}`,
        isActive: true,
        parentId: parent.id,
        sortOrder: order,
      },
    });
    idToDbId.set(id, up.id);
    console.log(`  category #${id} "${c.name}" -> ${up.id}`);
    order += 1;
  }
  return idToDbId;
}

function loadImported(): Set<number> {
  if (!fs.existsSync(IMPORTED_LOG)) return new Set();
  try {
    const arr = JSON.parse(fs.readFileSync(IMPORTED_LOG, "utf-8")) as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveImported(set: Set<number>) {
  fs.writeFileSync(IMPORTED_LOG, JSON.stringify([...set]));
}

async function importOne(
  productId: number,
  categoryIds: number[],
  catIdToDbId: Map<number, string>
): Promise<"created" | "updated" | "skipped"> {
  const base = await safeBB<ProductBase>(
    `/rest/catalog/product/${productId}.json`
  );
  if (!base) return "skipped";
  if (base.active === 0 || base.active === false) return "skipped";

  const info = await safeBB<ProductInfo[]>(
    `/rest/catalog/productinformation/${productId}.json?isoCode=${ISO}`
  );
  const infoRow = Array.isArray(info) ? info[0] : (info as ProductInfo | null);
  const name = infoRow?.name?.trim() || `BigBuy #${productId}`;
  const description = infoRow?.description?.trim() || null;

  const imgsResp = await safeBB<ImagesEnvelope>(
    `/rest/catalog/productimages/${productId}.json`
  );
  const imgs = imgsResp?.images ?? [];

  const sku = base.sku || `BB-${productId}`;
  const slug = slugify(`${name}-${sku}`) || `bb-${productId}`;
  const price = Number(base.retailPrice ?? base.wholesalePrice ?? 0);
  const costPrice =
    base.wholesalePrice != null ? Number(base.wholesalePrice) : null;

  const existing = await prisma.product.findUnique({ where: { sku } });

  const dataCommon = {
    name,
    description,
    price,
    costPrice,
    quantity: FALLBACK_STOCK,
    weight: base.weight != null ? Number(base.weight) : null,
    ean: base.ean13 || null,
    status: "ACTIVE" as const,
    metadata: {
      bigbuyId: productId,
      bigbuyCategory: base.category,
      bigbuyTaxonomy: base.taxonomy,
      bigbuyManufacturer: base.manufacturer,
    },
  };

  let dbId: string;
  let action: "created" | "updated";
  if (existing) {
    const up = await prisma.product.update({
      where: { sku },
      data: dataCommon,
    });
    dbId = up.id;
    action = "updated";
  } else {
    const created = await prisma.product.create({
      data: { ...dataCommon, sku, slug },
    });
    dbId = created.id;
    action = "created";
  }

  const catData = categoryIds
    .map((cid) => catIdToDbId.get(cid))
    .filter((x): x is string => Boolean(x))
    .map((categoryId) => ({ productId: dbId, categoryId }));
  if (catData.length > 0) {
    await prisma.productCategory.createMany({
      data: catData,
      skipDuplicates: true,
    });
  }

  await prisma.productImage.deleteMany({ where: { productId: dbId } });
  const sortedImgs = [...imgs].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );
  if (sortedImgs.length > 0) {
    await prisma.productImage.createMany({
      data: sortedImgs.map((im, idx) => ({
        productId: dbId,
        url: im.url,
        alt: name,
        sortOrder: idx,
      })),
    });
  }

  return action;
}

async function pool<T>(
  items: T[],
  size: number,
  worker: (item: T, idx: number) => Promise<void>
): Promise<void> {
  let cursor = 0;
  async function run() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      await worker(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, () => run())
  );
}

async function main() {
  console.log(
    "BigBuy Lighting import for categories:",
    [...TARGET_CATEGORY_IDS].join(", ")
  );
  console.log("Upserting categories in DB...");
  const catIdToDbId = await ensureCategories();

  const productToCats = await collectProductIds();
  let entries = [...productToCats.entries()];
  if (entries.length > MAX_PRODUCTS) {
    const byCat = new Map<number, Array<[number, number[]]>>();
    for (const e of entries) {
      for (const cid of e[1]) {
        const arr = byCat.get(cid) ?? [];
        arr.push(e);
        byCat.set(cid, arr);
      }
    }
    const seen = new Set<number>();
    const balanced: Array<[number, number[]]> = [];
    const iterators = new Map<number, number>();
    for (const cid of byCat.keys()) iterators.set(cid, 0);
    while (balanced.length < MAX_PRODUCTS) {
      let progressed = false;
      for (const cid of byCat.keys()) {
        const arr = byCat.get(cid)!;
        let idx = iterators.get(cid)!;
        while (idx < arr.length && seen.has(arr[idx][0])) idx++;
        if (idx >= arr.length) {
          iterators.set(cid, idx);
          continue;
        }
        const pick = arr[idx];
        seen.add(pick[0]);
        balanced.push(pick);
        iterators.set(cid, idx + 1);
        progressed = true;
        if (balanced.length >= MAX_PRODUCTS) break;
      }
      if (!progressed) break;
    }
    entries = balanced;
    console.log(`  balanced to ${entries.length} products across categories`);
  }

  const imported = loadImported();
  const pending = entries.filter(([pid]) => !imported.has(pid));
  console.log(
    `  ${imported.size} already imported, ${pending.length} pending (concurrency=${CONCURRENCY}, gap=${REQUEST_GAP_MS}ms)`
  );

  const startAt = Date.now();
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let done = 0;
  let lastSave = Date.now();
  await pool(pending, CONCURRENCY, async ([pid, cats]) => {
    try {
      const r = await importOne(pid, cats, catIdToDbId);
      if (r === "created") created++;
      else if (r === "updated") updated++;
      else skipped++;
      imported.add(pid);
    } catch (err) {
      skipped++;
      console.warn(`  product ${pid} failed: ${(err as Error).message}`);
    }
    done++;
    if (done % 25 === 0 || done === pending.length) {
      const rate = done / ((Date.now() - startAt) / 1000);
      const etaSec = (pending.length - done) / Math.max(rate, 0.01);
      console.log(
        `  [${done}/${pending.length}] created=${created} updated=${updated} skipped=${skipped} rate=${rate.toFixed(2)}/s eta=${Math.round(etaSec)}s`
      );
    }
    if (Date.now() - lastSave > 15000) {
      saveImported(imported);
      lastSave = Date.now();
    }
  });
  saveImported(imported);

  console.log(
    `Done. created=${created} updated=${updated} skipped=${skipped}`
  );
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
