"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { getProductImage, getProductImageFallback } from "@/lib/utils/product-image";

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    comparePrice?: number | string | null;
    images: { url: string; alt?: string | null }[];
    categories?: { category: { name: string; slug: string } }[];
    quantity?: number;
    status?: string;
    isFeatured?: boolean;
    brand?: string | null;
  };
}

const actionBtnCls =
  "flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)] transition-[color,border-color] duration-100 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]";

export function MarketplaceProductCard({ product }: Props) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;
  const inStock = product.quantity === undefined || product.quantity > 0;
  const imageUrl = product.images?.[0]?.url;
  const imgSrc = getProductImage(imageUrl, product.name);
  const category = product.categories?.[0]?.category;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price,
      imageUrl: imgSrc,
      quantity: 1,
      slug: product.slug,
      sku: product.id,
      maxQuantity: product.quantity ?? 99,
    });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[var(--color-border-hover)] hover:shadow-[0_8px_24px_rgba(26,29,33,0.1)]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-3">
        <Image
          src={imgSrc}
          alt={product.images?.[0]?.alt || product.name}
          width={200}
          height={200}
          className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getProductImageFallback();
          }}
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded bg-[var(--color-sale)] px-1.5 py-0.5 text-[0.7rem] font-bold text-white">
            -{discountPercent}%
          </span>
        )}
        {!inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-[0.8125rem] font-semibold text-[#666]">
            Out of Stock
          </span>
        )}
        <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100">
          <button
            className={actionBtnCls}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Add to wishlist"
          >
            <Heart size={15} />
          </button>
          <button
            className={actionBtnCls}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Quick view"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        {category && (
          <span className="mb-1 text-[0.65rem] uppercase tracking-[0.03em] text-[var(--color-text-tertiary)]">
            {category.name}
          </span>
        )}
        <h4 className="m-0 mb-1.5 line-clamp-2 text-xs font-semibold leading-[1.35] sm:text-[0.8125rem]">
          {product.name}
        </h4>
        <div className="mb-2 flex items-center gap-px">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={11}
              fill={s <= 4 ? "#f59e0b" : "none"}
              stroke={s <= 4 ? "#f59e0b" : "#D6D3D1"}
            />
          ))}
          <span className="ml-1 text-[0.65rem] text-[var(--color-text-tertiary)]">(12)</span>
        </div>
        <div className="mb-1.5 mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-[var(--color-text)] sm:text-base">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[var(--color-text-tertiary)] line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label="Add to cart"
            className={[
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border-none text-white transition-colors duration-100",
              inStock
                ? "cursor-pointer bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
                : "cursor-not-allowed bg-[#D6D3D1]",
            ].join(" ")}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
        {inStock ? (
          <span className="text-[0.65rem] font-medium text-[var(--color-success)]">In stock</span>
        ) : (
          <span className="text-[0.65rem] font-medium text-[var(--color-danger)]">Out of stock</span>
        )}
      </div>
    </Link>
  );
}
