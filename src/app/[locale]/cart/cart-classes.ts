/**
 * Tailwind class constants for the cart page — replaces cart.module.css.
 */
export const cartClasses = {
  wrapper: "mx-auto max-w-[var(--max-width)] px-4 pb-16",

  title:
    "mb-4 text-[1.375rem] font-extrabold tracking-[-0.03em] min-[481px]:mb-6 min-[481px]:text-[1.75rem]",

  layout:
    "grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_380px] lg:gap-10",

  itemsBlock:
    "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)]",

  itemsHeader:
    "flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-[0.8125rem] min-[481px]:px-6 min-[481px]:py-4 min-[481px]:text-base",

  itemRow:
    "flex items-start gap-3.5 border-t border-[var(--color-border)] p-4 first:border-t-0 min-[641px]:items-center min-[641px]:gap-5 min-[641px]:px-6 min-[641px]:py-5",

  itemImage:
    "relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white min-[641px]:h-[100px] min-[641px]:w-[100px]",

  itemContent: "flex min-w-0 flex-1 flex-col gap-1.5",

  itemName:
    "line-clamp-2 break-words text-sm font-semibold text-[var(--color-text)] no-underline [overflow-wrap:anywhere] min-[641px]:text-[0.9375rem]",

  itemFooter:
    "mt-auto flex flex-wrap items-center justify-between gap-2.5 pt-1 min-[481px]:flex-nowrap min-[481px]:gap-3 min-[481px]:pt-2",

  itemPriceRow:
    "ml-auto flex items-center gap-2 min-[481px]:ml-0 min-[481px]:gap-4",

  summary:
    "static h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+1rem)] lg:rounded-[var(--radius-xl)] lg:p-7",

  checkoutBtn:
    "flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-[var(--color-accent)] p-4 text-base font-bold text-white no-underline shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.4)]",
} as const;
