"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart, Shield, Truck, RotateCcw, Lock } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

const WARRANTY_OPTIONS = [
  { key: "none", years: 0, percent: 0, min: 0 },
  { key: "1year", years: 1, percent: 10, min: 6.99 },
  { key: "2year", years: 2, percent: 16, min: 9.99 },
  { key: "3year", years: 3, percent: 22, min: 12.99 },
];

const WARRANTY_MIN_PRODUCT_PRICE = 15;

function calcWarrantyPrice(productPrice: number, option: typeof WARRANTY_OPTIONS[number]): number {
  if (option.percent === 0) return 0;
  return Math.max(productPrice * (option.percent / 100), option.min);
}

interface ProductInfoProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  shortDescription?: string | null;
  description?: string | null;
  brand?: string | null;
  condition: string;
  lowStockAlert: number;
  imageUrl?: string | null;
  ean?: string | null;
  reviewCount?: number;
  avgRating?: number;
  categoryPath?: { name: string; slug: string }[];
}

export function ProductInfo({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  quantity: stockQuantity,
  shortDescription,
  brand,
  condition,
  lowStockAlert,
  imageUrl,
  ean,
  reviewCount = 0,
  avgRating = 0,
}: ProductInfoProps) {
  const t = useTranslations("product");
  const [qty, setQty] = useState(1);
  const [selectedWarranty, setSelectedWarranty] = useState(0);
  const { addItem } = useCart();
  const { currency, convert } = useCurrency();
  const router = useRouter();

  const outOfStock = stockQuantity <= 0;
  const lowStock = stockQuantity > 0 && stockQuantity <= lowStockAlert;

  const warrantyAvailable = price >= WARRANTY_MIN_PRODUCT_PRICE;
  const warrantyOption = warrantyAvailable ? WARRANTY_OPTIONS[selectedWarranty] : WARRANTY_OPTIONS[0];
  const warrantyPrice = calcWarrantyPrice(price, warrantyOption);
  const totalPrice = price + warrantyPrice;

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name: warrantyOption.years > 0 ? `${name} + ${warrantyOption.years}yr warranty` : name,
      slug, sku, price: totalPrice, quantity: qty,
      imageUrl: imageUrl || null, maxQuantity: stockQuantity,
    });
  };

  const handleBuyNow = () => {
    addItem({
      productId: id,
      name: warrantyOption.years > 0 ? `${name} + ${warrantyOption.years}yr warranty` : name,
      slug, sku, price: totalPrice, quantity: qty,
      imageUrl: imageUrl || null, maxQuantity: stockQuantity,
    });
    router.push("/checkout");
  };

  const handleWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      if (data.action === "added") toast.success(t("addToWishlist"));
      else toast.success(t("removeFromWishlist"));
    } catch {
      toast.error("Please log in to use wishlist");
    }
  };

  const isOnSale = comparePrice && comparePrice > price;
  const savingsPercent = isOnSale ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const stockCls = outOfStock
    ? "text-[var(--color-danger)] bg-[rgba(239,68,68,0.08)]"
    : lowStock
    ? "text-[var(--color-warning)] bg-[rgba(245,158,11,0.08)]"
    : "text-[var(--color-success)] bg-[rgba(16,185,129,0.08)]";

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="break-words text-xl font-extrabold leading-[1.15] tracking-[-0.02em] [overflow-wrap:anywhere] min-[481px]:text-[1.375rem] md:text-[1.75rem]">
          {name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)]">{t("sku")}: {sku}</span>
          {ean && <span className="text-xs text-[var(--color-text-tertiary)]">{t("ean")}: {ean}</span>}
          {reviewCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[var(--color-warning)]">
              {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
              <span className="font-normal text-[var(--color-text-tertiary)]">({reviewCount})</span>
            </span>
          )}
        </div>
      </div>

      {shortDescription && (
        <p className="text-[0.9375rem] leading-[1.65] text-[var(--color-text-secondary)]">{shortDescription}</p>
      )}

      <hr className="m-0 h-px border-none bg-[var(--color-border)]" />

      <div className="flex items-center gap-4">
        <PriceDisplay price={price} comparePrice={comparePrice} size="lg" />
        {isOnSale && (
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-danger)] px-2.5 py-1 text-xs font-bold text-white">
            -{savingsPercent}%
          </span>
        )}
      </div>

      <p className={`inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[0.8125rem] font-semibold ${stockCls}`}>
        {outOfStock ? t("outOfStock") : lowStock ? t("onlyLeft", { count: stockQuantity }) : t("inStock")}
      </p>

      <hr className="m-0 h-px border-none bg-[var(--color-border)]" />

      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-[var(--color-text)]">
          <Shield size={14} /> {t("warranty")}
        </span>
        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("warrantyStandard")}</p>
        {warrantyAvailable && (
          <div className="grid grid-cols-2 gap-2">
            {WARRANTY_OPTIONS.map((opt, idx) => {
              const active = idx === selectedWarranty;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSelectedWarranty(idx)}
                  className={[
                    "flex cursor-pointer flex-col items-center gap-0.5 rounded-[var(--radius-lg)] border-2 px-2 py-2.5 text-center text-[0.8125rem] font-semibold text-[var(--color-text)] transition-all duration-200",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] shadow-[0_0_0_1px_var(--color-accent)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)]",
                  ].join(" ")}
                >
                  {idx === 0
                    ? t("noWarranty")
                    : t(`warrantyOption${opt.years}year` as "warrantyOption1year" | "warrantyOption2year" | "warrantyOption3year")}
                  {opt.percent > 0 && (
                    <span className="text-[0.6875rem] font-normal text-[var(--color-text-secondary)]">
                      +{formatPrice(convert(calcWarrantyPrice(price, opt)), currency)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 min-[481px]:gap-3">
        <QuantitySelector quantity={qty} maxQuantity={stockQuantity} onChange={setQty} />
        <Button
          color="primary"
          size="lg"
          onPress={handleAddToCart}
          isDisabled={outOfStock}
          startContent={<ShoppingCart size={18} />}
          style={{ flex: 1 }}
        >
          {selectedWarranty > 0 ? t("addToCartWithWarranty") : t("addToCart")}
        </Button>
        <Button
          color="default"
          size="lg"
          onPress={handleBuyNow}
          isDisabled={outOfStock}
          className="!bg-[var(--color-text)] !font-bold !text-[var(--color-bg)] hover:!opacity-85 [flex:0.6]"
        >
          {t("buyNow")}
        </Button>
        <Button
          isIconOnly
          variant="bordered"
          size="lg"
          onPress={handleWishlist}
          aria-label={t("addToWishlist")}
        >
          <Heart size={18} />
        </Button>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4">
        {brand && (
          <div className="flex justify-between border-b border-[var(--color-bg-tertiary)] py-2 text-sm">
            <span className="text-[var(--color-text-secondary)]">{t("brand")}</span>
            <span className="font-semibold text-[var(--color-text)]">{brand}</span>
          </div>
        )}
        <div className="flex justify-between border-b border-[var(--color-bg-tertiary)] py-2 text-sm">
          <span className="text-[var(--color-text-secondary)]">{t("condition")}</span>
          <span className="font-semibold text-[var(--color-text)]">{condition}</span>
        </div>
        <div className="flex justify-between border-b border-[var(--color-bg-tertiary)] py-2 text-sm last:border-b-0">
          <span className="text-[var(--color-text-secondary)]">{t("sku")}</span>
          <span className="font-semibold text-[var(--color-text)]">{sku}</span>
        </div>
        {ean && (
          <div className="flex justify-between py-2 text-sm">
            <span className="text-[var(--color-text-secondary)]">{t("ean")}</span>
            <span className="font-semibold text-[var(--color-text)]">{ean}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 min-[381px]:gap-3">
        {[
          { icon: Truck, titleKey: "freeShipping", descKey: "freeShippingDesc" },
          { icon: RotateCcw, titleKey: "easyReturns", descKey: "easyReturnsDesc" },
          { icon: Lock, titleKey: "securePayment", descKey: "securePaymentDesc" },
        ].map(({ icon: Icon, titleKey, descKey }) => (
          <div
            key={titleKey}
            className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] px-1.5 py-2.5 text-center min-[381px]:px-2 min-[381px]:py-3"
          >
            <Icon size={18} className="text-[var(--color-accent)]" />
            <span className="text-[0.6875rem] font-bold text-[var(--color-text)]">
              {t(titleKey as "freeShipping" | "easyReturns" | "securePayment")}
            </span>
            <span className="text-[0.625rem] text-[var(--color-text-tertiary)]">
              {t(descKey as "freeShippingDesc" | "easyReturnsDesc" | "securePaymentDesc")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
