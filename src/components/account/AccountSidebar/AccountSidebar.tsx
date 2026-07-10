"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { LayoutDashboard, Package, User, MapPin, Heart, LogOut } from "lucide-react";

const navItems = [
  { href: "/account", icon: <LayoutDashboard size={18} />, labelKey: "title" as const },
  { href: "/account/orders", icon: <Package size={18} />, labelKey: "orders" as const },
  { href: "/account/profile", icon: <User size={18} />, labelKey: "profile" as const },
  { href: "/account/addresses", icon: <MapPin size={18} />, labelKey: "addresses" as const },
  { href: "/account/wishlist", icon: <Heart size={18} />, labelKey: "wishlist" as const },
];

const linkBase =
  "flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-[var(--radius-md)] px-3.5 py-2 text-[0.8125rem] no-underline transition-colors duration-200 md:px-3 md:py-2.5 md:text-sm";

export function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account");
  const { user, signOut } = useAuth();

  return (
    <aside className="sticky top-8 flex h-fit w-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-4 md:w-60 md:py-6 max-md:static">
      <div className="mb-2 flex items-center gap-3 border-b border-[var(--color-border)] px-4 pb-3 md:mb-3 md:px-5 md:pb-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-bold text-white">
          {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold leading-[1.2]">{user?.name || "User"}</p>
          <p className="max-w-[150px] truncate text-xs text-[var(--color-text-tertiary)]">{user?.email}</p>
        </div>
      </div>
      <nav className="flex gap-1.5 overflow-x-auto px-3 [scrollbar-width:none] md:flex-col md:gap-0.5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive =
            pathname.endsWith(item.href) ||
            (item.href !== "/account" && pathname.includes(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                linkBase,
                isActive
                  ? "bg-[var(--color-bg-tertiary)] font-semibold text-[var(--color-text)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text)]",
              ].join(" ")}
            >
              {item.icon}
              {t(item.labelKey)}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="flex w-full flex-shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap rounded-[var(--radius-md)] border-none bg-transparent px-3.5 py-2 text-left text-[0.8125rem] text-[var(--color-danger)] transition-colors duration-200 hover:bg-[var(--color-bg-tertiary)] md:mt-2 md:px-3 md:py-2.5 md:text-sm"
        >
          <LogOut size={18} />
          {t("logout")}
        </button>
      </nav>
    </aside>
  );
}
