"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#FFB300",
  CONFIRMED: "#FF6B1A",
  PROCESSING: "#FF8533",
  SHIPPED: "#FFC01A",
  DELIVERED: "#10b981",
  CANCELLED: "#EF4444",
  REFUNDED: "#78716C",
};

interface OrderStatusChartProps {
  data: { status: string; _count: number }[];
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map((d) => ({
    name: d.status.charAt(0) + d.status.slice(1).toLowerCase(),
    value: d._count,
    color: STATUS_COLORS[d.status] || "#71717a",
  }));

  if (chartData.length === 0) {
    return (
      <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text-muted)" }}>
        No orders yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
          style={{ fontSize: "0.75rem", fill: "#a1a1aa" }}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#171717",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            color: "#f5f5f5",
          }}
        />
        <Legend wrapperStyle={{ color: "#a1a1aa" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
