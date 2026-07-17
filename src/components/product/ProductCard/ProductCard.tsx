"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShoppingCart, Heart, ImageOff } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { useCart } from "@/providers/CartProvider";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  imageUrl?: string | null;
  category?: string;
  quantity: number;
}

export function ProductCard({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  imageUrl,
  category,
  quantity,
}: ProductCardProps) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const isOnSale = comparePrice && comparePrice > price;
  const outOfStock = quantity <= 0;
  const showImage = imageUrl && !imageFailed;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      productId: id,
      name,
      slug,
      sku,
      price,
      quantity: 1,
      imageUrl: imageUrl || null,
      maxQuantity: quantity,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {showImage ? (
          <div className="absolute inset-1.5 sm:inset-3">
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[0.8125rem] text-[var(--color-text-tertiary)]">
            <ImageOff size={32} />
            No Image
          </div>
        )}

        {isOnSale && (
          <span className="absolute left-3 top-3 z-[4] rounded-[var(--radius-pill)] bg-[var(--color-danger)] px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.03em] text-white">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 z-[4] rounded-[var(--radius-pill)] bg-[var(--color-text-tertiary)] px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.03em] text-white">
            {t("outOfStock")}
          </span>
        )}

        <button
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 z-[4] flex h-8 w-8 items-center justify-center rounded-[var(--radius-pill)] border-none bg-[var(--color-bg)] text-[var(--color-text-tertiary)] opacity-0 shadow-[var(--shadow-sm)] transition-[transform,color,opacity] duration-150 group-hover:opacity-100 hover:scale-[1.15] hover:text-[var(--color-danger)]"
        >
          <Heart size={14} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-1.5 sm:p-4">
        {category && (
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-accent)] sm:text-[0.6875rem]">
            {category}
          </span>
        )}
        <h3 className="line-clamp-2 min-h-[calc(0.8125rem*1.35*2)] break-words text-[0.8125rem] font-semibold leading-[1.35] text-[var(--color-text)] [overflow-wrap:anywhere] sm:min-h-[calc(0.9375rem*1.4*2)] sm:text-[0.9375rem] sm:leading-[1.4]">
          {name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceDisplay price={price} comparePrice={comparePrice} size="sm" />
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={t("addToCart")}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] border-none bg-[var(--color-accent-light)] text-[var(--color-accent)] transition-[background-color,transform] duration-150 sm:h-9 sm:w-9",
              outOfStock
                ? "cursor-not-allowed opacity-40 hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)]"
                : "cursor-pointer hover:scale-[1.08] hover:bg-[var(--color-accent)] hover:text-white active:scale-95",
            ].join(" ")}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
