"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Flame, Apple, Wind, Gift, Smartphone, Gamepad2,
  Lightbulb, Sparkles, Tag, Package, Star, Zap,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Flame, Apple, Wind, Gift, Smartphone, Gamepad2,
  Lightbulb, Sparkles, Tag, Package, Star, Zap,
};

interface TabData {
  id: string;
  label: string;
  icon?: string | null;
  linkUrl: string;
  color: string;
}

interface Props {
  tabs: TabData[];
}

export function HorizontalTabs({ tabs }: Props) {
  const [active, setActive] = useState(0);

  if (!tabs.length) return null;

  return (
    <div className="mb-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab, i) => {
          const Icon = tab.icon ? ICON_MAP[tab.icon] : Tag;
          const isActive = i === active;
          return (
            <Link
              key={tab.id}
              href={tab.linkUrl}
              onClick={() => setActive(i)}
              className={[
                "flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-[0.8125rem] font-medium no-underline transition-[border-color,box-shadow] duration-100",
                isActive
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-text)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-border-hover)] hover:shadow-[0_1px_3px_rgba(26,29,33,0.06)]",
              ].join(" ")}
            >
              <Icon size={15} style={{ color: tab.color }} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
