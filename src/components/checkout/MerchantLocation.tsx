import { Store } from "lucide-react";
import { COMPANY, COMPANY_ADDRESS } from "@/lib/company";

interface MerchantLocationProps {
  title: string;
  description: string;
}

export function MerchantLocation({ title, description }: MerchantLocationProps) {
  return (
    <section
      aria-label={title}
      className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3.5"
    >
      <div className="mb-2 flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text)]">
        <Store size={14} className="text-[var(--color-accent)]" />
        {title}
      </div>
      <address className="text-[0.8125rem] not-italic leading-[1.6] text-[var(--color-text-secondary)]">
        <strong className="text-[var(--color-text)]">{COMPANY.legalName}</strong>
        <br />
        {COMPANY.tradingName} — company number {COMPANY.companyNumber}
        <br />
        {COMPANY_ADDRESS}
        <br />
        <a href={COMPANY.phoneHref} className="transition-colors hover:text-[var(--color-accent)]">
          {COMPANY.phone}
        </a>
        {" · "}
        <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-[var(--color-accent)]">
          {COMPANY.email}
        </a>
      </address>
      <p className="mt-2 text-xs leading-[1.5] text-[var(--color-text-tertiary)]">{description}</p>
    </section>
  );
}
