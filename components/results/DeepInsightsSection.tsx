"use client";

import type { DeepInsight } from "@/lib/types";
import DeepInsightCard from "./DeepInsightCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function DeepInsightsSection({ insights }: { insights: DeepInsight[] }) {
  return (
    <section>
      {/* Section header */}
      <ScrollReveal direction="up" delay={0}>
        <span className="section-label mb-3 inline-block">ניתוח עמוק</span>
        <h2
          className="mb-2 font-sora font-bold text-xl"
          style={{ letterSpacing: "-0.5px" }}
        >
          מתחת למכסה
        </h2>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          לחץ/י על כל קטגוריה לניתוח מלא, השוואה לממוצע, וצעדים ממוקדים
        </p>
      </ScrollReveal>

      {/* Cards grid — 2 columns */}
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight, i) => (
          <ScrollReveal key={insight.id} direction="up" delay={i * 60}>
            <DeepInsightCard insight={insight} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
