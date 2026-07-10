/**
 * Tailwind class constants for the catalog page — replaces catalog.module.css.
 */
export const catalogClasses = {
  wrapper: "mx-auto max-w-[var(--max-width)] px-4",

  header: "mb-6 flex flex-wrap items-end justify-between gap-4",

  title:
    "text-[1.375rem] font-extrabold tracking-[-0.03em] min-[481px]:text-[1.75rem]",

  headerSub: "mt-1 text-sm text-[var(--color-text-secondary)]",

  headerActions:
    "flex items-center gap-2 max-[480px]:w-full max-[480px]:justify-between",

  filtersBtn:
    "hidden max-lg:inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-[0.8125rem] font-semibold text-[var(--color-text-secondary)] cursor-pointer hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",

  filterBadge:
    "rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-1.5 py-px text-[0.6875rem] font-bold text-white",

  layout: "grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]",

  sidebar:
    "hidden self-start lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+1rem)] lg:block",

  content: "min-w-0",

  pagination:
    "mt-10 flex flex-wrap items-center justify-center gap-1.5 pb-12",

  pageBtn:
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[0.8125rem] font-medium text-[var(--color-text)]",

  pageBtnActive:
    "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border-none bg-[var(--color-accent)] text-[0.8125rem] font-bold text-white",

  pageBtnEdge: "h-9 w-auto px-4",

  pageBtnDisabled: "opacity-50 cursor-not-allowed",

  pageEllipsis:
    "flex h-9 w-9 items-center justify-center text-[0.8125rem] text-[var(--color-text-secondary)]",

  overlay: "fixed inset-0 z-[200]",

  overlayBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",

  overlaySheet:
    "absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col overflow-auto rounded-t-[var(--radius-2xl)] bg-[var(--color-bg)] p-6",

  overlayHeader: "mb-4 flex items-center justify-between",

  overlayTitle: "text-lg font-bold",

  overlayClose:
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border-none bg-[var(--color-bg-tertiary)] text-[var(--color-text)]",
} as const;
