"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

type Point = { year: number; name: string; value: number };

export default function EvolutionChart({
  title,
  unit,
  points
}: {
  title: string;
  unit: string;
  points: Point[];
}) {
  if (points.length < 2) return null;

  return (
    <div className="bg-surface border border-line rounded p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={points} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#C9CDBF" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#55605A" }}
            axisLine={{ stroke: "#C9CDBF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#55605A" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value: number) => [`${value} ${unit}`, ""]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
            contentStyle={{
              fontSize: 12,
              fontFamily: "monospace",
              border: "1px solid #C9CDBF",
              borderRadius: 6
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0B8457"
            strokeWidth={2}
            dot={{ r: 3, fill: "#0B8457" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
