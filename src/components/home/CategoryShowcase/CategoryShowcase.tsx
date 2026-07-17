"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import { Lightbulb } from "lucide-react";

const GRADIENTS = [
  "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
  "linear-gradient(135deg,#1a1330 0%,#2d1b5b 100%)",
  "linear-gradient(135deg,#0b1120 0%,#1f2937 100%)",
  "linear-gradient(135deg,#111827 0%,#334155 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#3b0764 100%)",
  "linear-gradient(135deg,#0b132b 0%,#3a506b 100%)",
];

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface Props {
  categories: CategoryItem[];
}

export function CategoryShowcase({ categories }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (categories.length === 0) return null;

  return (
    <section ref={ref} className="mb-6">
      <motion.div
        className="mb-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="m-0 text-lg font-extrabold text-[var(--color-text)] sm:text-xl">
            Shop by Category
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)] sm:text-sm">
            From ambient chandeliers to tough LED bulbs — pick your vibe
          </p>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <Link
              href={`/catalog/${cat.slug}`}
              className="group relative flex aspect-[4/3] overflow-hidden rounded-xl no-underline shadow-sm ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-lg"
              style={{ background: GRADIENTS[i % GRADIENTS.length] }}
            >
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-80"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <Lightbulb size={64} className="text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="relative z-[1] mt-auto flex w-full flex-col gap-1 p-3 text-white sm:p-4">
                <h3 className="m-0 text-sm font-bold leading-tight sm:text-base">
                  {cat.name}
                </h3>
                <span className="text-[0.7rem] font-medium text-white/80 sm:text-xs">
                  {cat.productCount}+ products
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
