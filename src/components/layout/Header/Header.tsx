"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  ShoppingCart, Search, Menu, X, User, Shield,
  ChevronRight, Heart, ChevronDown,
  Cable, LayoutGrid, Zap, Lightbulb, CircuitBoard, Plug,
  Box, Wrench, Shield as ShieldIcon, SquareStack,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import { WgelecLogo } from "../WgelecLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  children?: Category[];
}

function subtreeCount(cat: Category): number {
  const own = cat._count?.products || 0;
  return own + (cat.children || []).reduce((s, c) => s + subtreeCount(c), 0);
}

const ICON_MAP: Record<string, React.ElementType> = {
  "wiring": Cable,
  "cable": Cable,
  "automation": CircuitBoard,
  "control": CircuitBoard,
  "distribution": LayoutGrid,
  "energy": Zap,
  "protection": ShieldIcon,
  "protective": ShieldIcon,
  "fuse": Zap,
  "lighting": Lightbulb,
  "light": Lightbulb,
  "terminal": SquareStack,
  "mounting": Box,
  "box": Box,
  "conduit": Wrench,
  "connector": Plug,
  "power": Zap,
  "plug": Plug,
};

function getIconForCategory(name: string) {
  const lower = name.toLowerCase();
  for (const [keyword, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(keyword)) return Icon;
  }
  return LayoutGrid;
}

const navLinkCls =
  "flex items-center gap-1 whitespace-nowrap rounded-md border-none bg-transparent px-2.5 py-1.5 text-[0.8125rem] font-medium text-[#555] transition-colors duration-150 hover:bg-[#f5f5f5] hover:text-[#1A1D21] dark:text-[#aaa] dark:hover:bg-[#292524] dark:hover:text-white";

const iconBtnCls =
  "relative flex h-9 w-9 items-center justify-center rounded-lg border-none bg-transparent text-[#555] transition-colors duration-150 hover:bg-[#f5f5f5] hover:text-[#1A1D21] dark:text-[#aaa] dark:hover:bg-[#292524] dark:hover:text-white";

const drawerNavLinkCls =
  "flex items-center justify-between rounded-lg px-3 py-3 text-[0.9375rem] font-medium text-[#1A1D21] no-underline transition-colors duration-100 hover:bg-[#f5f5f5] dark:text-[#E7E5E4] dark:hover:bg-[#292524]";

export function Header() {
  const t = useTranslations("nav");
  const router = useRouter();
  const { itemCount, cartBounce } = useCart();
  const { user, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  const openMega = useCallback(() => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/en/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 h-[60px] border-b border-[#e5e7eb] bg-white transition-shadow duration-200",
          "dark:border-[#292524] dark:bg-[#1A1D21]",
          scrolled && "shadow-[0_2px_8px_rgba(26,29,33,0.06)]",
        ].filter(Boolean).join(" ")}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center gap-6 px-4 lg:px-6">
          <Link
            href="/"
            className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap text-2xl font-extrabold tracking-[-0.04em] text-[#1A1D21] no-underline dark:text-white"
          >
            <WgelecLogo size={24} />
            <span className="font-black text-[var(--color-accent)]">WGELECSHOP</span>
          </Link>

          <nav className="hidden flex-shrink-0 items-center gap-0.5 lg:flex">
            <Link href="/" className={navLinkCls}>
              {t("home")}
            </Link>

            <div
              className="relative"
              ref={megaRef}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button className={navLinkCls} onClick={() => setMegaOpen(!megaOpen)}>
                {t("catalog")}
                <ChevronDown
                  size={14}
                  style={{ transition: "transform 0.2s", transform: megaOpen ? "rotate(180deg)" : undefined }}
                />
              </button>
            </div>

            <Link href="/contact" className={navLinkCls}>
              {t("contact")}
            </Link>
          </nav>

          <form
            onSubmit={handleSearch}
            className="relative hidden h-[38px] max-w-[500px] flex-1 items-center overflow-hidden rounded-lg border-2 border-[var(--color-accent)] bg-white md:flex"
          >
            <Search size={16} className="pointer-events-none absolute left-2.5 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full flex-1 border-none bg-transparent pl-8 pr-3 text-[0.8125rem] text-[#333] outline-none placeholder:text-[#A8A29E]"
            />
            <button
              type="submit"
              className="h-full whitespace-nowrap border-none bg-[var(--color-accent)] px-5 text-[0.8125rem] font-semibold text-white transition-colors duration-100 hover:bg-[var(--color-accent-hover)]"
            >
              Search
            </button>
          </form>

          <div className="ml-auto flex flex-shrink-0 items-center gap-0.5">
            <Link href="/search" className={`${iconBtnCls} md:hidden`} aria-label={t("search")}>
              <Search size={20} />
            </Link>

            <ThemeToggle />
            <CurrencySwitcher />

            {user && (
              <Link href="/account/wishlist" className={iconBtnCls} aria-label="Wishlist">
                <Heart size={20} />
              </Link>
            )}

            <Link href="/cart" className={`${iconBtnCls} relative`} aria-label={t("cart")}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <motion.span
                  key={cartBounce}
                  className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full border-2 border-white bg-[var(--color-accent)] px-1 text-[0.625rem] font-bold text-white dark:border-[#1A1D21]"
                  initial={cartBounce > 0 ? { scale: 0.5 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 400 }}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.span>
              )}
            </Link>

            {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
              <a href="/admin" className={iconBtnCls} aria-label="Admin">
                <Shield size={20} />
              </a>
            )}

            {user ? (
              <Link href="/account" className={iconBtnCls} aria-label={t("account")}>
                <User size={20} />
              </Link>
            ) : (
              <Link href="/auth/login" className={iconBtnCls} aria-label={t("login")}>
                <User size={20} />
              </Link>
            )}

            <button
              className={`${iconBtnCls} lg:hidden`}
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu */}
      <AnimatePresence>
        {megaOpen && (
          <>
            <motion.div
              className="fixed inset-0 top-[60px] z-40 bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMegaOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 top-[60px] z-45 max-h-[30vh] overflow-y-auto border-b border-[#e5e7eb] bg-white shadow-[0_12px_40px_rgba(26,29,33,0.1)] dark:border-[#44403C] dark:bg-[#1A1D21]"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <div className="mx-auto max-w-[1400px] px-6 pb-4 pt-5">
                {categories.length === 0 ? (
                  <div className="grid grid-cols-3 gap-2 min-[1201px]:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                        <div className="h-9 w-9 flex-shrink-0 animate-shimmer rounded-lg [background:linear-gradient(90deg,#f0f0f0_25%,#e8e8e8_50%,#f0f0f0_75%)] [background-size:200%_100%] dark:[background:linear-gradient(90deg,#292524_25%,#1b2a44_50%,#292524_75%)] dark:[background-size:200%_100%]" />
                        <div className="flex flex-1 flex-col gap-1.5">
                          <div
                            className="h-2.5 animate-shimmer rounded-[5px] [background:linear-gradient(90deg,#f0f0f0_25%,#e8e8e8_50%,#f0f0f0_75%)] [background-size:200%_100%] dark:[background:linear-gradient(90deg,#292524_25%,#1b2a44_50%,#292524_75%)] dark:[background-size:200%_100%]"
                            style={{ width: `${55 + (i * 17) % 35}%` }}
                          />
                          <div className="h-2.5 w-2/5 animate-shimmer rounded-[5px] [background:linear-gradient(90deg,#f0f0f0_25%,#e8e8e8_50%,#f0f0f0_75%)] [background-size:200%_100%] dark:[background:linear-gradient(90deg,#292524_25%,#1b2a44_50%,#292524_75%)] dark:[background-size:200%_100%]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 min-[1201px]:grid-cols-5">
                    {[...categories]
                      .sort((a, b) => subtreeCount(b) - subtreeCount(a))
                      .slice(0, 10)
                      .map((cat) => {
                        const Icon = getIconForCategory(cat.name);
                        const count = subtreeCount(cat);
                        return (
                          <Link
                            key={cat.id}
                            href={`/catalog/${cat.slug}`}
                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#333] no-underline transition-colors duration-100 hover:bg-[#f5f5f5] dark:text-[#E7E5E4] dark:hover:bg-[#292524]"
                            onClick={() => setMegaOpen(false)}
                          >
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)] transition-colors duration-150 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                              <Icon size={20} />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-[0.8rem] font-semibold leading-tight">{cat.name}</span>
                              <span className="text-[0.675rem] text-[#A8A29E]">{count} products</span>
                            </div>
                            <ChevronRight
                              size={14}
                              className="ml-auto flex-shrink-0 text-[#D6D3D1] opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                          </Link>
                        );
                      })}
                  </div>
                )}
                <div className="mt-3 flex items-center border-t border-[#eee] pt-2.5 dark:border-[#44403C]">
                  <Link
                    href="/catalog"
                    className="group flex items-center gap-1 text-[0.8125rem] font-semibold text-[var(--color-accent)] no-underline transition-[gap] duration-150 hover:gap-2"
                    onClick={() => setMegaOpen(false)}
                  >
                    Browse all categories <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-[100] flex w-[min(85vw,380px)] flex-col bg-white shadow-[-4px_0_20px_rgba(26,29,33,0.08)] dark:bg-[#1A1D21]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-[#eee] px-5 py-4 dark:border-[#44403C]">
                <span className="text-lg font-bold text-[#1A1D21] dark:text-white">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border-none bg-transparent text-[#666] transition-colors hover:bg-[#f5f5f5] hover:text-[#333]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <nav className="flex flex-col gap-1">
                  <Link href="/" className={drawerNavLinkCls} onClick={() => setMobileOpen(false)}>
                    {t("home")} <ChevronRight size={18} />
                  </Link>
                  <Link href="/catalog" className={drawerNavLinkCls} onClick={() => setMobileOpen(false)}>
                    {t("catalog")} <ChevronRight size={18} />
                  </Link>
                  <Link href="/catalog?sort=newest" className={drawerNavLinkCls} onClick={() => setMobileOpen(false)}>
                    New Arrivals <ChevronRight size={18} />
                  </Link>
                  <Link href="/catalog?onSale=true" className={drawerNavLinkCls} onClick={() => setMobileOpen(false)}>
                    Deals <ChevronRight size={18} />
                  </Link>

                  <div className="my-2 h-px bg-[#eee] dark:bg-[#44403C]" />

                  <Link href="/contact" className={drawerNavLinkCls} onClick={() => setMobileOpen(false)}>
                    {t("contact")} <ChevronRight size={18} />
                  </Link>
                  {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <a href="/admin" className={drawerNavLinkCls} onClick={() => setMobileOpen(false)}>
                      Admin Panel <ChevronRight size={18} />
                    </a>
                  )}
                </nav>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#eee] px-5 py-4 dark:border-[#44403C]">
                {user ? (
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center justify-center rounded-lg border-none bg-[var(--color-accent)] p-3 text-sm font-semibold text-white">
                      My Account
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <div className="flex items-center justify-center rounded-lg border-none bg-[var(--color-accent)] p-3 text-sm font-semibold text-white">
                        Sign In
                      </div>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      <div className="flex items-center justify-center rounded-lg border-none bg-[#f5f5f5] p-3 text-sm font-semibold text-[#333] dark:bg-[#292524] dark:text-[#E7E5E4]">
                        Create Account
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
