/**
 * Tailwind class constants for the account pages — replaces account.module.css.
 */
export const accountClasses = {
  wrapper: "mx-auto max-w-[var(--max-width)] px-4 pb-16",

  layout:
    "grid grid-cols-1 items-start gap-4 md:grid-cols-[240px_1fr] md:gap-8",

  cardsGrid:
    "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4",

  dashboardGrid:
    "mt-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]",

  statCard:
    "flex flex-col gap-1.5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5",

  statCardLabel:
    "text-xs font-semibold uppercase tracking-[0.04em] text-[var(--color-text-tertiary)]",

  statCardValue: "text-2xl font-extrabold tracking-[-0.02em]",

  statCardSub: "text-xs text-[var(--color-text-secondary)]",

  quickLinks:
    "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5",

  quickLink:
    "flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-3 text-sm text-[var(--color-text)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-secondary)]",

  quickLinkIcon:
    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]",

  orderList: "flex flex-col gap-3",

  orderCard:
    "grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3.5 text-[var(--color-text)] no-underline transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-[var(--color-accent)] min-[641px]:grid-cols-[1fr_auto_auto] min-[641px]:gap-6 min-[641px]:px-6 min-[641px]:py-4",

  orderCardMain: "col-span-full min-w-0 min-[641px]:col-span-1",

  orderCardNumber: "text-[0.9375rem] font-bold",

  orderCardDate: "mt-0.5 text-xs text-[var(--color-text-tertiary)]",

  orderCardItems: "mt-1 text-xs text-[var(--color-text-tertiary)]",

  orderCardPrice: "whitespace-nowrap text-base font-bold min-[641px]:text-[0.9375rem]",

  detailHeader:
    "mb-6 flex flex-wrap items-center justify-between gap-4",

  detailInfoGrid: "mb-6 grid grid-cols-1 gap-4 min-[641px]:grid-cols-2",

  detailInfoBlock:
    "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4",

  detailInfoTitle:
    "mb-2 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-tertiary)]",

  detailInfoText: "text-sm leading-relaxed text-[var(--color-text-secondary)]",

  itemsBlock:
    "overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]",

  itemsTable:
    "hidden w-full border-collapse min-[641px]:table [&_th]:border-b [&_th]:border-[var(--color-border)] [&_th]:bg-[var(--color-bg-secondary)] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-[var(--color-text-tertiary)] [&_td]:border-b [&_td]:border-[var(--color-border)] [&_td]:px-4 [&_td]:py-3.5 [&_td]:text-sm [&_tr:last-child_td]:border-b-0",

  totals:
    "flex flex-col items-end gap-1 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-4 text-sm",

  totalsRow: "flex gap-4",

  totalsTotal:
    "mt-1 flex w-full justify-between border-t border-[var(--color-border)] pt-2 text-lg font-extrabold",

  itemsMobile: "flex flex-col min-[641px]:hidden",

  itemRow:
    "flex flex-col gap-1 border-b border-[var(--color-border)] px-4 py-3.5 last:border-b-0",

  itemRowName: "text-sm font-semibold",

  itemRowMeta:
    "flex justify-between text-xs text-[var(--color-text-tertiary)]",

  itemRowTotal: "font-bold text-[var(--color-text)]",
} as const;
