"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "מנתח את הנתונים שלך...",
  "מחשב ציון WealthIQ...",
  "יוצר תובנות מותאמות אישית...",
];

export default function LoadingAnalysis({ onComplete }: { onComplete: () => void }) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        setCompletedCount(i + 1);
        if (i === STEPS.length - 1) {
          setTimeout(onComplete, 400);
        }
      }, (i + 1) * 1000)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Animated rings */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 border-2 border-gold-400/20 rounded-full animate-ping" />
          <div className="absolute inset-2 border-2 border-gold-400/40 rounded-full animate-pulse" />
          <div className="absolute inset-4 border-2 border-gold-400/60 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🧠</span>
          </div>
        </div>

        <div className="space-y-5 text-start">
          {STEPS.map((step, i) => {
            const isCompleted = completedCount > i;
            const isActive = completedCount === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="flex items-center gap-4"
              >
                {/* Step indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? "bg-gold-400"
                      : isActive
                      ? "border-2 border-gold-400 animate-pulse"
                      : "border border-dark-50"
                  }`}
                >
                  <AnimatePresence>
                    {isCompleted && (
                      <motion.span
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="text-dark-500 text-sm font-black leading-none"
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step label */}
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isCompleted
                      ? "text-white font-medium"
                      : isActive
                      ? "text-gold-300"
                      : "text-slate-600"
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
