"use client";

import {
  Truck, RotateCcw, Shield, Gift, Award, Headphones,
  Zap, Heart, Star, Package, Clock, CheckCircle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Truck, RotateCcw, Shield, Gift, Award, Headphones,
  Zap, Heart, Star, Package, Clock, CheckCircle,
};

interface PromoItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string | null;
  linkUrl?: string | null;
}

interface Props {
  items: PromoItem[];
}

const defaultItems: PromoItem[] = [
  { id: "1", icon: "Truck", title: "Free Delivery", subtitle: "Orders over €100" },
  { id: "2", icon: "RotateCcw", title: "Easy Returns", subtitle: "30-day policy" },
  { id: "3", icon: "Shield", title: "2-Year Warranty", subtitle: "On all products" },
  { id: "4", icon: "Gift", title: "Gift Cards", subtitle: "Available now" },
  { id: "5", icon: "Award", title: "Premium Quality", subtitle: "Certified goods" },
  { id: "6", icon: "Headphones", title: "24/7 Support", subtitle: "Always here" },
];

export function PromoStrip({ items }: Props) {
  const data = items.length > 0 ? items : defaultItems;

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 overflow-x-auto px-4 py-2.5 md:justify-between [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:justify-start">
        {data.map((b) => {
          const Icon = ICON_MAP[b.icon] || Package;
          return (
            <div
              key={b.id}
              className="flex flex-shrink-0 cursor-default items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 transition-colors duration-150 hover:bg-[var(--color-bg-secondary)]"
            >
              <Icon size={18} className="flex-shrink-0 text-[var(--color-sale)]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--color-text)]">{b.title}</span>
                {b.subtitle && <span className="text-[0.65rem] text-[var(--color-text-tertiary)]">{b.subtitle}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
