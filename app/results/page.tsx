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
import Link from "next/link";

type Phase = "loading" | "results";

const LOADING_STEPS = [
  "מנתח את התמונה הפיננסית שלך...",
  "מחשב ציון פנסיה ומוכנות לפרישה...",
  "בודק יעילות עלויות ודמי ניהול...",
  "מייצר תובנות מותאמות אישית...",
];

export default function ResultsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [result, setResult] = useState<WealthIQResult | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem("wealthiq-profile") : null;
    if (!raw) { router.push("/check"); return; }

    const profile: FinancialProfile = JSON.parse(raw);

    // Animate loading steps
    const stepTimer = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 800);

    // Calculate score (instant, deterministic)
    const wealthIQResult = calculateWealthIQ(profile);
    setResult(wealthIQResult);

    // Generate AI insights (async)
    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: wealthIQResult.insightsContext }),
    })
      .then((res) => res.json())
      .then((data) => { if (data.success && data.insights) setInsights(data.insights); })
      .catch(() => {}); // Fallback insights already in the engine

    // Show results after animation
    setTimeout(() => {
      clearInterval(stepTimer);
      setPhase("results");
    }, 3500);

    return () => clearInterval(stepTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (phase === "loading") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Animated rings */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-gold-400/20 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-gold-400/40 rounded-full animate-pulse" />
            <div className="absolute inset-4 border-2 border-gold-400/60 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🧠</span>
            </div>
          </div>

          {LOADING_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: i <= loadingStep ? 1 : 0.2, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-3 py-2 ${i <= loadingStep ? "text-white" : "text-slate-600"}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i < loadingStep ? "bg-gold-400 text-dark-500" : i === loadingStep ? "border-2 border-gold-400 animate-pulse" : "border border-slate-700"}`}>
                {i < loadingStep ? "✓" : ""}
              </span>
              <span className="text-sm">{step}</span>
            </motion.div>
          ))}
        </div>
      </main>
    );
  }

  if (!result) return null;

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-dark-500/80 backdrop-blur-md border-b border-dark-border/30 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-gold-400 font-bold text-lg">WealthIQ</Link>
          <Link href="/check" className="text-sm text-slate-400 hover:text-white transition-colors">בדיקה חדשה</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-10">
        {/* Score */}
        <section className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-slate-400 mb-6"
          >
            הציון הפיננסי שלך
          </motion.h1>
          <ScoreGauge score={result.totalScore} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-slate-400 mt-4"
          >
            את/ה ב<span className="text-gold-400 font-bold">טופ {100 - result.percentileEstimate}%</span> לגיל שלך
          </motion.p>
        </section>

        {/* Category scores grid */}
        <section>
          <h2 className="text-lg font-bold mb-4">ציונים לפי קטגוריה</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {result.categoryScores.map((cat, i) => (
              <CategoryCard key={cat.category} category={cat} delay={0.1 * i} />
            ))}
          </div>
        </section>

        {/* Net worth */}
        <section>
          <NetWorthChart netWorth={result.netWorth} />
        </section>

        {/* AI Insights */}
        <section>
          <h2 className="text-lg font-bold mb-4">
            🧠 תובנות מותאמות אישית
          </h2>
          <div className="space-y-3">
            {insights.length > 0
              ? insights.map((insight, i) => (
                  <InsightCard key={insight.id} insight={insight} delay={0.1 * i} />
                ))
              : <p className="text-slate-400 text-sm">מייצר תובנות...</p>
            }
          </div>
        </section>

        {/* Bonuses & Penalties */}
        {result.bonusesPenalties.some(b => b.applied) && (
          <section>
            <h2 className="text-lg font-bold mb-4">בונוסים וקנסות</h2>
            <div className="space-y-2">
              {result.bonusesPenalties.filter(b => b.applied).map((bp) => (
                <div key={bp.id} className={`flex items-center gap-3 p-3 rounded-xl ${bp.points > 0 ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                  <span className={`text-sm font-bold ${bp.points > 0 ? "text-green-400" : "text-red-400"}`}>
                    {bp.points > 0 ? `+${bp.points}` : bp.points}
                  </span>
                  <span className="text-sm">{bp.descriptionHe}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <footer className="pt-8 border-t border-dark-border/20">
          <p className="text-slate-500 text-xs text-center leading-relaxed">
            {result.disclaimer}
          </p>
        </footer>
      </div>
    </main>
  );
}
