"use client";

import { useTranslations } from "next-intl";
import { Truck, RotateCcw, Headphones, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const promos = [
  { icon: <Truck size={22} />, titleKey: "promoFreeShipping" as const, descKey: "promoFreeShippingDesc" as const },
  { icon: <RotateCcw size={22} />, titleKey: "promoReturns" as const, descKey: "promoReturnsDesc" as const },
  { icon: <Headphones size={22} />, titleKey: "promoSupport" as const, descKey: "promoSupportDesc" as const },
  { icon: <ShieldCheck size={22} />, titleKey: "promoSecure" as const, descKey: "promoSecureDesc" as const },
];

export function PromoBar() {
  const t = useTranslations("home");

  return (
    <section className="px-4 py-12 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="mx-auto grid max-w-[var(--max-width)] grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
        {promos.map((promo, i) => (
          <motion.div
            key={promo.titleKey}
            className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent-light)] text-[var(--color-accent)]">
              {promo.icon}
            </div>
            <div>
              <p className="text-[0.8125rem] font-bold leading-[1.3] text-[var(--color-text)]">{t(promo.titleKey)}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{t(promo.descKey)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
