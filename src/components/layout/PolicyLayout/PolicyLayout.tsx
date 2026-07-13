import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { ReactNode } from "react";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

const proseCls = [
  "text-[0.875rem] leading-[1.65] text-[var(--color-text-secondary)] sm:text-[0.9375rem] sm:leading-[1.75]",
  "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-[1.0625rem] [&_h2]:font-bold [&_h2]:text-[var(--color-text)] sm:[&_h2]:mt-8 sm:[&_h2]:text-lg",
  "[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-[0.9375rem] [&_h3]:font-semibold [&_h3]:text-[var(--color-text)] sm:[&_h3]:text-base",
  "[&_p]:mb-3",
  "[&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:p-0",
  "[&_ul_li]:mb-1",
  "[&_table]:my-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-[0.8125rem] sm:[&_table]:text-sm",
  "[&_table_thead]:table [&_table_tbody]:table [&_table_tr]:table [&_table_thead]:w-full [&_table_tbody]:w-full [&_table_tr]:w-full [&_table_thead]:table-fixed [&_table_tbody]:table-fixed [&_table_tr]:table-fixed",
  "[&_table_th]:border [&_table_th]:border-[var(--color-border)] [&_table_th]:bg-[var(--color-bg-secondary)] [&_table_th]:px-2 [&_table_th]:py-1.5 [&_table_th]:text-left [&_table_th]:font-semibold [&_table_th]:text-[var(--color-text)] sm:[&_table_th]:px-3 sm:[&_table_th]:py-2",
  "[&_table_td]:border [&_table_td]:border-[var(--color-border)] [&_table_td]:px-2 [&_table_td]:py-1.5 [&_table_td]:break-words sm:[&_table_td]:px-3 sm:[&_table_td]:py-2",
].join(" ");

export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl break-words px-4 pb-16 [overflow-wrap:anywhere]">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Policies", href: "/policies" },
          { label: title },
        ]}
      />
      <h1 className="mb-5 text-[1.375rem] font-extrabold tracking-[-0.02em] text-[var(--color-text)] sm:text-[1.75rem]">
        {title}
      </h1>
      <div className={proseCls}>
        <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">Last updated: {lastUpdated}</p>
        {children}
      </div>
    </div>
  );
}

export function ContactBlock() {
  return (
    <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3.5 text-sm leading-[1.7]">
      <p>
        <strong>WGELECSHOP LTD</strong>
        <br />
        Company number: 17245887
        <br />
        Registered office: Dept 6735, 196 High Road, Wood Green, London, United Kingdom, N22 8HH
        <br />
        Phone: +44 7360 545980
        <br />
        Email: info@wgelecshop.com
      </p>
    </div>
  );
}
