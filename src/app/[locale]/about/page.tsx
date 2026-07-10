import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Heart, Truck, Shield, Award } from "lucide-react";

const values = [
  { icon: <Heart size={28} />, title: "Customer First", desc: "Whether you're a professional electrician or a DIY installer, your satisfaction drives every decision we make." },
  { icon: <Truck size={28} />, title: "Fast & Reliable", desc: "We partner with trusted carriers to deliver your electrical supplies quickly and safely, every time." },
  { icon: <Shield size={28} />, title: "Certified Quality", desc: "Every product meets professional installation standards and is sourced from certified manufacturers." },
  { icon: <Award size={28} />, title: "Trade Pricing", desc: "We work directly with manufacturers to offer competitive trade prices on cables, switchgear, and more." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-4 text-[1.625rem] font-extrabold tracking-[-0.04em] sm:text-[2.25rem]">
            About <span className="gradient-text">AvontShop</span>
          </h1>
          <p className="mx-auto max-w-[540px] text-[0.9375rem] leading-[1.7] text-[var(--color-text-secondary)] sm:text-[1.0625rem]">
            We&apos;re on a mission to make professional-grade electrical materials accessible to electricians, contractors, and DIY installers. Finding the right cables, switchgear, and installation accessories shouldn&apos;t be complicated.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3.5 min-[601px]:grid-cols-2 min-[601px]:gap-5 sm:mb-12">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 min-[481px]:p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                {v.icon}
              </div>
              <h3 className="mb-2 text-[1.0625rem] font-bold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[var(--radius-2xl)] bg-[var(--color-accent)] p-5 text-center text-white min-[481px]:p-10">
          <h2 className="mb-3 text-xl font-extrabold min-[481px]:text-2xl">Our Promise</h2>
          <p className="mx-auto max-w-[480px] text-[0.9375rem] leading-[1.7] opacity-90">
            We stand behind every electrical product we sell. If you&apos;re not completely satisfied, we&apos;ll make it right — that&apos;s our guarantee to you.
          </p>
        </div>
      </div>
    </div>
  );
}
