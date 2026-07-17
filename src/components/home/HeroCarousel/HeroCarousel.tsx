"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

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
  bgImage: string;
}

const defaultSlides: DefaultSlide[] = [
  {
    id: "1",
    badgeText: "New Season",
    title: "Illuminate every room",
    subtitle:
      "Designer chandeliers, pendants and table lamps to transform your home — free EU shipping over €80.",
    ctaLabel: "Shop Ceiling Lights",
    linkUrl: "/catalog/ceiling-lights",
    bgColor: "#0b1120",
    textColor: "#ffffff",
    bgImage:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "2",
    badgeText: "Smart & Efficient",
    title: "Energy-saving LED bulbs",
    subtitle:
      "E27, E14, GU10 and tubes — warm, neutral and cool white options ready to ship next-day.",
    ctaLabel: "Browse Bulbs",
    linkUrl: "/catalog/bulbs-tubes",
    bgColor: "#111827",
    textColor: "#ffffff",
    bgImage:
      "https://images.unsplash.com/photo-1543198126-a4b1f2e8c7c8?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "3",
    badgeText: "Cosy Vibes",
    title: "String & fairy lights",
    subtitle:
      "Turn any space into a warm haven with LED garlands, curtain lights and festive decorations.",
    ctaLabel: "See Decorative Lights",
    linkUrl: "/catalog/string-fairy-lights",
    bgColor: "#1a1330",
    textColor: "#ffffff",
    bgImage:
      "https://images.unsplash.com/photo-1481414085319-9f3b5000c5f8?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "4",
    badgeText: "Outdoor Ready",
    title: "Solar garden lights",
    subtitle:
      "Path lights, spotlights and wall lanterns that charge by day and shine all night — zero wiring.",
    ctaLabel: "Explore Solar",
    linkUrl: "/catalog/solar-lights",
    bgColor: "#0f172a",
    textColor: "#ffffff",
    bgImage:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
  },
];

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
  const bgImage = useDefaults ? (slide as DefaultSlide).bgImage : null;

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
                className="z-0 object-cover object-center"
                priority={current === 0}
                unoptimized
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.15)_100%)]" />
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
