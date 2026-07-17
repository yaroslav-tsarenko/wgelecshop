const PLACEHOLDER_BASE = "https://placehold.co";

export function getProductImage(
  imageUrl: string | null | undefined,
  productName?: string,
  size = "400x400"
): string {
  if (imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"))) {
    return imageUrl;
  }
  const label = encodeURIComponent(productName?.slice(0, 20) || "Product");
  return `${PLACEHOLDER_BASE}/${size}/1A1D21/FFC94A.png?text=${label}`;
}

export function getProductImageFallback(size = "400x400"): string {
  return `${PLACEHOLDER_BASE}/${size}/1A1D21/FFC94A.png?text=No+Image`;
}
