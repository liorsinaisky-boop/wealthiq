"use client";

import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex-shrink-0 px-4 pb-3 pt-2"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => (
          <motion.button
            key={i}
            onClick={() => !disabled && onSelect(q)}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className="w-full rounded-full px-4 py-2 text-right font-dm-sans transition-opacity disabled:opacity-40"
            style={{
              backgroundColor: "rgba(200,162,78,0.15)",
              border: "1px solid rgba(200,162,78,0.35)",
              color: "#C8A24E",
              fontSize: "14px",
              cursor: disabled ? "not-allowed" : "pointer",
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              if (disabled) return;
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(200,162,78,0.25)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#C8A24E";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(200,162,78,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(200,162,78,0.35)";
            }}
          >
            {q}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
