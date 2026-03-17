"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { Insight } from "@/lib/types";

const IMPACT_CONFIG = {
  high:   { borderColor: "#EF4444", bgColor: "rgba(239,68,68,0.05)",  badgeBg: "rgba(239,68,68,0.12)",  badgeColor: "#EF4444", label: "השפעה גבוהה" },
  medium: { borderColor: "#C8A24E", bgColor: "rgba(200,162,78,0.04)", badgeBg: "rgba(200,162,78,0.12)", badgeColor: "#C8A24E", label: "השפעה בינונית" },
  low:    { borderColor: "#34D399", bgColor: "rgba(52,211,153,0.04)", badgeBg: "rgba(52,211,153,0.12)", badgeColor: "#34D399", label: "השפעה נמוכה" },
};

export default function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  const cfg = IMPACT_CONFIG[insight.impact];
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: cfg.bgColor,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRight: `4px solid ${cfg.borderColor}`,
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 text-2xl">{insight.icon}</span>
          <div className="min-w-0 flex-1">
            {/* Title + badge */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-sora text-[16px] font-semibold leading-snug" style={{ color: "#E8E4DC" }}>
                {insight.titleHe}
              </h4>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeColor }}
              >
                {cfg.label}
              </span>
            </div>
            {/* Body */}
            <p className="text-sm leading-relaxed" style={{ color: "#8A8680" }}>
              {insight.bodyHe}
            </p>
            {/* Score impact */}
            {insight.estimatedScoreImpact && (
              <p className="mt-2 text-xs" style={{ color: "rgba(200,162,78,0.6)" }}>
                {insight.estimatedScoreImpact}
              </p>
            )}

            {/* Thumbs feedback — cosmetic only */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs" style={{ color: "#5A5650" }}>
                {vote ? (vote === "up" ? "תודה! 👍" : "הבנו, נשפר.") : "האם זה שימושי?"}
              </span>
              {!vote && (
                <>
                  <button
                    onClick={() => setVote("up")}
                    className="rounded-md p-1 transition-colors hover:bg-white/5"
                    aria-label="כן, שימושי"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" style={{ color: "#5A5650" }} />
                  </button>
                  <button
                    onClick={() => setVote("down")}
                    className="rounded-md p-1 transition-colors hover:bg-white/5"
                    aria-label="לא שימושי"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" style={{ color: "#5A5650" }} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
