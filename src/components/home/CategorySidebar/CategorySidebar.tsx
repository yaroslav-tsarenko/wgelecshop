"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight, ChevronDown, Menu, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Category[];
}

function CategoryItem({ cat, depth = 0, onNavigate }: { cat: Category; depth?: number; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const count = cat._count?.products || 0;

  return (
    <>
      <div
        className="flex items-center border-b border-[var(--color-border)] last:border-b-0"
        style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
      >
        <Link
          href={`/catalog/${cat.slug}`}
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2 py-2 pl-0 pr-1 text-[0.8125rem] text-[var(--color-text)] no-underline transition-colors duration-100 hover:text-[var(--color-accent)]"
        >
          <span className="min-w-0 flex-1 truncate">{cat.name}</span>
          {count > 0 && (
            <span className="flex-shrink-0 text-[0.6875rem] text-[var(--color-text-tertiary)]">{count}</span>
          )}
        </Link>
        {hasChildren && (
          <button
            onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="mr-1 flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent text-[var(--color-text-tertiary)] transition-[background,color] duration-100 hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text)]"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
      {hasChildren && expanded && cat.children!.map((child) => (
        <CategoryItem key={child.id} cat={child} depth={depth + 1} onNavigate={onNavigate} />
      ))}
    </>
  );
}

export function CategorySidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open categories"
        className="flex items-center gap-2 rounded-lg border-none bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white lg:hidden"
      >
        <Menu size={20} />
        <span>Categories</span>
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 lg:hidden" onClick={closeMobile} />
      )}

      <aside
        className={[
          "h-fit w-60 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]",
          "max-lg:fixed max-lg:top-0 max-lg:z-[1000] max-lg:h-screen max-lg:w-[280px] max-lg:overflow-y-auto max-lg:rounded-none max-lg:border-0 max-lg:transition-[left] max-lg:duration-[250ms] max-lg:ease-in-out",
          mobileOpen ? "max-lg:left-0" : "max-lg:-left-[300px]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between bg-[#0f172a] px-4 py-3 text-white">
          <h3 className="m-0 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.03em]">
            <Menu size={16} />
            Catalog
          </h3>
          <button
            onClick={closeMobile}
            aria-label="Close categories"
            className="hidden cursor-pointer border-none bg-transparent p-0.5 text-white max-lg:block"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex max-h-[70vh] flex-col overflow-y-auto">
          {categories.length === 0 ? (
            <div className="flex flex-col">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2.5 last:border-b-0"
                >
                  <div
                    className="h-3 flex-shrink-0 animate-shimmer rounded-md [background:linear-gradient(90deg,var(--color-bg-tertiary)_25%,var(--color-bg-secondary)_50%,var(--color-bg-tertiary)_75%)] [background-size:200%_100%]"
                    style={{ width: `${55 + (i * 17) % 35}%` }}
                  />
                  <div className="ml-auto h-3 w-6 animate-shimmer rounded-md [background:linear-gradient(90deg,var(--color-bg-tertiary)_25%,var(--color-bg-secondary)_50%,var(--color-bg-tertiary)_75%)] [background-size:200%_100%]" />
                </div>
              ))}
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryItem key={cat.id} cat={cat} onNavigate={closeMobile} />
            ))
          )}
        </nav>
      </aside>
    </>
  );
}
