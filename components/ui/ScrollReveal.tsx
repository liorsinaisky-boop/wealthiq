"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;    // ms
  duration?: number; // ms
}

const OFFSETS = {
  up:    { y: 24, x: 0 },
  left:  { y: 0, x: -24 },
  right: { y: 0, x: 24 },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const offset = OFFSETS[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: duration / 1000, delay: delay / 1000, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
