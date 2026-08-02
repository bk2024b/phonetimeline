"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { YearCount } from "@/lib/queries/stats";

export default function YearsOverviewChart({ data }: { data: YearCount[] }) {
  if (data.length < 2) return null;

  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
          formatter={(value: number) => [`${value} modele${value > 1 ? "s" : ""}`, ""]}
          contentStyle={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            background: "#1A1A1D",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            color: "#fff"
          }}
          labelStyle={{ display: "none" }}
        />
        <Bar dataKey="count" fill="#00D26A" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
