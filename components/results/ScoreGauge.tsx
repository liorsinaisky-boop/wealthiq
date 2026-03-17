"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scoreToGrade } from "@/lib/utils/format";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export default function ScoreGauge({ score, size = 280 }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
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
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Score arc */}
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

        {/* Center content */}
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
            הציון שלך
          </span>
        </div>
      </div>

      {/* Grade label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-4 text-center"
      >
        <span className="font-sora text-2xl font-bold" style={{ color }}>{gradeHe}</span>
      </motion.div>
    </div>
  );
}
