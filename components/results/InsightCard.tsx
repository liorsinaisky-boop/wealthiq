"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import type { Insight } from "@/lib/types";

const IMPACT_CONFIG = {
  high:   { borderColor: "#DC2626", bgColor: "rgba(239,68,68,0.05)",  badgeBg: "rgba(239,68,68,0.12)",  badgeColor: "#DC2626", label: "השפעה גבוהה" },
  medium: { borderColor: "var(--tangerine)", bgColor: "rgba(255,107,0,0.04)", badgeBg: "rgba(255,107,0,0.12)", badgeColor: "var(--tangerine)", label: "השפעה בינונית" },
  low:    { borderColor: "#059669", bgColor: "rgba(16,185,129,0.04)", badgeBg: "rgba(16,185,129,0.12)", badgeColor: "#059669", label: "השפעה נמוכה" },
};

export default function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  const cfg = IMPACT_CONFIG[insight.impact];
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${insight.titleHe}\n${insight.bodyHe}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: cfg.bgColor,
        border: `1px solid var(--border)`,
        borderRight: `4px solid ${cfg.borderColor}`,
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 text-2xl">{insight.icon}</span>
          <div className="min-w-0 flex-1">
            {/* Title + badge */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-sora text-[16px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
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
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {insight.bodyHe}
            </p>
            {/* Score impact */}
            {insight.estimatedScoreImpact && (
              <p className="mt-2 text-xs font-medium" style={{ color: "var(--tangerine)" }}>
                {insight.estimatedScoreImpact}
              </p>
            )}

            {/* Bottom row: thumbs + share */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                  {vote ? (vote === "up" ? "תודה! 👍" : "הבנו, נשפר.") : "האם זה שימושי?"}
                </span>
                {!vote && (
                  <>
                    <button
                      onClick={() => setVote("up")}
                      className="rounded-md p-1 transition-colors hover:bg-slate-100"
                      aria-label="כן, שימושי"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
                    </button>
                    <button
                      onClick={() => setVote("down")}
                      className="rounded-md p-1 transition-colors hover:bg-slate-100"
                      aria-label="לא שימושי"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
                    </button>
                  </>
                )}
              </div>
              {/* Share / copy */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-slate-100"
                style={{ color: copied ? "#059669" : "var(--text-dim)" }}
                aria-label="העתק תובנה"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "הועתק" : "העתק"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
