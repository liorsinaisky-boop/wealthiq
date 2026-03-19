"use client";

import { motion } from "framer-motion";
import type { RedFlag } from "@/lib/score-engine/red-flags";

function RedFlagCard({ flag, index }: { flag: RedFlag; index: number }) {
  const isCritical = flag.severity === "critical";
  const accentColor = isCritical ? "#EF4444" : "var(--tangerine)";
  const bgColor = isCritical
    ? "rgba(239,68,68,0.06)"
    : "rgba(255,107,0,0.06)";
  const borderColor = isCritical
    ? "rgba(239,68,68,0.2)"
    : "rgba(255,107,0,0.2)";

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "stretch",
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* 8px accent border on the start (right in RTL) */}
      <div
        style={{
          width: "8px",
          flexShrink: 0,
          backgroundColor: accentColor,
        }}
      />

      <div
        style={{
          padding: "20px 24px",
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "24px",
          minWidth: 0,
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            className="font-sora font-bold"
            style={{
              fontSize: "20px",
              color: "var(--text-primary)",
              letterSpacing: "-0.3px",
              lineHeight: 1.25,
              marginBottom: "6px",
            }}
          >
            {flag.title}
          </h3>
          <p
            className="font-dm-sans"
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {flag.description}
          </p>
        </div>

        {/* Metric value */}
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <div
            className="font-jetbrains-mono font-bold"
            style={{
              fontSize: "24px",
              color: accentColor,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {flag.value}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-dim)",
              marginTop: "5px",
              whiteSpace: "nowrap",
            }}
          >
            {flag.metric}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface RedFlagsSectionProps {
  flags: RedFlag[];
}

export default function RedFlagsSection({ flags }: RedFlagsSectionProps) {
  if (flags.length === 0) return null;

  const countLabel =
    flags.length === 1 ? "בעיה אחת" : `${flags.length} בעיות`;

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2
          className="font-sora font-bold"
          style={{
            fontSize: "28px",
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
            marginBottom: "6px",
          }}
        >
          דורש טיפול מיידי
        </h2>
        <p
          className="font-dm-sans"
          style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}
        >
          נמצאו {countLabel} בפרופיל הפיננסי שלך
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {flags.map((flag, i) => (
          <RedFlagCard key={flag.id} flag={flag} index={i} />
        ))}
      </div>
    </section>
  );
}
