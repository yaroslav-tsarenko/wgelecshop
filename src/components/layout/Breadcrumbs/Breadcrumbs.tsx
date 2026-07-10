"use client";

import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="py-5 text-[0.8125rem]" aria-label="Breadcrumb">
      <ol className="m-0 flex flex-wrap items-center gap-2 p-0 [list-style:none]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight size={14} className="text-xs text-[var(--color-text-tertiary)]" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-accent)]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-[var(--color-text)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
