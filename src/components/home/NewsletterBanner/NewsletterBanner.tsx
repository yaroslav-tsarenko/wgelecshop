"use client";

import { useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <motion.section
      ref={ref}
      className="relative mb-6 flex flex-col items-stretch gap-8 overflow-hidden rounded-lg bg-[var(--color-accent)] px-6 py-6 text-center text-white md:flex-row md:items-center md:justify-between md:px-10 md:py-8 md:text-left before:pointer-events-none before:absolute before:-right-[10%] before:-top-[40%] before:h-[300px] before:w-[300px] before:rounded-full before:bg-white/[0.06] before:content-[''] after:pointer-events-none after:absolute after:-bottom-[50%] after:left-[10%] after:h-[200px] after:w-[200px] after:rounded-full after:bg-white/[0.04] after:content-['']"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative z-10 flex-1"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-2.5 flex items-center justify-center gap-3 md:justify-start">
          <motion.div
            className="flex h-[52px] w-[52px] flex-shrink-0 flex-col items-center justify-center rounded-full bg-white/20 leading-none backdrop-blur"
            animate={isInView ? { rotate: [0, -8, 8, -4, 0] } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-xl font-black">10%</span>
            <span className="text-[0.5rem] font-bold uppercase tracking-[0.05em]">OFF</span>
          </motion.div>
          <div>
            <h2 className="m-0 text-xl font-extrabold leading-tight">Subscribe & Save 10%</h2>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed opacity-85">
              Get exclusive deals, new arrivals &amp; special offers straight to your inbox.
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative z-10 flex flex-shrink-0 flex-col gap-2 md:flex-row"
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {submitted ? (
          <motion.span
            className="flex items-center gap-2 text-sm font-semibold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle size={18} /> You&apos;re in! Check your inbox.
          </motion.span>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border-2 border-white/25 bg-white/15 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm placeholder:text-white/60 transition-colors duration-200 focus:border-white/50 md:w-[260px]"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg border-none bg-white px-6 py-3 text-sm font-bold text-[var(--color-accent)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(15,23,42,0.15)]"
            >
              Subscribe
            </button>
          </form>
        )}
      </motion.div>
    </motion.section>
  );
}
