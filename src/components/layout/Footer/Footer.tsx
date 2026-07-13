"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { WgelecLogo } from "../WgelecLogo";
import visaLogo from "@/assets/visa-logo.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import pciDssLogo from "@/assets/pci-dss-compliant-logo-vector.svg";

const linkCls =
  "text-sm text-[var(--color-text-secondary)] transition-[color,padding-left] duration-200 hover:pl-1 hover:text-[var(--color-accent)]";

const sectionTitleCls =
  "mb-4 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[var(--color-text)]";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="mx-auto max-w-[var(--max-width)] px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-10 pt-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-accent)]"
            >
              <WgelecLogo size={28} />
              <span>WGELECSHOP</span>
            </Link>
            <p className="max-w-[280px] text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Your trusted source for electrical materials, wiring, and installation supplies. Professional quality delivered to your door.
            </p>
            <div className="mt-2 flex gap-2">
              {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border-none bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:text-white"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn size={16} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border-none bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:text-white"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className={sectionTitleCls}>Shop</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              <li><Link href="/catalog" className={linkCls}>{nav("catalog")}</Link></li>
              <li><Link href="/catalog?sort=newest" className={linkCls}>New Arrivals</Link></li>
              <li><Link href="/catalog?onSale=true" className={linkCls}>Sale</Link></li>
              <li><Link href="/catalog?sort=popular" className={linkCls}>Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={sectionTitleCls}>{nav("account")}</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              <li><Link href="/auth/login" className={linkCls}>{nav("login")}</Link></li>
              <li><Link href="/account/orders" className={linkCls}>My Orders</Link></li>
              <li><Link href="/account/wishlist" className={linkCls}>Wishlist</Link></li>
              <li><Link href="/contact" className={linkCls}>{t("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={sectionTitleCls}>Info</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              <li><Link href="/policies/terms" className={linkCls}>{t("terms")}</Link></li>
              <li><Link href="/policies/privacy" className={linkCls}>{t("privacy")}</Link></li>
              <li><Link href="/policies/returns" className={linkCls}>{t("returns")}</Link></li>
              <li><Link href="/policies/shipping" className={linkCls}>Shipping Policy</Link></li>
              <li><Link href="/policies/warranty" className={linkCls}>Warranty</Link></li>
              <li><Link href="/policies/payment" className={linkCls}>Payment Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-[var(--color-border)] py-6 md:flex-row md:justify-between">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {t("copyright", { year: currentYear, storeName: "WGELECSHOP" })}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center">
              <Image src={visaLogo} alt="Visa" height={100} width={100} className="!h-auto !w-[60px] object-contain" />
            </span>
            <span className="flex items-center justify-center">
              <Image src={mastercardLogo} alt="Mastercard" height={100} width={100} className="!h-auto !w-[60px] object-contain" />
            </span>
            <span className="flex items-center justify-center">
              <Image src={pciDssLogo} alt="PCI DSS Compliant" height={100} width={100} className="!h-auto !w-[60px] object-contain" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
