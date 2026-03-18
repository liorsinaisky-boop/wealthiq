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
      className="flex-shrink-0 overflow-x-auto px-4 pb-2"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="flex gap-2 py-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => !disabled && onSelect(q)}
            disabled={disabled}
            className="flex-shrink-0 rounded-full border px-3 py-1.5 transition-all disabled:opacity-40"
            style={{
              borderColor: "rgba(200,162,78,0.3)",
              color: "#8A8680",
              backgroundColor: "transparent",
              fontSize: "13px",
              whiteSpace: "nowrap",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (disabled) return;
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#C8A24E";
              (e.currentTarget as HTMLButtonElement).style.color = "#C8A24E";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(200,162,78,0.3)";
              (e.currentTarget as HTMLButtonElement).style.color = "#8A8680";
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
