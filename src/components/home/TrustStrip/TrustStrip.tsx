"use client";

import { useRef } from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { motion, useInView } from "framer-motion";

const items = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over €100", color: "#E8F5E9", iconColor: "#2E7D32" },
  { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected checkout", color: "#E3F2FD", iconColor: "#1565C0" },
  { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy", color: "#FFF3E0", iconColor: "#E65100" },
  { icon: Headphones, label: "24/7 Support", desc: "We're always here to help", color: "#F3E5F5", iconColor: "#6A1B9A" },
];

export function TrustStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <section
      ref={ref}
      className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-5 min-[481px]:grid-cols-2 md:grid-cols-4"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <motion.div
            key={item.label}
            className={[
              "flex items-center gap-3 py-2",
              !isLast && "md:border-r md:border-[var(--color-border)] md:pr-4",
              i < 2 && !isLast && "min-[481px]:max-md:border-b min-[481px]:max-md:border-[var(--color-border)] min-[481px]:max-md:pb-3",
              !isLast && "max-[480px]:border-b max-[480px]:border-[var(--color-border)] max-[480px]:pb-3",
            ].filter(Boolean).join(" ")}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <motion.div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: item.color }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <item.icon size={20} style={{ color: item.iconColor }} />
            </motion.div>
            <div>
              <p className="m-0 mb-0.5 text-[0.8125rem] font-bold leading-tight text-[var(--color-text)]">
                {item.label}
              </p>
              <p className="m-0 text-[0.7rem] leading-snug text-[var(--color-text-tertiary)]">
                {item.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
