"use client";

import { TopBar } from "../TopBar/TopBar";
import { PromoStrip } from "../PromoStrip/PromoStrip";
import { CategorySidebar } from "../CategorySidebar/CategorySidebar";
import { HorizontalTabs } from "../HorizontalTabs/HorizontalTabs";
import { HeroCarousel } from "../HeroCarousel/HeroCarousel";
import { PromoBannerGrid } from "../PromoBannerGrid/PromoBannerGrid";
import { BrandStrip } from "../BrandStrip/BrandStrip";
import { ProductSection } from "../ProductSection/ProductSection";
import { SaleStrip } from "../SaleStrip/SaleStrip";
import { DealOfTheDay } from "../DealOfTheDay/DealOfTheDay";
import { NewsletterBanner } from "../NewsletterBanner/NewsletterBanner";
import { TrustStrip } from "../TrustStrip/TrustStrip";
import type { HomepageProduct, CategorySection, BrandSection } from "@/lib/homepage-products";

interface BannerData {
  id: string;
  type: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  bgColor: string;
  textColor: string;
  badgeText?: string | null;
  oldPrice?: string | null;
  newPrice?: string | null;
  discountText?: string | null;
}

interface SectionData {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  filterType: string;
  categorySlug?: string | null;
  maxProducts: number;
  viewAllUrl?: string | null;
  viewAllLabel: string;
  bgStyle: string;
  columns: number;
}

interface TabData {
  id: string;
  label: string;
  icon?: string | null;
  linkUrl: string;
  color: string;
}

interface UtilityLinkData {
  id: string;
  label: string;
  linkUrl: string;
  icon?: string | null;
  position: string;
}

interface PromoStripData {
  id: string;
  icon: string;
  title: string;
  subtitle?: string | null;
  linkUrl?: string | null;
}

interface BrandData {
  id: string;
  name: string;
  logoUrl?: string | null;
  linkUrl?: string | null;
}

interface CategoryShowcaseItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface Props {
  data: {
    heroSlides: BannerData[];
    dealCards: BannerData[];
    promoSmall: BannerData[];
    promoWide: BannerData[];
    brands: BrandData[];
    sections: SectionData[];
    tabs: TabData[];
    utilityLinks: UtilityLinkData[];
    promoStripItems: PromoStripData[];
    sectionProducts: Record<string, HomepageProduct[]>;
    categories: { id: string; name: string; slug: string; _count: { products: number } }[];
    featuredProducts: HomepageProduct[];
    saleProducts: HomepageProduct[];
    newProducts: HomepageProduct[];
    popularProducts: HomepageProduct[];
    categorySections: CategorySection[];
    brandSections: BrandSection[];
    categoryShowcase: CategoryShowcaseItem[];
  };
}

export function MarketplaceHome({ data }: Props) {
  const {
    heroSlides, dealCards, promoSmall, promoWide,
    brands, sections, tabs, utilityLinks, promoStripItems,
    sectionProducts, saleProducts, newProducts,
    popularProducts, categorySections,
  } = data;

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <TopBar links={utilityLinks} />
      <PromoStrip items={promoStripItems} />

      <div className="mx-auto max-w-[1400px] px-2 pb-8 pt-3 sm:px-4 sm:pb-12 sm:pt-4">
        <div className="flex items-start gap-4">
          <div className="sticky top-20 hidden lg:block">
            <CategorySidebar />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 block lg:hidden">
              <CategorySidebar />
            </div>

            {tabs.length > 0 && <HorizontalTabs tabs={tabs} />}
            <HeroCarousel slides={heroSlides} deals={dealCards} />
            <PromoBannerGrid smallBanners={promoSmall} wideBanners={promoWide} />

            {popularProducts.length > 0 && (
              <ProductSection
                title="Most Popular"
                subtitle="Top products by availability"
                products={popularProducts}
                viewAllHref="/catalog?sort=popular"
                viewAllLabel="View all popular"
                bg="white"
                columns={5}
              />
            )}

            {categorySections.slice(0, 3).map((cs, i) => (
              <ProductSection
                key={cs.category.id}
                title={cs.category.name}
                subtitle={`${cs.products.length}+ products`}
                products={cs.products}
                tabs={cs.subcategoryTabs}
                viewAllHref={`/catalog/${cs.category.slug}`}
                viewAllLabel={`All ${cs.category.name}`}
                bg={i % 2 === 1 ? "gray" : "white"}
                columns={5}
              />
            ))}

            <SaleStrip products={saleProducts} />

            <TrustStrip />

            {saleProducts.length > 0 && (
              <DealOfTheDay product={saleProducts[0]} />
            )}

            {categorySections.slice(3, 6).map((cs, i) => (
              <ProductSection
                key={cs.category.id}
                title={cs.category.name}
                subtitle={`${cs.products.length}+ products`}
                products={cs.products}
                tabs={cs.subcategoryTabs}
                viewAllHref={`/catalog/${cs.category.slug}`}
                viewAllLabel={`All ${cs.category.name}`}
                bg={i % 2 === 0 ? "gray" : "white"}
                columns={5}
              />
            ))}

            {brands.length > 0 && <BrandStrip brands={brands} />}

            {sections.map((section) => {
              const products = sectionProducts[section.slug] || [];
              if (!products.length) return null;
              return (
                <ProductSection
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle || undefined}
                  products={products}
                  viewAllHref={section.viewAllUrl || "/catalog"}
                  viewAllLabel={section.viewAllLabel}
                  bg={section.bgStyle as "white" | "gray"}
                  columns={section.columns}
                />
              );
            })}

            <NewsletterBanner />

            {newProducts.length > 0 && (
              <ProductSection
                title="New Arrivals"
                subtitle="Just landed in store"
                products={newProducts}
                viewAllHref="/catalog?sort=newest"
                viewAllLabel="View all new"
                bg="gray"
                columns={5}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
