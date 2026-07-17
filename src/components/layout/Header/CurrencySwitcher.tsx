"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency, type Currency } from "@/providers/CurrencyProvider";

const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "EUR", symbol: "€", label: "EUR (€)" },
];

const iconBtnCls =
  "relative flex h-9 w-auto items-center justify-center rounded-lg border-none bg-transparent px-2 text-[0.8125rem] font-bold text-[#555] transition-colors duration-150 hover:bg-[#f5f5f5] hover:text-[#1A1D21] dark:text-[#aaa] dark:hover:bg-[#292524] dark:hover:text-white";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = CURRENCIES.find((c) => c.code === currency)!;

  return (
    <div ref={ref} className="relative">
      <button className={iconBtnCls} onClick={() => setOpen(!open)} aria-label="Currency">
        {current.symbol}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[60] mt-1.5 min-w-[120px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_4px_16px_rgba(26,29,33,0.1)]">
          {CURRENCIES.map((c) => {
            const active = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                className={[
                  "block w-full cursor-pointer border-none px-3 py-2 text-left text-[0.8125rem]",
                  active
                    ? "bg-[var(--color-accent-light)] font-bold text-[var(--color-accent)]"
                    : "bg-transparent font-medium text-[var(--color-text)]",
                ].join(" ")}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
