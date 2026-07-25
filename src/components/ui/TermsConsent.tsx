import type { ComponentPropsWithRef, ReactNode } from "react";

type TermsConsentProps = ComponentPropsWithRef<"input"> & {
  label: ReactNode;
  error?: string;
};

export function TermsConsent({ label, error, ...inputProps }: TermsConsentProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={`flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-md)] border px-3.5 py-3 text-[0.8125rem] leading-[1.55] text-[var(--color-text-secondary)] transition-colors [&_a]:font-semibold [&_a]:text-[var(--color-accent)] [&_a]:no-underline [&_a:hover]:underline ${
          error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
        }`}
      >
        <input
          type="checkbox"
          {...inputProps}
          className="mt-[0.15rem] h-4 w-4 flex-shrink-0 cursor-pointer accent-[var(--color-accent)]"
        />
        <span>{label}</span>
      </label>
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </div>
  );
}
