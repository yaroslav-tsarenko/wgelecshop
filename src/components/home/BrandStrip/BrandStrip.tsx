"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BrandData {
  id: string;
  name: string;
  logoUrl?: string | null;
  linkUrl?: string | null;
}

interface Props {
  brands: BrandData[];
}

export function BrandStrip({ brands }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  if (!brands.length) return null;

  const arrowCls =
    "flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)] transition-[border-color,color] duration-100 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]";

  return (
    <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-[0.9375rem] font-bold text-[var(--color-text)]">Popular Brands</h3>
        <div className="flex gap-1">
          <button className={arrowCls} onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button className={arrowCls} onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto [scrollbar-width:none] [scroll-behavior:smooth] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => (
          <a
            key={brand.id}
            href={brand.linkUrl || "#"}
            className="flex min-w-[100px] flex-shrink-0 cursor-pointer items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-2.5 transition-[border-color,background] duration-100 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)]"
          >
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="max-h-6 max-w-20 object-contain" />
            ) : (
              <span className="whitespace-nowrap text-[0.8125rem] font-semibold text-[var(--color-text-secondary)]">
                {brand.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
