"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators/contact";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, Send,
  CheckCircle, MessageSquare, HelpCircle, ShieldCheck,
} from "lucide-react";

const inputBaseCls =
  "w-full rounded-xl border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-light)]";
const inputWithIconCls = `${inputBaseCls} pl-11`;
const labelCls = "block mb-1.5 text-[0.8125rem] font-semibold text-[var(--color-text-secondary)]";
const errorCls = "mt-1 text-xs text-[var(--color-danger)]";

const CONTACT_INFO = [
  { icon: Mail, title: "Email Us", detail: "info@wgelecshop.com", sub: "We reply within 24 hours" },
  { icon: Phone, title: "Call Us", detail: "+44 7360 545980", sub: "Mon-Fri 9:00-18:00 GMT" },
  { icon: MapPin, title: "Our Office", detail: "London, United Kingdom", sub: "AVONTRA LTD", tooltip: "AVONTRA LTD\nCompany No. 17245887\nDept 6735, 196 High Road, Wood Green, London, United Kingdom, N22 8HH\nDirector: Helen CHAMPION" },
  { icon: Clock, title: "Working Hours", detail: "Mon-Fri 9:00-18:00", sub: "Sat 10:00-14:00" },
];

const TOPICS = [
  { icon: MessageSquare, label: "General Inquiry", value: "general" },
  { icon: HelpCircle, label: "Product Support", value: "support" },
  { icon: ShieldCheck, label: "Warranty & Returns", value: "warranty" },
  { icon: Send, label: "Business / Wholesale", value: "business" },
];

export default function ContactPage() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success(t("success"));
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 pb-16">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center sm:mb-12"
      >
        <h1 className="mb-3 text-[1.625rem] font-extrabold tracking-[-0.03em] sm:text-[2.25rem]">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-[480px] text-[0.9375rem] text-[var(--color-text-secondary)] sm:text-[1.0625rem]">
          {t("subtitle")}. We&apos;re here to help with orders, products, and any questions you may have.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:gap-4 min-[481px]:grid-cols-2 min-[901px]:grid-cols-4"
      >
        {CONTACT_INFO.map((info, i) => (
          <motion.div
            key={info.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(26,29,33,0.08)" }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-center min-[481px]:p-6"
          >
            <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--color-accent-light)] text-[var(--color-accent)]">
              <info.icon size={22} />
            </div>
            <h3 className="mb-1.5 text-sm font-bold">{info.title}</h3>
            <p
              title={"tooltip" in info ? info.tooltip : undefined}
              className={[
                "mb-1 text-sm font-semibold text-[var(--color-text)]",
                "tooltip" in info && "cursor-help",
              ].filter(Boolean).join(" ")}
            >
              {info.detail}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{info.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:rounded-[var(--radius-xl)] sm:p-8"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="px-4 py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", damping: 12, stiffness: 300 }}
                >
                  <CheckCircle size={64} className="mx-auto mb-6 text-[var(--color-success)]" />
                </motion.div>
                <h2 className="mb-3 text-2xl font-extrabold">Message Sent!</h2>
                <p className="mx-auto mb-6 max-w-[320px] leading-relaxed text-[var(--color-text-secondary)]">
                  {t("success")}
                </p>
                <Button color="primary" onPress={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                    <Send size={16} />
                  </div>
                  <h2 className="text-lg font-bold">Send us a message</h2>
                </div>

                <div>
                  <label className={labelCls}>What can we help with?</label>
                  <div className="grid grid-cols-1 gap-2 min-[381px]:grid-cols-2">
                    {TOPICS.map((topic) => {
                      const isActive = selectedTopic === topic.value;
                      return (
                        <button
                          key={topic.value}
                          type="button"
                          onClick={() => {
                            setSelectedTopic(topic.value);
                            setValue("subject", topic.label);
                          }}
                          className={[
                            "flex cursor-pointer items-center gap-2 rounded-[10px] border-[1.5px] px-3.5 py-2.5 text-[0.8125rem] transition-all duration-150",
                            isActive
                              ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] font-bold text-[var(--color-accent)]"
                              : "border-[var(--color-border)] bg-[var(--color-bg)] font-medium text-[var(--color-text-secondary)]",
                          ].join(" ")}
                        >
                          <topic.icon size={15} />
                          {topic.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 min-[481px]:grid-cols-2">
                  <div>
                    <label className={labelCls}>{t("name")}</label>
                    <input className={inputBaseCls} placeholder="John Doe" {...register("name")} />
                    {errors.name && <span className={errorCls}>{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className={labelCls}>{t("email")}</label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                      />
                      <input
                        type="email"
                        className={inputWithIconCls}
                        placeholder="your@email.com"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <span className={errorCls}>{errors.email.message}</span>}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("subject")}</label>
                  <input className={inputBaseCls} placeholder="How can we help?" {...register("subject")} />
                  {errors.subject && <span className={errorCls}>{errors.subject.message}</span>}
                </div>

                <div>
                  <label className={labelCls}>{t("message")}</label>
                  <textarea
                    rows={5}
                    className={`${inputBaseCls} resize-y leading-relaxed`}
                    placeholder="Tell us more about your question or concern..."
                    {...register("message")}
                  />
                  {errors.message && <span className={errorCls}>{errors.message.message}</span>}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    isLoading={loading}
                    style={{ width: "100%" }}
                    startContent={!loading ? <Send size={16} /> : undefined}
                  >
                    {t("send")}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-5"
        >
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] p-7">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
              <HelpCircle size={18} className="text-[var(--color-accent)]" />
              Frequently Asked
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { q: "How long does shipping take?", a: "Standard 5-7 days, Express 2-3 days." },
                { q: "What is your return policy?", a: "30-day returns on all unused items." },
                { q: "Do you ship internationally?", a: "Yes, across all EU countries." },
                { q: "How do I track my order?", a: "Check your account or email for tracking." },
              ].map((faq, i) => (
                <div key={i} className="rounded-[10px] bg-[var(--color-bg-secondary)] p-3 text-[0.8125rem]">
                  <p className="mb-1 font-semibold text-[var(--color-text)]">{faq.q}</p>
                  <p className="leading-relaxed text-[var(--color-text-tertiary)]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] p-6 text-white [background:linear-gradient(135deg,#1A1D21_0%,#292524_100%)]">
            <div className="mb-3.5 flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-sale)]" />
              <h3 className="text-[0.9375rem] font-bold">Response Times</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-[0.8125rem]">
                <span className="text-white/70">Email</span>
                <span className="font-semibold">Within 24h</span>
              </div>
              <div className="flex justify-between text-[0.8125rem]">
                <span className="text-white/70">Phone</span>
                <span className="font-semibold">Immediate</span>
              </div>
              <div className="flex justify-between text-[0.8125rem]">
                <span className="text-white/70">Wholesale</span>
                <span className="font-semibold">Within 48h</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
            <ShieldCheck size={20} className="flex-shrink-0 text-[var(--color-success)]" />
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              Your information is secure and will only be used to respond to your inquiry. We never share your data.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
