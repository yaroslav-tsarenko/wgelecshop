"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";

interface SlideData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  bgColor: string;
  textColor: string;
  badgeText?: string | null;
}

interface DealData {
  id: string;
  title: string;
  oldPrice?: string | null;
  newPrice?: string | null;
  discountText?: string | null;
  linkUrl?: string | null;
  imageUrl?: string | null;
}

interface DefaultSlide {
  id: string;
  badgeText: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  linkUrl: string;
  bgColor: string;
  textColor: string;
  bgImage: StaticImageData;
}

const defaultSlides: DefaultSlide[] = [
  {
    id: "1",
    badgeText: "Professional Grade",
    title: "Switchgear & Distribution Boards",
    subtitle: "Certified panels, circuit breakers, and modular enclosures for residential and commercial installations",
    ctaLabel: "Shop Now",
    linkUrl: "/catalog",
    bgColor: "#1A1D21",
    textColor: "#ffffff",
    bgImage: banner1,
  },
  {
    id: "2",
    badgeText: "Complete Range",
    title: "Industrial Control & Automation",
    subtitle: "From compact enclosures to full-size distribution cabinets — everything for your next project",
    ctaLabel: "Browse Equipment",
    linkUrl: "/catalog",
    bgColor: "#FAFAF9",
    textColor: "#ffffff",
    bgImage: banner2,
  },
  {
    id: "3",
    badgeText: "Top Quality",
    title: "Cables, Wiring & Connectors",
    subtitle: "Premium copper cables, flexible wiring, terminal blocks and accessories at wholesale prices",
    ctaLabel: "View Cables",
    linkUrl: "/catalog",
    bgColor: "#0b1120",
    textColor: "#ffffff",
    bgImage: banner3,
  },
];

const bgImageMap: Record<string, StaticImageData> = {
  "1": banner1,
  "2": banner2,
  "3": banner3,
};

interface Props {
  slides: SlideData[];
  deals: DealData[];
}

const arrowCls =
  "absolute top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-100 hover:bg-white";

export function HeroCarousel({ slides, deals }: Props) {
  const useDefaults = slides.length === 0;
  const activeSlides = useDefaults ? defaultSlides : slides;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, activeSlides.length]);

  const slide = activeSlides[current];
  const bgImage = useDefaults
    ? (slide as DefaultSlide).bgImage
    : bgImageMap[slide.id] || null;

  return (
    <div className="mb-4 flex gap-3">
      <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-[10px] sm:min-h-[320px]">
        <div
          className="absolute inset-0 flex items-center transition-opacity duration-500 ease-in-out"
          style={bgImage ? { color: "#fff" } : { background: slide.bgColor, color: slide.textColor }}
        >
          {bgImage && (
            <>
              <Image
                src={bgImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="z-0 object-cover object-[center_right]"
                priority={current === 0}
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.05)_100%)]" />
            </>
          )}
          <div className="relative z-[2] max-w-[500px] p-6 sm:p-10">
            {slide.badgeText && (
              <span className="mb-4 inline-block rounded bg-[var(--color-accent)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.05em] text-white">
                {slide.badgeText}
              </span>
            )}
            <h2 className="m-0 mb-3 text-xl font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[1.75rem]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="m-0 mb-6 text-[0.9375rem] leading-relaxed opacity-85">{slide.subtitle}</p>
            )}
            {slide.linkUrl && (
              <Link
                href={slide.linkUrl}
                className="inline-block rounded-md bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white no-underline transition-opacity duration-150 hover:opacity-90"
              >
                {slide.ctaLabel || "Shop Now"}
              </Link>
            )}
          </div>
        </div>

        {activeSlides.length > 1 && (
          <>
            <button className={`${arrowCls} left-3`} onClick={prev} aria-label="Previous slide">
              <ChevronLeft size={20} />
            </button>
            <button className={`${arrowCls} right-3`} onClick={next} aria-label="Next slide">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3.5 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={[
                    "h-2 cursor-pointer border-none transition-[background,width] duration-150",
                    i === current ? "w-5 rounded bg-white" : "w-2 rounded-full bg-white/40",
                  ].join(" ")}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {deals.length > 0 && (
        <div className="hidden w-[220px] flex-shrink-0 flex-col gap-3 lg:flex">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={deal.linkUrl || "/catalog"}
              className="relative flex flex-1 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] no-underline transition-[border-color,box-shadow] duration-100 hover:border-[var(--color-border-hover)] hover:shadow-[0_2px_8px_rgba(26,29,33,0.06)]"
            >
              {deal.discountText && (
                <span className="absolute right-2 top-2 rounded bg-[var(--color-sale)] px-1.5 py-0.5 text-[0.7rem] font-bold text-white">
                  {deal.discountText}
                </span>
              )}
              <div className="mb-3 flex justify-center">
                {deal.imageUrl ? (
                  <img src={deal.imageUrl} alt={deal.title} className="h-20 w-20 rounded-lg object-contain" />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-[var(--color-bg-tertiary)]" />
                )}
              </div>
              <h4 className="m-0 mb-2 text-[0.8125rem] font-semibold leading-[1.3]">{deal.title}</h4>
              <div className="mt-auto flex items-center gap-2">
                {deal.oldPrice && (
                  <span className="text-xs text-[var(--color-text-tertiary)] line-through">{deal.oldPrice}</span>
                )}
                {deal.newPrice && (
                  <span className="text-[0.9375rem] font-bold text-[var(--color-sale)]">{deal.newPrice}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
