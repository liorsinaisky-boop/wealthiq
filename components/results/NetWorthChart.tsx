"use client";
import type { NetWorthSummary } from "@/lib/types";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils/format";
import { motion } from "framer-motion";

const ASSET_LABELS: Record<string, { label: string; color: string }> = {
  pension: { label: "פנסיה", color: "var(--tangerine)" },
  kerenHishtalmut: { label: "קרן השתלמות", color: "#F9B37E" },
  realEstate: { label: "נדל״ן", color: "#4ADE80" },
  investments: { label: "השקעות", color: "#60A5FA" },
  crypto: { label: "קריפטו", color: "#F97316" },
  savings: { label: "חסכונות", color: "#A78BFA" },
  otherAssets: { label: "אחר", color: "#94A3B8" },
};

export default function NetWorthChart({ netWorth }: { netWorth: NetWorthSummary }) {
  const assets = Object.entries(netWorth.assetBreakdown)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const total = netWorth.totalAssets || 1;

  return (
    <div className="glass-card p-6 bg-white shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold mb-4 text-slate-900">שווי נקי</h3>
      
      {/* Big number */}
      <div className="text-center mb-6">
        <span className={`text-4xl font-black ${netWorth.netWorth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {formatCurrency(netWorth.netWorth)}
        </span>
        <div className="flex justify-center gap-6 mt-2 text-sm text-slate-500">
          <span>נכסים: {formatCurrencyCompact(netWorth.totalAssets)}</span>
          <span>התחייבויות: {formatCurrencyCompact(netWorth.totalLiabilities)}</span>
        </div>
      </div>

      {/* Asset breakdown bar */}
      <div className="h-4 rounded-full overflow-hidden flex mb-4">
        {assets.map(([key, value], i) => {
          const meta = ASSET_LABELS[key];
          const pct = (value / total) * 100;
          return (
            <motion.div
              key={key}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="h-full"
              style={{ backgroundColor: meta?.color ?? "#6B7280" }}
              title={`${meta?.label}: ${formatCurrency(value)} (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {assets.map(([key, value]) => {
          const meta = ASSET_LABELS[key];
          return (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color }} />
              <span className="text-slate-500">{meta?.label}</span>
              <span className="text-slate-900 font-medium mr-auto" dir="ltr">{formatCurrencyCompact(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
