/**
 * Tailwind class constants for the product page — replaces product.module.css.
 */
export const productClasses = {
  wrapper: "mx-auto max-w-[var(--max-width)] px-4 pb-16",

  layout:
    "mt-2 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8 lg:gap-12",

  gallerySticky:
    "static md:sticky md:top-[calc(var(--header-height)+1rem)]",
} as const;
