"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { TimeseriesPoint } from "@/lib/types";

interface Props {
  baseline: TimeseriesPoint[];
  modified: TimeseriesPoint[];
  loading?: boolean;
}

function formatY(value: number): string {
  if (value >= 1_000_000) return `₪${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₪${(value / 1_000).toFixed(0)}K`;
  return `₪${value}`;
}

function buildData(baseline: TimeseriesPoint[], modified: TimeseriesPoint[]) {
  return baseline.map((b, i) => ({
    age: b.age,
    baseline: Math.max(0, b.netWorth),
    modified: Math.max(0, modified[i]?.netWorth ?? b.netWorth),
  }));
}

export default function ProjectionChart({ baseline, modified, loading = false }: Props) {
  const data = buildData(baseline, modified);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-slate-800">תחזית שווי נטו</h3>
        {loading && (
          <span className="text-xs text-tangerine-500 font-medium animate-pulse">מחשב...</span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 16, bottom: 20, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />

          <XAxis
            dataKey="age"
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{ value: "גיל", position: "insideBottom", fill: "#64748B", fontSize: 11, dy: 12 }}
          />

          {/* Y-axis on left for RTL — numbers still LTR */}
          <YAxis
            tickFormatter={formatY}
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={64}
            orientation="left"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
              fontSize: 12,
              direction: "rtl",
            }}
            labelStyle={{ color: "var(--text-muted)", marginBottom: 4 }}
            formatter={(value: number, name: string) => [
              formatY(value),
              name === "baseline" ? "מסלול נוכחי" : "תרחיש חדש",
            ]}
            labelFormatter={(age) => `גיל ${age}`}
          />

          <Legend
            align="right"
            iconType="line"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) =>
              value === "baseline" ? "מסלול נוכחי" : "תרחיש חדש"
            }
          />

          {/* Baseline — dashed gray */}
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#94A3B8"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: "#94A3B8" }}
          />

          {/* Modified — solid gold */}
          <Line
            type="monotone"
            dataKey="modified"
            stroke="var(--tangerine)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "var(--tangerine)", stroke: "var(--tangerine)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
