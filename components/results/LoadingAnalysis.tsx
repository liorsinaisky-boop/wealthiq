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
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#06080C" }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Gold pulsing ring indicator */}
        <div className="relative mx-auto mb-10 h-28 w-28">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(200,162,78,0.15)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full"
            style={{ border: "1px solid rgba(200,162,78,0.3)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <div
            className="absolute inset-5 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(200,162,78,0.5)" }}
          >
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "#C8A24E" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-5 text-start">
          {STEPS.map((step, i) => {
            const isCompleted = completedCount > i;
            const isActive    = completedCount === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="flex items-center gap-4"
              >
                {/* Indicator circle */}
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isCompleted ? "#C8A24E" : "transparent",
                    border: isCompleted
                      ? "none"
                      : isActive
                      ? "2px solid #C8A24E"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isActive ? "0 0 12px rgba(200,162,78,0.35)" : "none",
                  }}
                >
                  <AnimatePresence>
                    {isCompleted && (
                      <motion.span
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="text-sm font-black leading-none"
                        style={{ color: "#06080C" }}
                      >
                        ✓
                      </motion.span>
                    )}
                    {isActive && !isCompleted && (
                      <motion.div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: "#C8A24E" }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <span
                  className="text-sm transition-colors duration-300"
                  style={{
                    color: isCompleted ? "#E8E4DC" : isActive ? "#C8A24E" : "#5A5650",
                    fontWeight: isCompleted ? 500 : 400,
                  }}
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
