"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Newsletter() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <motion.section
      className="section-padding relative overflow-hidden bg-[var(--color-accent)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-white opacity-15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-[300px] w-[300px] rounded-full bg-white opacity-15 blur-[60px]" />
      <div className="relative z-10 mx-auto flex max-w-[var(--max-width)] flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex-1">
          <h2 className="mb-2 text-[1.75rem] font-extrabold tracking-[-0.02em] text-white">{t("newsletter")}</h2>
          <p className="max-w-[400px] text-[0.9375rem] leading-relaxed text-white/85">
            {t("newsletterSubtitle")}
          </p>
        </div>
        <form className="flex w-full max-w-[420px] gap-2" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletterPlaceholder")}
            className="flex-1 rounded-[var(--radius-pill)] border-2 border-white/25 bg-white/10 px-5 py-3 text-sm text-white outline-none backdrop-blur-md placeholder:text-white/55 transition-[border-color,background-color] duration-200 focus:border-white/50 focus:bg-white/[0.18]"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-pill)] border-none bg-white px-6 py-3 text-sm font-bold text-[var(--color-accent)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(15,23,42,0.18)] active:translate-y-0"
          >
            <Send size={16} />
            {t("newsletterCta")}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
