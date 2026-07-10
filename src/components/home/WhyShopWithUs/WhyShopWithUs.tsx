"use client";

import { Shield, Zap, Heart, RefreshCw, Award, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: <Shield size={24} />,
    title: "Secure Shopping",
    desc: "Your data is protected with enterprise-grade encryption and secure payments.",
    gradient: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
  },
  {
    icon: <Zap size={24} />,
    title: "Fast Delivery",
    desc: "Free shipping on orders over €100 with express options available.",
    gradient: "linear-gradient(135deg, #0891b2 0%, #2563eb 100%)",
  },
  {
    icon: <Heart size={24} />,
    title: "Certified Products",
    desc: "Every electrical material is sourced from certified manufacturers and meets professional standards.",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)",
  },
  {
    icon: <RefreshCw size={24} />,
    title: "Easy Returns",
    desc: "Changed your mind? Return within 30 days — no questions asked.",
    gradient: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
  },
  {
    icon: <Award size={24} />,
    title: "Best Prices",
    desc: "We guarantee competitive pricing. Found it cheaper? We'll match it.",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)",
  },
  {
    icon: <Headphones size={24} />,
    title: "24/7 Support",
    desc: "Our team is available around the clock to help with anything.",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #f43f5e 100%)",
  },
];

export function WhyShopWithUs() {
  return (
    <section className="section-padding bg-[var(--color-bg-secondary)]">
      <div className="section-container">
        <div className="mb-12 text-center">
          <h2 className="section-title">Why choose AvontShop</h2>
          <p className="section-subtitle mx-auto mt-2">
            Professional-grade electrical materials with expert support and fast delivery
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] p-8 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] text-white"
                style={{ background: reason.gradient }}
              >
                {reason.icon}
              </div>
              <h3 className="mb-2 text-[1.0625rem] font-bold text-[var(--color-text)]">{reason.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
