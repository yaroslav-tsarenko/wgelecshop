"use client";

import { useState, useMemo, useRef } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { MarketplaceProductCard } from "../MarketplaceProductCard/MarketplaceProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  comparePrice?: number | string | null;
  images: { url: string; alt?: string | null }[];
  categories?: { category: { name: string; slug: string } }[];
  quantity?: number;
  status?: string;
  isFeatured?: boolean;
  brand?: string | null;
}

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  tabs?: string[];
  bg?: "white" | "gray";
  columns?: number;
}

const gridColsCls: Record<number, string> = {
  2: "min-[1201px]:grid-cols-2",
  3: "min-[1201px]:grid-cols-3",
  4: "min-[1201px]:grid-cols-4",
  5: "min-[1201px]:grid-cols-5",
  6: "min-[1201px]:grid-cols-6",
};

export function ProductSection({
  title, subtitle, products, viewAllHref, viewAllLabel, tabs, bg = "white", columns = 5,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = useMemo(() => {
    if (!tabs || tabs.length === 0 || activeTab === 0) return products;
    const tabName = tabs[activeTab];
    return products.filter((p) =>
      p.categories?.some((c) => c.category.name === tabName)
    );
  }, [products, tabs, activeTab]);

  if (!products.length) return null;

  return (
    <section
      ref={ref}
      className={[
        "mb-6",
        bg === "gray" && "rounded-lg bg-[var(--color-bg-secondary)] p-5",
      ].filter(Boolean).join(" ")}
    >
      <motion.div
        className="mb-4 flex flex-wrap items-center gap-4 max-[480px]:flex-col max-[480px]:items-start"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-baseline gap-2">
          <h2 className="m-0 whitespace-nowrap text-lg font-extrabold text-[var(--color-text)]">{title}</h2>
          {subtitle && (
            <span className="whitespace-nowrap text-xs text-[var(--color-text-tertiary)]">{subtitle}</span>
          )}
        </div>
        {tabs && tabs.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={[
                    "cursor-pointer whitespace-nowrap rounded-[5px] border px-3 py-1 text-xs transition-[border-color,color] duration-100",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]",
                  ].join(" ")}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="ml-auto flex items-center gap-0.5 whitespace-nowrap text-[0.8125rem] font-semibold text-[var(--color-accent)] no-underline transition-opacity duration-100 hover:opacity-80 max-[480px]:ml-0"
          >
            {viewAllLabel || "View all"} <ChevronRight size={14} />
          </Link>
        )}
      </motion.div>
      <div
        className={[
          "grid gap-2 min-[481px]:gap-3",
          "grid-cols-2 md:grid-cols-4",
          gridColsCls[columns] || gridColsCls[5],
        ].join(" ")}
      >
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.5) }}
          >
            <MarketplaceProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
