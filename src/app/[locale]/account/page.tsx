"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Chip } from "@heroui/react";
import { Package, MapPin, Heart, User as UserIcon, ChevronRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { formatPrice } from "@/lib/utils/format-price";
import { format } from "date-fns";
import { accountClasses as styles } from "./account-classes";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

const statusColors: Record<string, "default" | "accent" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "accent",
  PROCESSING: "accent",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

export default function AccountPage() {
  const t = useTranslations("account");
  const { user, loading } = useAuth();
  const { currency, convert } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data.data) ? data.data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
        {t("title")}
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem", fontSize: "0.9375rem" }}>
        {t("welcome", { name: user?.name || user?.email || "" })}
      </p>

      <div className={styles.cardsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Orders</span>
          <span className={styles.statCardValue}>{orders.length}</span>
          <span className={styles.statCardSub}>All-time</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Total Spent</span>
          <span className={styles.statCardValue}>{formatPrice(convert(totalSpent), currency)}</span>
          <span className={styles.statCardSub}>Across all orders</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Account</span>
          <span className={styles.statCardValue} style={{ fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</span>
          <span className={styles.statCardSub}>{user?.name || "No name set"}</span>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 700 }}>Recent Orders</h2>
            <Link href="/account/orders" style={{ fontSize: "0.8125rem", color: "var(--color-accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {ordersLoading ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-tertiary)" }}>Loading...</div>
          ) : recentOrders.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-lg)", color: "var(--color-text-tertiary)" }}>
              <Package size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
              <p style={{ fontSize: "0.875rem" }}>No orders yet</p>
              <Link href="/catalog" style={{ display: "inline-block", marginTop: "0.75rem", color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className={styles.orderList}>
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`} className={styles.orderCard}>
                  <div className={styles.orderCardMain}>
                    <div className={styles.orderCardNumber}>#{order.orderNumber.slice(-8)}</div>
                    <div className={styles.orderCardDate}>{format(new Date(order.createdAt), "MMM d, yyyy")}</div>
                  </div>
                  <Chip size="sm" color={statusColors[order.status] || "default"}>{order.status}</Chip>
                  <span className={styles.orderCardPrice}>{formatPrice(convert(Number(order.total)), currency)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.quickLinks}>
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "0.75rem" }}>Quick Links</h2>
          <Link href="/account/orders" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}><Package size={16} /></span>
            <span style={{ flex: 1 }}>{t("orders")}</span>
            <ChevronRight size={16} color="var(--color-text-tertiary)" />
          </Link>
          <Link href="/account/profile" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}><UserIcon size={16} /></span>
            <span style={{ flex: 1 }}>{t("profile")}</span>
            <ChevronRight size={16} color="var(--color-text-tertiary)" />
          </Link>
          <Link href="/account/addresses" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}><MapPin size={16} /></span>
            <span style={{ flex: 1 }}>{t("addresses")}</span>
            <ChevronRight size={16} color="var(--color-text-tertiary)" />
          </Link>
          <Link href="/account/wishlist" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}><Heart size={16} /></span>
            <span style={{ flex: 1 }}>{t("wishlist")}</span>
            <ChevronRight size={16} color="var(--color-text-tertiary)" />
          </Link>
        </div>
      </div>
    </div>
  );
}
