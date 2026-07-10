"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string | null }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-2 text-[var(--color-text-tertiary)] sm:aspect-[4/3] sm:rounded-[var(--radius-xl)] sm:p-4">
          No Image
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-2 sm:aspect-[4/3] sm:rounded-[var(--radius-xl)] sm:p-4">
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={[
                "relative h-14 w-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border-2 bg-[var(--color-bg-tertiary)] transition-[border-color,transform] duration-200 hover:border-[var(--color-border-hover)] hover:scale-105 sm:h-[72px] sm:w-[72px]",
                index === selectedIndex
                  ? "border-[var(--color-accent)]"
                  : "border-transparent",
              ].join(" ")}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                sizes="64px"
                style={{ objectFit: "contain" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
