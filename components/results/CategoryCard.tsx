"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CategoryScore, DeepInsight } from "@/lib/types";
import { scoreToGrade } from "@/lib/utils/format";

const CATEGORY_COLORS: Record<string, string> = {
  retirement_readiness: "#60A5FA",
  financial_stability:  "#34D399",
  wealth_growth:        "#FF6B00",
  risk_management:      "#FB923C",
  fee_efficiency:       "#F472B6",
  goal_alignment:       "#A78BFA",
};

// Variants respond to parent staggerChildren
const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CategoryCard({ category, deepInsight }: { category: CategoryScore; deepInsight?: DeepInsight }) {
  const { color: gradeColor } = scoreToGrade(category.score);
  const catColor = CATEGORY_COLORS[category.category] ?? gradeColor;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="card p-5 cursor-pointer bg-white"
      style={{ borderColor: expanded ? `${catColor}30` : "var(--border)" }}
      whileHover={{
        y: -4,
        borderColor: `${catColor}26`,
        transition: { duration: 0.2 },
      }}
      onClick={() => deepInsight && setExpanded((p) => !p)}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* Category color dot */}
          <div
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: catColor }}
          />
          <h4 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {category.categoryNameHe}
          </h4>
        </div>
        {/* Score */}
        <span
          className="font-jetbrains-mono text-xl font-bold tabular-nums"
          style={{ color: catColor }}
        >
          {Math.round(category.score)}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-[3px] overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(15,23,42,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: catColor }}
          initial={{ width: 0 }}
          animate={{ width: `${category.score}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Weight */}
      <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
        משקל: {(category.weight * 100).toFixed(0)}%
        {deepInsight && (
          <span style={{ color: catColor, opacity: 0.6 }}> · לחץ לפרטים</span>
        )}
      </p>

      {/* Expanded metrics */}
      <AnimatePresence>
        {expanded && deepInsight && deepInsight.relatedMetrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
              {deepInsight.relatedMetrics.slice(0, 3).map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{m.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-jetbrains-mono text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{m.value}</span>
                    {m.trend === "positive" && <TrendingUp  className="h-3 w-3" style={{ color: "#059669" }} />}
                    {m.trend === "negative" && <TrendingDown className="h-3 w-3" style={{ color: "#DC2626" }} />}
                    {m.trend === "neutral"  && <Minus className="h-3 w-3 text-slate-400" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
