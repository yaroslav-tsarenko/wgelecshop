import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import { MarketplaceHome } from "@/components/home/MarketplaceHome/MarketplaceHome";
import {
  getFeaturedProducts,
  getSaleProducts,
  getNewProducts,
  getPopularProducts,
  getHomepageCategorySections,
  getBrandSections,
  TOP_BRANDS,
} from "@/lib/homepage-products";

export const dynamic = "force-dynamic";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn("Database query fallback engaged:", (err as Error)?.message || String(err));
    return fallback;
  }
}

async function getHomeData() {
  try {
    const productInclude = {
      images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
      categories: {
        include: { category: { select: { name: true, slug: true } } },
      },
    };

    const [
      allBanners,
      brands,
      sections,
      tabs,
      utilityLinks,
      promoStripItems,
      allActiveProducts,
      categoriesWithChildren,
    ] = await Promise.all([
      safeQuery(() => prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
      safeQuery(() => prisma.brand.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
      safeQuery(() => prisma.homepageSection.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
      safeQuery(() => prisma.homepageTab.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
      safeQuery(() => prisma.utilityLink.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
      safeQuery(() => prisma.promoStripItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
      safeQuery(() => prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: productInclude,
        orderBy: { createdAt: "desc" },
        take: 500,
      }), []),
      safeQuery(() => prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            select: { id: true, name: true, slug: true },
          },
          _count: { select: { products: true } },
        },
      }), []),
    ]);

    const heroSlides = allBanners.filter((b) => b.type === "HERO");
    const dealCards = allBanners.filter((b) => b.type === "DEAL_CARD");
    const promoSmall = allBanners.filter((b) => b.type === "PROMO_SMALL");
    const promoWide = allBanners.filter((b) => b.type === "PROMO_WIDE");

    const sectionProducts: Record<string, typeof allActiveProducts> = {};
    for (const section of sections) {
      let products = allActiveProducts;
      switch (section.filterType) {
        case "featured":
          products = allActiveProducts.filter((p) => p.isFeatured);
          break;
        case "newest":
          products = [...allActiveProducts].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "onSale":
          products = allActiveProducts.filter((p) => p.comparePrice !== null);
          break;
        case "category":
          if (section.categorySlug) {
            products = allActiveProducts.filter((p) =>
              p.categories.some((c) => c.category.slug === section.categorySlug)
            );
          }
          break;
        case "popular":
          products = [...allActiveProducts].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "all":
        default:
          break;
      }
      sectionProducts[section.slug] = products.slice(0, section.maxProducts);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = allActiveProducts as any[];

    const featuredProducts = getFeaturedProducts(products, 10);
    const saleProducts = getSaleProducts(products, 15);
    const newProducts = getNewProducts(products, 10);
    const popularProducts = getPopularProducts(products, 10);

    const categorySections = getHomepageCategorySections(
      products,
      categoriesWithChildren.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        children: c.children,
        _count: c._count,
      })),
      10,
      6,
    );

    const brandSections = getBrandSections(products, TOP_BRANDS, 8);

    const categoryShowcase = categoriesWithChildren.map((c) => {
      const directCount = c._count.products;
      const childSlugs = c.children.map((ch) => ch.slug);
      const childProductCount = childSlugs.length > 0
        ? products.filter((p: { categories?: { category: { slug: string } }[] }) =>
            p.categories?.some((pc) => childSlugs.includes(pc.category.slug))
          ).length
        : 0;
      const sample = products.find((p: { categories?: { category: { slug: string } }[]; images?: { url: string }[] }) =>
        p.categories?.some((pc) => pc.category.slug === c.slug || childSlugs.includes(pc.category.slug))
      );
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        imageUrl: sample?.images?.[0]?.url ?? null,
        productCount: directCount + childProductCount,
      };
    }).filter((c) => c.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 15);

    return serialize({
      heroSlides,
      dealCards,
      promoSmall,
      promoWide,
      brands,
      sections,
      tabs,
      utilityLinks,
      promoStripItems,
      sectionProducts,
      categories: categoriesWithChildren,
      featuredProducts,
      saleProducts,
      newProducts,
      popularProducts,
      categorySections,
      brandSections,
      categoryShowcase,
    });
  } catch (e) {
    console.error("Homepage data fetch error:", e);
    return {
      heroSlides: [], dealCards: [], promoSmall: [], promoWide: [],
      brands: [], sections: [], tabs: [], utilityLinks: [],
      promoStripItems: [], sectionProducts: {}, categories: [],
      featuredProducts: [], saleProducts: [], newProducts: [],
      popularProducts: [], categorySections: [], brandSections: [],
      categoryShowcase: [],
    };
  }
}

async function getHomeDataWithRetry(retries = 3, delayMs = 600) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const data = await getHomeData();
    // If data fetched successfully (has categories or active products), return immediately
    if (data.categories.length > 0 || data.featuredProducts.length > 0 || attempt === retries) {
      return data;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return getHomeData();
}

export default async function HomePage() {
  const data = await getHomeDataWithRetry();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "WGELECSHOP",
          url: siteUrl,
          description: "Your trusted source for electrical materials, wiring, and installation supplies.",
        }}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MarketplaceHome data={data as any} />
    </>
  );
}
