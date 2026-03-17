"use client";
import { motion } from "framer-motion";
import type { CategoryScore } from "@/lib/types";
import { scoreToGrade } from "@/lib/utils/format";

const CATEGORY_COLORS: Record<string, string> = {
  retirement_readiness: "#60A5FA",
  financial_stability:  "#34D399",
  wealth_growth:        "#C8A24E",
  risk_management:      "#FB923C",
  fee_efficiency:       "#F472B6",
  goal_alignment:       "#A78BFA",
};

// Variants respond to parent staggerChildren
const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CategoryCard({ category }: { category: CategoryScore }) {
  const { color: gradeColor } = scoreToGrade(category.score);
  const catColor = CATEGORY_COLORS[category.category] ?? gradeColor;

  return (
    <motion.div
      variants={cardVariants}
      className="card p-5 transition-all duration-300"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        // hover handled via Tailwind pseudo - but since we're using inline style, add onHover via CSS class
      }}
      whileHover={{ borderColor: `${catColor}26` }}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* Category color dot */}
          <div
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: catColor }}
          />
          <h4 className="text-sm font-medium" style={{ color: "#E8E4DC" }}>
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
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
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
      <p className="mt-2 text-xs" style={{ color: "#5A5650" }}>
        משקל: {(category.weight * 100).toFixed(0)}%
      </p>
    </motion.div>
  );
}
