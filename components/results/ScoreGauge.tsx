"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scoreToGrade } from "@/lib/utils/format";
import type { CategoryScore } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  retirement_readiness: "#60A5FA",
  financial_stability:  "#34D399",
  wealth_growth:        "#C8A24E",
  risk_management:      "#FB923C",
  fee_efficiency:       "#F472B6",
  goal_alignment:       "#A78BFA",
};

interface ScoreGaugeProps {
  score: number;
  size?: number;
  categoryScores?: CategoryScore[];
}

export default function ScoreGauge({ score, size = 280, categoryScores }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { gradeHe, color } = scoreToGrade(score);

  // Count-up animation
  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!showBreakdown ? (
          <motion.div
            key="ring"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative cursor-pointer"
            style={{ width: size, height: size }}
            onClick={() => categoryScores && setShowBreakdown(true)}
            title={categoryScores ? "לחץ לפירוט קטגוריות" : undefined}
          >
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
              />
              <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                style={{
                  filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 22px ${color}40)`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-sora font-bold tabular-nums"
                style={{ fontSize: "52px", lineHeight: 1, color, letterSpacing: "-2px" }}
              >
                {displayScore}
              </span>
              <span
                className="mt-2 uppercase tracking-[3px]"
                style={{ fontSize: "11px", color: "#5A5650" }}
              >
                {categoryScores ? "לחץ לפירוט" : "הציון שלך"}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer rounded-2xl p-6"
            style={{
              width: size,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onClick={() => setShowBreakdown(false)}
            title="לחץ לחזרה לציון"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-sora text-lg font-bold" style={{ color }}>
                {score}
              </span>
              <span className="text-xs uppercase tracking-[2px]" style={{ color: "#5A5650" }}>
                לחץ לחזרה
              </span>
            </div>
            <div className="space-y-3">
              {(categoryScores ?? []).map((cat) => {
                const catColor = CATEGORY_COLORS[cat.category] ?? color;
                return (
                  <div key={cat.category}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                        <span className="text-xs" style={{ color: "#8A8680" }}>{cat.categoryNameHe}</span>
                      </div>
                      <span className="font-jetbrains-mono text-xs font-bold" style={{ color: catColor }}>
                        {Math.round(cat.score)}
                      </span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: catColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grade label */}
      {!showBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-4 text-center"
        >
          <span className="font-sora text-2xl font-bold" style={{ color }}>{gradeHe}</span>
        </motion.div>
      )}
    </div>
  );
}
