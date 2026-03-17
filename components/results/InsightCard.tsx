"use client";
import { motion } from "framer-motion";
import type { Insight } from "@/lib/types";

const IMPACT_COLORS = { high: "border-red-500/30 bg-red-500/5", medium: "border-yellow-500/30 bg-yellow-500/5", low: "border-green-500/30 bg-green-500/5" };
const IMPACT_LABELS = { high: "השפעה גבוהה", medium: "השפעה בינונית", low: "השפעה נמוכה" };

export default function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-5 rounded-xl border ${IMPACT_COLORS[insight.impact]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm">{insight.titleHe}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-current opacity-60">
              {IMPACT_LABELS[insight.impact]}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{insight.bodyHe}</p>
          <p className="text-xs text-gold-400/60 mt-2">{insight.estimatedScoreImpact}</p>
        </div>
      </div>
    </motion.div>
  );
}
