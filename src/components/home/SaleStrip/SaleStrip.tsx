"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { formatPrice } from "@/lib/utils/format-price";
import { getProductImage, getProductImageFallback } from "@/lib/utils/product-image";
import { getDiscountPercent, type HomepageProduct } from "@/lib/homepage-products";

interface Props {
  products: HomepageProduct[];
}

export function SaleStrip({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-40px" });

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  if (!products.length) return null;

  const arrowCls =
    "flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)] transition-colors duration-150 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]";

  return (
    <section
      ref={sectionRef}
      className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4"
    >
      <motion.div
        className="mb-3 flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={isInView ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6, delay: 0.3, repeat: Infinity, repeatDelay: 3 }}
          >
            <Flame size={18} className="text-[var(--color-sale)]" />
          </motion.div>
          <h2 className="m-0 text-base font-extrabold text-[var(--color-text)]">Hot Deals</h2>
          <span className="rounded bg-[var(--color-sale)] px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">
            Sale
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/catalog?sort=price-asc&onSale=true"
            className="flex items-center gap-0.5 whitespace-nowrap text-[0.8125rem] font-semibold text-[var(--color-sale)] hover:opacity-80"
          >
            View all <ChevronRight size={14} />
          </Link>
          <div className="flex gap-1">
            <button className={arrowCls} onClick={() => scroll(-1)} aria-label="Scroll left">
              <ChevronLeft size={16} />
            </button>
            <button className={arrowCls} onClick={() => scroll(1)} aria-label="Scroll right">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
      <div className="relative">
        <div
          className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [scroll-behavior:smooth] [&::-webkit-scrollbar]:hidden"
          ref={scrollRef}
        >
          {products.map((p, i) => {
            const discount = getDiscountPercent(p);
            const imgUrl = getProductImage(p.images?.[0]?.url, p.name);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="relative flex w-[140px] flex-shrink-0 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-[var(--color-text)] no-underline transition-[border-color,box-shadow] duration-100 hover:border-[var(--color-border-hover)] hover:shadow-[0_2px_8px_rgba(26,29,33,0.06)] sm:w-[160px]"
                >
                  {discount > 0 && (
                    <span className="absolute left-1.5 top-1.5 z-10 rounded bg-[var(--color-sale)] px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                  <div className="relative mb-2 flex h-20 items-center justify-center sm:h-[100px]">
                    <Image
                      src={imgUrl}
                      alt={p.name}
                      width={120}
                      height={100}
                      className="max-h-full max-w-full rounded object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getProductImageFallback("120x100");
                      }}
                    />
                  </div>
                  <h4 className="m-0 mb-1.5 line-clamp-2 min-h-[2.6em] text-xs font-semibold leading-[1.3]">
                    {p.name}
                  </h4>
                  <div className="mt-auto flex items-baseline gap-1.5">
                    <span className="text-[0.9375rem] font-extrabold text-[var(--color-sale)]">
                      {formatPrice(Number(p.price))}
                    </span>
                    {p.comparePrice && (
                      <span className="text-[0.7rem] text-[var(--color-text-tertiary)] line-through">
                        {formatPrice(Number(p.comparePrice))}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
