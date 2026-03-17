"use client";

import { motion } from "framer-motion";

interface BenchmarkBarProps {
  score: number;       // 0-100 — user's score
  average: number;     // 0-100 — benchmark average
  color: string;       // category color
}

export default function BenchmarkBar({ score, average, color }: BenchmarkBarProps) {
  return (
    <div className="relative">
      {/* Average label — positioned above the marker */}
      <div
        className="absolute -top-5 flex flex-col items-center"
        style={{ left: `${average}%`, transform: "translateX(-50%)" }}
      >
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "#5A5650" }}>
          ממוצע
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-[6px] w-full overflow-visible rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Fill — animated from 0 to score position */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color, opacity: 0.85 }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />

        {/* Average marker line */}
        <div
          className="absolute top-1/2 h-4 w-[2px] -translate-y-1/2"
          style={{
            left: `${average}%`,
            backgroundColor: "#5A5650",
            borderRadius: "1px",
          }}
        />

        {/* User score dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${score}%`,
            transform: "translate(-50%, -50%)",
            width: "12px",
            height: "12px",
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            border: "2px solid #06080C",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="mt-1 flex justify-between text-[10px]" style={{ color: "#5A5650" }}>
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
