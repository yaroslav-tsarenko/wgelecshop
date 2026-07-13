"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  lv: "LV",
  ru: "RU",
};

const iconBtnCls =
  "relative flex h-9 w-9 items-center justify-center rounded-lg border-none bg-transparent text-[#555] transition-colors duration-150 hover:bg-[#f5f5f5] hover:text-[#1A1D21] dark:text-[#aaa] dark:hover:bg-[#292524] dark:hover:text-white";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button className={iconBtnCls} onClick={() => setOpen(!open)} aria-label="Change language">
        <Globe size={20} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-20 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[var(--shadow-md)]">
          {Object.entries(LOCALE_LABELS).map(([key, label]) => {
            const active = key === locale;
            return (
              <button
                key={key}
                onClick={() => switchLocale(key)}
                className={[
                  "block w-full cursor-pointer border-none px-4 py-2 text-left text-sm text-[var(--color-text)]",
                  active ? "bg-[var(--color-bg-tertiary)] font-bold" : "bg-transparent font-normal",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
