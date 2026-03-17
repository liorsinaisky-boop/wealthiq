"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { FinancialProfile, WealthIQResult, Insight } from "@/lib/types";
import { calculateWealthIQ } from "@/lib/score-engine/composite";
import ScoreGauge from "@/components/results/ScoreGauge";
import CategoryCard from "@/components/results/CategoryCard";
import InsightCard from "@/components/results/InsightCard";
import NetWorthChart from "@/components/results/NetWorthChart";
import LoadingAnalysis from "@/components/results/LoadingAnalysis";
import SimulatorPanel from "@/components/simulator/SimulatorPanel";
import Link from "next/link";

type Phase = "loading" | "results";

const categoryGridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function ResultsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [result, setResult] = useState<WealthIQResult | null>(null);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem("wealthiq-profile") : null;
    if (!raw) { router.push("/check"); return; }

    const parsed: FinancialProfile = JSON.parse(raw);
    setProfile(parsed);

    const wealthIQResult = calculateWealthIQ(parsed);
    setResult(wealthIQResult);

    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: wealthIQResult.insightsContext }),
    })
      .then((res) => res.json())
      .then((data) => { if (data.success && data.insights) setInsights(data.insights); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (phase === "loading") {
    return <LoadingAnalysis onComplete={() => setPhase("results")} />;
  }

  if (!result || !profile) return null;

  return (
    <main className="min-h-screen pb-20" style={{ backgroundColor: "#06080C" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          backgroundColor: "rgba(6,8,12,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-sora font-semibold text-lg" style={{ color: "#C8A24E" }}>
            WealthIQ
          </Link>
          <Link
            href="/check"
            className="text-sm transition-colors"
            style={{ color: "#8A8680" }}
          >
            בדיקה חדשה
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-10 px-6 pt-10">

        {/* Score section */}
        <section className="text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-sm uppercase tracking-[3px]"
            style={{ color: "#8A8680" }}
          >
            הציון הפיננסי שלך
          </motion.p>
          <ScoreGauge score={result.totalScore} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 text-sm"
            style={{ color: "#8A8680" }}
          >
            את/ה ב<span className="font-semibold" style={{ color: "#C8A24E" }}>טופ {100 - result.percentileEstimate}%</span> לגיל שלך
          </motion.p>
        </section>

        {/* Category grid */}
        <section>
          <h2
            className="mb-4 font-sora font-semibold text-lg"
            style={{ letterSpacing: "-0.5px" }}
          >
            ציונים לפי קטגוריה
          </h2>
          <motion.div
            className="grid grid-cols-2 gap-3 md:grid-cols-3"
            variants={categoryGridVariants}
            initial="hidden"
            animate="visible"
          >
            {result.categoryScores.map((cat) => (
              <CategoryCard key={cat.category} category={cat} />
            ))}
          </motion.div>
        </section>

        {/* Net worth chart */}
        <section>
          <NetWorthChart netWorth={result.netWorth} />
        </section>

        {/* AI Insights */}
        <section>
          <h2
            className="mb-4 font-sora font-semibold text-lg"
            style={{ letterSpacing: "-0.5px" }}
          >
            תובנות מותאמות אישית
          </h2>
          <div className="space-y-3">
            {insights.length > 0
              ? insights.map((insight, i) => (
                  <InsightCard key={insight.id} insight={insight} delay={0.1 * i} />
                ))
              : (
                <p className="text-sm" style={{ color: "#5A5650" }}>מייצר תובנות...</p>
              )
            }
          </div>
        </section>

        {/* What-If Simulator */}
        <section>
          <h2 className="mb-1 font-sora font-semibold text-lg" style={{ letterSpacing: "-0.5px" }}>
            סימולטור ״מה אם?״
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#8A8680" }}>
            הזז את המחוונים וראה איך החלטות שונות משפיעות על העתיד הפיננסי שלך
          </p>
          <SimulatorPanel profile={profile} />
        </section>

        {/* Bonuses & Penalties */}
        {result.bonusesPenalties.some(b => b.applied) && (
          <section>
            <h2 className="mb-4 font-sora font-semibold text-lg" style={{ letterSpacing: "-0.5px" }}>
              בונוסים וקנסות
            </h2>
            <div className="space-y-2">
              {result.bonusesPenalties.filter(b => b.applied).map((bp) => (
                <div
                  key={bp.id}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{
                    backgroundColor: bp.points > 0 ? "rgba(52,211,153,0.05)" : "rgba(239,68,68,0.05)",
                    borderColor: bp.points > 0 ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
                  }}
                >
                  <span
                    className="font-jetbrains-mono text-sm font-bold"
                    style={{ color: bp.points > 0 ? "#34D399" : "#EF4444" }}
                  >
                    {bp.points > 0 ? `+${bp.points}` : bp.points}
                  </span>
                  <span className="text-sm" style={{ color: "#E8E4DC" }}>{bp.descriptionHe}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <footer className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-center text-xs leading-relaxed" style={{ color: "#5A5650" }}>
            {result.disclaimer}
          </p>
        </footer>
      </div>
    </main>
  );
}
