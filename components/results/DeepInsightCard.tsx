"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DeepInsight } from "@/lib/types";
import BenchmarkBar from "./BenchmarkBar";

const CATEGORY_COLORS: Record<string, string> = {
  retirement: "#60A5FA",
  stability:  "#34D399",
  growth:     "#C8A24E",
  risk:       "#FB923C",
  fees:       "#F472B6",
  goals:      "#A78BFA",
};

const BENCHMARK_LABEL_STYLES: Record<string, { bg: string; color: string }> = {
  "Top 20%":       { bg: "rgba(52,211,153,0.12)",  color: "#34D399" },
  "Above average": { bg: "rgba(200,162,78,0.12)",  color: "#C8A24E" },
  "Average":       { bg: "rgba(255,255,255,0.06)", color: "#8A8680" },
  "Below average": { bg: "rgba(251,146,60,0.12)",  color: "#FB923C" },
  "Needs improvement": { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
};

function TrendIcon({ trend }: { trend: "positive" | "negative" | "neutral" }) {
  if (trend === "positive") return <TrendingUp className="h-3 w-3" style={{ color: "#34D399" }} />;
  if (trend === "negative") return <TrendingDown className="h-3 w-3" style={{ color: "#EF4444" }} />;
  return <Minus className="h-3 w-3" style={{ color: "#8A8680" }} />;
}

export default function DeepInsightCard({ insight }: { insight: DeepInsight }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[insight.category] ?? "#C8A24E";
  const benchmarkStyle = BENCHMARK_LABEL_STYLES[insight.benchmark.label] ?? BENCHMARK_LABEL_STYLES["Average"];

  return (
    <div
      className="card overflow-hidden transition-all duration-300"
      style={{
        borderColor: expanded ? `${color}20` : "rgba(255,255,255,0.06)",
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-5 py-4 text-right"
        aria-expanded={expanded}
      >
        {/* Category color dot */}
        <div
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />

        {/* Title */}
        <span className="flex-1 font-sora font-semibold text-sm" style={{ color: "#E8E4DC" }}>
          {insight.title}
        </span>

        {/* Score */}
        <span
          className="font-jetbrains-mono text-lg font-bold tabular-nums"
          style={{ color }}
        >
          {insight.score}
        </span>

        {/* Benchmark label pill */}
        <span
          className="hidden rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider sm:block"
          style={{ backgroundColor: benchmarkStyle.bg, color: benchmarkStyle.color }}
        >
          {insight.benchmark.label}
        </span>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-4 w-4" style={{ color: "#5A5650" }} />
        </motion.div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="space-y-5 px-5 pb-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Benchmark bar */}
              <div className="pt-4">
                <div className="mb-4 flex items-center justify-between text-xs" style={{ color: "#8A8680" }}>
                  <span>ציון שלך: <span className="font-jetbrains-mono font-bold" style={{ color }}>{insight.score}</span></span>
                  <span>ממוצע גיל: <span className="font-jetbrains-mono font-bold">{insight.benchmark.average}</span></span>
                  <span>פרצנטיל: <span className="font-jetbrains-mono font-bold">{insight.benchmark.percentile}%</span></span>
                </div>
                <BenchmarkBar
                  score={insight.score}
                  average={insight.benchmark.average}
                  color={color}
                />
              </div>

              {/* Analysis */}
              <p className="text-sm leading-relaxed" style={{ color: "#8A8680" }}>
                {insight.analysis}
              </p>

              {/* Actions */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A5650" }}>
                  צעדים מומלצים
                </p>
                <ol className="space-y-2">
                  {insight.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#E8E4DC" }}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color }} />
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Related metrics */}
              <div className="flex flex-wrap gap-2">
                {insight.relatedMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <TrendIcon trend={metric.trend} />
                    <span className="text-xs" style={{ color: "#8A8680" }}>{metric.label}:</span>
                    <span className="font-jetbrains-mono text-xs font-medium" style={{ color: "#E8E4DC" }}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
