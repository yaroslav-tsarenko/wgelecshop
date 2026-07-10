"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Category[];
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSale: boolean;
  brands: string[];
  selectedBrand: string;
  onCategoryChange: (slug: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onInStockChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onBrandChange: (value: string) => void;
}

function FilterSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-5 py-4 text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-tertiary)]"
      >
        <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-[var(--color-text)]">
          {title}
        </h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

const catItemBase =
  "cursor-pointer rounded-[var(--radius-md)] px-2.5 py-2 text-sm transition-[background-color,color] duration-150";
const catItemIdle =
  "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text)]";
const catItemActive =
  "bg-[var(--color-accent-light)] font-semibold text-[var(--color-accent)]";

function CategoryItem({
  cat,
  depth,
  selectedCategory,
  onCategoryChange,
}: {
  cat: Category;
  depth: number;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = cat.children && cat.children.length > 0;
  const isActive = selectedCategory === cat.slug;
  const count = cat._count?.products || 0;

  return (
    <>
      <li
        className={[
          "flex items-center",
          catItemBase,
          isActive ? catItemActive : catItemIdle,
        ].join(" ")}
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
      >
        <span onClick={() => onCategoryChange(cat.slug)} className="flex-1 cursor-pointer">
          {cat.name}
          {count > 0 && (
            <span className="ml-1 text-xs text-[var(--color-text-tertiary)]">({count})</span>
          )}
        </span>
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="flex cursor-pointer items-center border-none bg-transparent p-0.5 text-[var(--color-text-tertiary)]"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </li>
      {hasChildren && expanded && cat.children!.map((child) => (
        <CategoryItem
          key={child.id}
          cat={child}
          depth={depth + 1}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      ))}
    </>
  );
}

export function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  brands,
  selectedBrand,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onSaleChange,
  onBrandChange,
}: ProductFiltersProps) {
  const t = useTranslations("product");
  const nav = useTranslations("nav");

  const priceInputCls =
    "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors duration-200 outline-none focus:border-[var(--color-accent)]";
  const presetBtnCls =
    "cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-1 py-[0.4375rem] text-xs font-medium text-[var(--color-text-secondary)] transition-[background,color,border-color] duration-150 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)]";
  const shimmerBar =
    "h-3 rounded-md animate-shimmer [background:linear-gradient(90deg,var(--color-bg-tertiary)_25%,var(--color-bg-secondary)_50%,var(--color-bg-tertiary)_75%)] [background-size:200%_100%]";

  return (
    <aside className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)]">
      <FilterSection title={t("filterBy")}>
        {categories.length === 0 ? (
          <div className="flex flex-col">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-2">
                <div className={`${shimmerBar} flex-1`} style={{ width: `${50 + (i * 19) % 40}%` }} />
                <div className={`${shimmerBar} w-5`} />
              </div>
            ))}
          </div>
        ) : (
          <ul className="m-0 flex max-h-[220px] list-none flex-col gap-0.5 overflow-y-auto p-0">
            <li
              className={[catItemBase, !selectedCategory ? catItemActive : catItemIdle].join(" ")}
              onClick={() => onCategoryChange("")}
            >
              {nav("allCategories")}
            </li>
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                cat={cat}
                depth={0}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            ))}
          </ul>
        )}
      </FilterSection>

      <FilterSection title={t("priceRange")}>
        <div className="mb-3 flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className={priceInputCls}
          />
          <span className="flex-shrink-0 text-[var(--color-text-tertiary)]">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className={priceInputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button className={presetBtnCls} onClick={() => { onMinPriceChange(""); onMaxPriceChange("25"); }}>Under €25</button>
          <button className={presetBtnCls} onClick={() => { onMinPriceChange("25"); onMaxPriceChange("50"); }}>€25–€50</button>
          <button className={presetBtnCls} onClick={() => { onMinPriceChange("50"); onMaxPriceChange("100"); }}>€50–€100</button>
          <button className={presetBtnCls} onClick={() => { onMinPriceChange("100"); onMaxPriceChange(""); }}>€100+</button>
        </div>
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Brand" defaultOpen={false}>
          <ul className="m-0 flex max-h-[220px] list-none flex-col gap-0.5 overflow-y-auto p-0">
            <li
              className={[catItemBase, !selectedBrand ? catItemActive : catItemIdle].join(" ")}
              onClick={() => onBrandChange("")}
            >
              All Brands
            </li>
            {brands.map((brand) => (
              <li
                key={brand}
                className={[catItemBase, selectedBrand === brand ? catItemActive : catItemIdle].join(" ")}
                onClick={() => onBrandChange(brand)}
              >
                {brand}
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title={t("availability")} defaultOpen={false}>
        <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 [accent-color:var(--color-accent)]"
          />
          <span>{t("inStock")}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => onSaleChange(e.target.checked)}
            className="h-4 w-4 [accent-color:var(--color-accent)]"
          />
          <span>On Sale</span>
        </label>
      </FilterSection>
    </aside>
  );
}
