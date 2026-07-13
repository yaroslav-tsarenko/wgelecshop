"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { formatPrice } from "@/lib/utils/format-price";
import { getProductImage, getProductImageFallback } from "@/lib/utils/product-image";
import { getDiscountPercent, type HomepageProduct } from "@/lib/homepage-products";

interface Props {
  product: HomepageProduct;
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export function DealOfTheDay({ product }: Props) {
  const [time, setTime] = useState(getTimeUntilMidnight);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const discount = getDiscountPercent(product);
  const imgUrl = getProductImage(product.images?.[0]?.url, product.name);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <motion.section
      ref={ref}
      className="relative mb-6 flex flex-col items-stretch overflow-hidden rounded-lg border border-white/[0.06] text-white md:flex-row before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:[background:radial-gradient(circle_at_80%_30%,rgba(255,107,26,0.25)_0%,transparent_60%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.12)_0%,transparent_50%)]"
      style={{ background: "linear-gradient(135deg, #1A1D21 0%, #292524 50%, #1A1D21 100%)" }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative z-10 flex flex-1 flex-col justify-center p-6 md:px-10 md:py-8"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <motion.span
            className="rounded bg-[var(--color-sale)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.05em] text-white"
            animate={isInView ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
          >
            Deal of the Day
          </motion.span>
          <div className="flex items-center gap-1.5">
            <span className="min-w-8 rounded bg-white/[0.12] px-2 py-1 text-center text-[0.8125rem] font-bold tabular-nums backdrop-blur-sm">
              {pad(time.h)}
            </span>
            <span className="text-xs opacity-50">:</span>
            <span className="min-w-8 rounded bg-white/[0.12] px-2 py-1 text-center text-[0.8125rem] font-bold tabular-nums backdrop-blur-sm">
              {pad(time.m)}
            </span>
            <span className="text-xs opacity-50">:</span>
            <span className="min-w-8 rounded bg-white/[0.12] px-2 py-1 text-center text-[0.8125rem] font-bold tabular-nums backdrop-blur-sm">
              {pad(time.s)}
            </span>
          </div>
        </div>
        <h2 className="m-0 mb-1.5 text-xl font-extrabold leading-tight md:text-2xl">{product.name}</h2>
        <p className="m-0 mb-5 max-w-[360px] text-sm leading-relaxed opacity-70">
          Limited time offer — grab it before the deal expires!
        </p>
        <div className="mb-5 flex items-baseline gap-3">
          <span className="text-[1.375rem] font-extrabold text-[#FFD740] md:text-[1.75rem]">
            {formatPrice(Number(product.price))}
          </span>
          {product.comparePrice && (
            <span className="text-base opacity-50 line-through">{formatPrice(Number(product.comparePrice))}</span>
          )}
          {discount > 0 && (
            <span className="rounded bg-[rgba(245,158,11,0.2)] px-2 py-0.5 text-xs font-bold text-[#FBBF24]">
              -{discount}%
            </span>
          )}
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-accent)] px-7 py-3 text-sm font-bold text-white no-underline transition-[transform,background] duration-150 hover:-translate-y-px hover:bg-[var(--color-accent-hover)]"
        >
          Shop Now <ArrowRight size={16} />
        </Link>
      </motion.div>
      <motion.div
        className="relative z-10 flex w-full flex-shrink-0 items-center justify-center px-6 pb-6 md:w-[280px] md:p-6"
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }}>
          <Image
            src={imgUrl}
            alt={product.name}
            width={240}
            height={200}
            className="max-h-[200px] max-w-full object-contain [filter:drop-shadow(0_8px_24px_rgba(0,0,0,0.3))]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getProductImageFallback("240x200");
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
