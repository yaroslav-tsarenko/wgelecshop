/**
 * Tailwind class constants for the checkout page — replaces checkout.module.css.
 */
export const checkoutClasses = {
  wrapper: "mx-auto max-w-[var(--max-width)] px-4 pb-16",

  layout:
    "grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10",

  formCard:
    "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:gap-5 sm:rounded-[var(--radius-xl)] sm:p-8",

  twoCol: "grid grid-cols-1 gap-4 min-[481px]:grid-cols-2",

  sidebar:
    "static -order-1 h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:rounded-[var(--radius-xl)] sm:p-7 lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+1rem)] lg:order-none",

  stepIndicator:
    "mb-6 flex items-center gap-0 rounded-2xl bg-[var(--color-bg-secondary)] p-1 min-[481px]:mb-8",

  stepLabel: "hidden min-[481px]:inline",

  title:
    "mb-3 text-[1.375rem] font-extrabold tracking-[-0.03em] min-[481px]:mb-4 min-[481px]:text-[1.75rem]",
} as const;
