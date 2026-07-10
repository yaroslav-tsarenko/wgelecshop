"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Lock, Eye, EyeOff, ShoppingBag, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authClasses as styles } from "../auth-classes";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("passwordsMismatch"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  } as const;

  if (!token) {
    return (
      <div className={styles.authPage}>
        <motion.div
          className={styles.authCard}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className={styles.authHeader}>
            <div className={styles.logoIcon}>
              <ShoppingBag size={24} />
            </div>
            <h1 className={styles.authTitle}>{t("invalidResetLink")}</h1>
            <p className={styles.authSubtitle}>{t("invalidResetLinkDesc")}</p>
          </div>
          <p className={styles.authFooter}>
            <Link href="/auth/forgot-password">{t("requestNewLink")}</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div className={styles.authHeader} custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <div className={styles.logoIcon}>
            <ShoppingBag size={24} />
          </div>
          <h1 className={styles.authTitle}>{t("resetPasswordTitle")}</h1>
          <p className={styles.authSubtitle}>{t("resetPasswordSubtitle")}</p>
        </motion.div>

        {success ? (
          <motion.div className={styles.magicLinkSent} custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <CheckCircle size={32} />
            <p>{t("passwordResetSuccess")}</p>
            <p style={{ marginTop: "1rem" }}>
              <Link href="/auth/login">{t("signIn")}</Link>
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <motion.div className={styles.inputGroup} custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <label className={styles.inputLabel}>{t("newPassword")}</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                  className={`${styles.input} ${styles.inputWithToggle}`}
                />
                <button
                  type="button"
                  className={styles.inputToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div className={styles.inputGroup} custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <label className={styles.inputLabel}>{t("confirmPassword")}</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your new password"
                  className={`${styles.input} ${styles.inputWithToggle}`}
                />
                <button
                  type="button"
                  className={styles.inputToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className={styles.submitButton}>
              <Button type="submit" color="primary" fullWidth isLoading={loading}>
                {t("resetPassword")}
              </Button>
            </motion.div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
