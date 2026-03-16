"use client";
import { motion } from "framer-motion";
import type { CategoryScore } from "@/lib/types";
import { scoreToGrade } from "@/lib/utils/format";

const CATEGORY_ICONS: Record<string, string> = {
  retirement_readiness: "🏦", financial_stability: "🛡️", wealth_growth: "📈",
  risk_management: "⚖️", fee_efficiency: "💰", goal_alignment: "🎯",
};

// Variants respond to parent staggerChildren
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CategoryCard({ category }: { category: CategoryScore }) {
  const { color } = scoreToGrade(category.score);
  const icon = CATEGORY_ICONS[category.category] || "📊";

  return (
    <motion.div
      variants={cardVariants}
      className="glass-card p-5 hover:border-gold-400/20 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h4 className="font-bold text-sm">{category.categoryNameHe}</h4>
        </div>
        <span className="text-2xl font-black tabular-nums" style={{ color }}>{Math.round(category.score)}</span>
      </div>
      {/* Mini progress bar */}
      <div className="h-1.5 bg-dark-50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${category.score}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">משקל: {(category.weight * 100).toFixed(0)}%</p>
    </motion.div>
  );
}
