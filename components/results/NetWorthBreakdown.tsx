"use client";

import type { NetWorthSummary } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { he } from "@/lib/i18n/he";

const ASSET_LABELS: Record<string, { label: string; color: string }> = {
  pension: { label: "פנסיה", color: "#D4A843" },
  kerenHishtalmut: { label: "קרן השתלמות", color: "#C49A38" },
  realEstate: { label: "נדל״ן", color: "#22C55E" },
  investments: { label: "השקעות", color: "#3B82F6" },
  crypto: { label: "קריפטו", color: "#A855F7" },
  savings: { label: "חסכונות", color: "#06B6D4" },
  otherAssets: { label: "אחר", color: "#6B7280" },
};

const LIABILITY_LABELS: Record<string, { label: string; color: string }> = {
  mortgages: { label: "משכנתאות", color: "#EF4444" },
  loans: { label: "הלוואות", color: "#F97316" },
  creditCardDebt: { label: "חוב כרטיס אשראי", color: "#FB923C" },
};

export default function NetWorthBreakdown({ netWorth }: { netWorth: NetWorthSummary }) {
  const assetEntries = Object.entries(netWorth.assetBreakdown)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);

  const liabEntries = Object.entries(netWorth.liabilityBreakdown)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);

  const netWorthColor = netWorth.netWorth >= 0 ? "#22C55E" : "#EF4444";

  return (
    <div className="glass-card p-6">
      {/* Net Worth Header */}
      <div className="mb-6 text-center">
        <p className="mb-1 text-sm text-gray-400">{he.results.netWorth}</p>
        <p className="text-3xl font-black tabular-nums" style={{ color: netWorthColor }}>
          {formatCurrency(netWorth.netWorth)}
        </p>
        <div className="mt-2 flex justify-center gap-6 text-sm text-gray-400">
          <span>
            {he.results.assets}:{" "}
            <span className="font-bold text-green-400">
              {formatCurrency(netWorth.totalAssets)}
            </span>
          </span>
          <span>
            {he.results.liabilities}:{" "}
            <span className="font-bold text-red-400">
              {formatCurrency(netWorth.totalLiabilities)}
            </span>
          </span>
        </div>
      </div>

      {/* Asset Bar */}
      {assetEntries.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium text-gray-400">נכסים</p>
          <div className="flex h-4 overflow-hidden rounded-full">
            {assetEntries.map(([key, val]) => {
              const pct = (val / netWorth.totalAssets) * 100;
              const meta = ASSET_LABELS[key] || { color: "#6B7280" };
              return (
                <div
                  key={key}
                  className="transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta.color,
                    minWidth: pct > 0 ? "4px" : "0",
                  }}
                  title={`${meta.label}: ${formatCurrency(val)}`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {assetEntries.map(([key, val]) => {
              const meta = ASSET_LABELS[key] || { label: key, color: "#6B7280" };
              const pct = ((val / netWorth.totalAssets) * 100).toFixed(0);
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-gray-400">
                    {meta.label} ({pct}%)
                  </span>
                  <span className="font-medium text-gray-300">
                    {formatCurrency(val)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liability Bar */}
      {liabEntries.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">התחייבויות</p>
          <div className="flex h-4 overflow-hidden rounded-full">
            {liabEntries.map(([key, val]) => {
              const pct = (val / netWorth.totalLiabilities) * 100;
              const meta = LIABILITY_LABELS[key] || { color: "#6B7280" };
              return (
                <div
                  key={key}
                  className="transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta.color,
                    minWidth: pct > 0 ? "4px" : "0",
                  }}
                  title={`${meta.label}: ${formatCurrency(val)}`}
                />
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {liabEntries.map(([key, val]) => {
              const meta = LIABILITY_LABELS[key] || { label: key, color: "#6B7280" };
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-gray-400">{meta.label}</span>
                  <span className="font-medium text-gray-300">
                    {formatCurrency(val)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
