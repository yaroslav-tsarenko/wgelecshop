import "dotenv/config";
import { prisma } from "../src/lib/prisma";

type Rule = {
  name: string;
  slug: string;
  description: string;
  match: RegExp;
  sortOrder: number;
};

// Ordered by priority (most specific first). First match wins per product.
const RULES: Rule[] = [
  {
    name: "Christmas & Festive",
    slug: "christmas-decorative",
    description: "Christmas trees, wreaths, garlands and festive lights",
    match: /\b(christmas|xmas|festive|wreath|advent|santa|nativity|reindeer|snowman|tree light|tree lights)\b/i,
    sortOrder: 1,
  },
  {
    name: "String & Fairy Lights",
    slug: "string-fairy-lights",
    description: "Fairy lights, garlands, curtain and rope lights for magical ambience",
    match: /\b(fairy light|fairy-light|string light|garland|light chain|light rope|rope light|curtain light|net light|icicle light|festoon)\b/i,
    sortOrder: 2,
  },
  {
    name: "Solar Lighting",
    slug: "solar-lights",
    description: "Solar-powered garden lamps, spotlights and path lights",
    match: /\bsolar\b/i,
    sortOrder: 3,
  },
  {
    name: "LED Strips & Panels",
    slug: "led-strips-panels",
    description: "LED strips, ribbons, panels, modules and controllers",
    match: /\b(led strip|led ribbon|led panel|led module|light strip|neon strip|led bar|led plate)\b/i,
    sortOrder: 4,
  },
  {
    name: "Ceiling Lights & Chandeliers",
    slug: "ceiling-lights",
    description: "Chandeliers, pendants and ceiling-mounted luminaires",
    match: /\b(ceiling|chandelier|pendant|hanging lamp|suspended|plafon)\b/i,
    sortOrder: 5,
  },
  {
    name: "Wall Lights & Sconces",
    slug: "wall-lights",
    description: "Wall-mounted lights, sconces and picture lamps",
    match: /\b(wall light|wall lamp|wall-mount|sconce|picture light|applique)\b/i,
    sortOrder: 6,
  },
  {
    name: "Table & Desk Lamps",
    slug: "table-desk-lamps",
    description: "Task lamps, bedside lamps and decorative table lights",
    match: /\b(table lamp|desk lamp|bedside|night ?stand|reading lamp|task lamp)\b/i,
    sortOrder: 7,
  },
  {
    name: "Floor Lamps",
    slug: "floor-lamps",
    description: "Standing floor lamps and tripod lamps",
    match: /\b(floor lamp|standing lamp|standing light|tripod lamp)\b/i,
    sortOrder: 8,
  },
  {
    name: "Spotlights & Downlights",
    slug: "spotlights-downlights",
    description: "Adjustable spotlights, downlights and recessed lighting",
    match: /\b(spotlight|spot light|down.?light|track light|recessed light|projector light)\b/i,
    sortOrder: 9,
  },
  {
    name: "Bike Lighting",
    slug: "bike-lighting",
    description: "Front and rear cycling lights, reflectors and headlamps",
    match: /\b(bike|bicycle|cycling)\b/i,
    sortOrder: 10,
  },
  {
    name: "Car & Vehicle Lighting",
    slug: "car-lighting",
    description: "Automotive headlight bulbs, HID/LED conversions and interior car lights",
    match: /\b(car light|automotive|vehicle light|hid |xenon|h1 |h3 |h4 |h7 |h11|headlight bulb|tail light|fog light)\b/i,
    sortOrder: 11,
  },
  {
    name: "Torches & Camping",
    slug: "torches-camping",
    description: "Portable torches, headlamps, work lights and camping lanterns",
    match: /\b(torch|flashlight|head lamp|headlamp|work light|lantern|camping light|tactical light)\b/i,
    sortOrder: 12,
  },
  {
    name: "Outdoor & Garden Lighting",
    slug: "outdoor-garden",
    description: "Garden lamps, path lights, patio lighting and outdoor decor",
    match: /\b(outdoor|garden light|garden lamp|patio|path light|pathway|bollard|lawn light|deck light|step light|underwater|pond light)\b/i,
    sortOrder: 13,
  },
  {
    name: "Bulbs & Tubes",
    slug: "bulbs-tubes",
    description: "LED, halogen and fluorescent bulbs, tubes and replacements",
    match: /\b(bulb|tube light|led tube|fluorescent tube|halogen bulb|e27|e14|gu10|gu5\.3|b22|b15|bayonet|edison screw)\b/i,
    sortOrder: 14,
  },
  {
    name: "Home Décor & Accents",
    slug: "home-decor-accents",
    description: "Decorative figurines, vases, ornaments and ambient accents",
    match: /\b(figure|figurine|ornament|statue|vase|stones|fence|centerpiece|centrepiece)\b/i,
    sortOrder: 15,
  },
];

async function main() {
  console.log("Reorganizing categories (priority mode)...");

  await prisma.category.updateMany({
    where: { slug: "lighting" },
    data: { isActive: false },
  });
  const oldSlugs = [
    "lamps",
    "light-bulbs",
    "led-lighting",
    "solar-lighting",
    "lighting-and-outside-decoration",
    "ledhid-car-lighting-and-bulbs",
    "lighting-for-cycling",
  ];
  await prisma.category.updateMany({
    where: { slug: { in: oldSlugs } },
    data: { parentId: null, isActive: false },
  });
  console.log("  hid old wrapper categories");

  const catIdBySlug = new Map<string, string>();
  for (const r of RULES) {
    const cat = await prisma.category.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        description: r.description,
        parentId: null,
        isActive: true,
        sortOrder: r.sortOrder,
      },
      create: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        parentId: null,
        isActive: true,
        sortOrder: r.sortOrder,
      },
    });
    catIdBySlug.set(r.slug, cat.id);
  }
  console.log(`  upserted ${RULES.length} keyword categories`);

  // Reset ProductCategory rows for keyword categories only (leave BigBuy links)
  const keywordCatIds = [...catIdBySlug.values()];
  const cleared = await prisma.productCategory.deleteMany({
    where: { categoryId: { in: keywordCatIds } },
  });
  console.log(`  cleared ${cleared.count} old keyword mappings`);

  console.log("Classifying products with priority rules...");
  const products = await prisma.product.findMany({
    select: { id: true, name: true, description: true },
  });
  console.log(`  ${products.length} products`);

  let matched = 0;
  let fallbackAccent = 0;
  let fallbackBulbs = 0;
  const rows: { productId: string; categoryId: string }[] = [];
  for (const p of products) {
    const hay = `${p.name ?? ""} ${p.description ?? ""}`;
    let picked: string | null = null;
    for (const r of RULES) {
      if (r.match.test(hay)) {
        picked = r.slug;
        break;
      }
    }
    if (!picked) {
      // Fallback based on whether it's a "lamp" or generic decor
      if (/\b(lamp|light|lantern)\b/i.test(hay)) {
        picked = "table-desk-lamps"; // ambient/decorative table lamps
        fallbackBulbs++;
      } else {
        picked = "home-decor-accents";
        fallbackAccent++;
      }
    } else {
      matched++;
    }
    const catId = catIdBySlug.get(picked);
    if (catId) rows.push({ productId: p.id, categoryId: catId });
  }
  console.log(
    `  matched=${matched} fallback→lamps=${fallbackBulbs} fallback→decor=${fallbackAccent} rows=${rows.length}`
  );

  const CHUNK = 1000;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await prisma.productCategory.createMany({
      data: rows.slice(i, i + CHUNK),
      skipDuplicates: true,
    });
  }
  console.log(`  inserted ${rows.length} product-category rows`);

  const counts = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: {
      name: true,
      slug: true,
      sortOrder: true,
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
  console.log("\nFinal top-level categories:");
  for (const c of counts) {
    console.log(`  #${c.sortOrder} ${c.name} (${c.slug}): ${c._count.products}`);
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
