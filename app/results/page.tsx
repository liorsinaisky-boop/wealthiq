"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { FinancialProfile, WealthIQResult, Insight, DeepInsight } from "@/lib/types";
import { calculateWealthIQ } from "@/lib/score-engine/composite";
import { generateDeepInsights } from "@/lib/score-engine/deep-insights";
import { detectRedFlags } from "@/lib/score-engine/red-flags";
import type { RedFlag } from "@/lib/score-engine/red-flags";
import { generateInitialQuestions } from "@/lib/ai/suggested-questions";
import ScoreGauge from "@/components/results/ScoreGauge";
import CategoryCard from "@/components/results/CategoryCard";
import InsightCard from "@/components/results/InsightCard";
import NetWorthChart from "@/components/results/NetWorthChart";
import LoadingAnalysis from "@/components/results/LoadingAnalysis";
import RedFlagsSection from "@/components/results/RedFlagsSection";
import DeepInsightsSection from "@/components/results/DeepInsightsSection";
import SimulatorPanel from "@/components/simulator/SimulatorPanel";
import ChatButton from "@/components/chat/ChatButton";
import ChatPanel from "@/components/chat/ChatPanel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useChatStore } from "@/lib/store/chat-store";
import Link from "next/link";

type Phase = "loading" | "results";

const categoryGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export default function ResultsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [result, setResult] = useState<WealthIQResult | null>(null);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [deepInsights, setDeepInsights] = useState<DeepInsight[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [scrollPct, setScrollPct] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const { setContext, isOpen, toggleChat, openChat, addGreeting, hasAutoOpened } = useChatStore();

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "c" || e.key === "C") toggleChat();
      if (e.key === "?" || e.key === "/") setShowShortcuts((p) => !p);
      if (e.key === "Escape") {
        if (isOpen) toggleChat();
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, toggleChat]);

  // Load profile from sessionStorage, compute scores
  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem("wealthiq-profile") : null;
    if (!raw) { router.push("/check"); return; }

    const parsed: FinancialProfile = JSON.parse(raw);
    setProfile(parsed);

    const wealthIQResult = calculateWealthIQ(parsed);
    setResult(wealthIQResult);

    // Deep insights (deterministic, instant)
    setDeepInsights(generateDeepInsights(parsed, wealthIQResult));

    // Red flags (deterministic, instant)
    setRedFlags(detectRedFlags(parsed, wealthIQResult));

    // AI insights (async)
    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: wealthIQResult.insightsContext }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.insights) {
          setInsights(data.insights);
          setContext({ profile: parsed, result: wealthIQResult, insights: data.insights });
        } else {
          setContext({ profile: parsed, result: wealthIQResult, insights: [] });
        }
      })
      .catch(() => {
        setContext({ profile: parsed, result: wealthIQResult, insights: [] });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Auto-open chat 2s after results phase starts (once per session)
  useEffect(() => {
    if (phase !== "results" || hasAutoOpened || !result) return;

    const timer = setTimeout(() => {
      const flags = detectRedFlags(
        profile!,
        result
      );
      const flagIds = flags.map((f) => f.id);
      const questions = generateInitialQuestions(result, flagIds);

      const attentionCount = flags.length;
      const greeting =
        `היי! ניתחתי את התוצאות שלך. הציון הכולל שלך הוא ${result.totalScore}/100.` +
        (attentionCount > 0
          ? ` שמתי לב ל-${attentionCount} תחומים שדורשים תשומת לב. רוצה שאסביר מה מוריד את הציון שלך?`
          : " המצב הפיננסי שלך נראה טוב! רוצה שנצלול לפרטים?");

      addGreeting(greeting, questions);
      openChat();
    }, 2000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, hasAutoOpened, result]);

  if (phase === "loading") {
    return <LoadingAnalysis onComplete={() => setPhase("results")} />;
  }

  if (!result || !profile) return null;

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#06080C" }}>
      {/* Scroll progress bar */}
      <div
        className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left"
        style={{
          background: "linear-gradient(90deg, #C8A24E, #E0BA72)",
          width: `${scrollPct}%`,
          transition: "width 0.1s linear",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          backgroundColor: "rgba(6,8,12,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-sora font-semibold text-lg" style={{ color: "#C8A24E" }}>
            WealthIQ
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs sm:block" style={{ color: "#5A5650" }}>
              C = יועץ AI · ? = קיצורים
            </span>
            <Link href="/check" className="text-sm transition-colors" style={{ color: "#8A8680" }}>
              בדיקה חדשה
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-6 pt-10">

        {/* Score section */}
        <ScrollReveal direction="up" delay={0}>
          <section className="text-center">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-sm uppercase tracking-[3px]"
              style={{ color: "#8A8680" }}
            >
              הציון הפיננסי שלך
            </motion.p>
            <ScoreGauge score={result.totalScore} categoryScores={result.categoryScores} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-4 text-sm"
              style={{ color: "#8A8680" }}
            >
              את/ה ב<span className="font-semibold" style={{ color: "#C8A24E" }}>
                טופ {100 - result.percentileEstimate}%
              </span> לגיל שלך
            </motion.p>
          </section>
        </ScrollReveal>

        {/* Red Flags — shown BEFORE category cards */}
        {redFlags.length > 0 && (
          <ScrollReveal direction="up" delay={0}>
            <RedFlagsSection flags={redFlags} />
          </ScrollReveal>
        )}

        {/* Category grid */}
        <ScrollReveal direction="up" delay={100}>
          <section>
            <h2 className="mb-4 font-sora font-semibold text-lg" style={{ letterSpacing: "-0.5px" }}>
              ציונים לפי קטגוריה
            </h2>
            <motion.div
              className="grid grid-cols-2 gap-3 md:grid-cols-3"
              variants={categoryGridVariants}
              initial="hidden"
              animate="visible"
            >
              {result.categoryScores.map((cat) => {
                const catToDeep: Record<string, string> = {
                  retirement_readiness: "retirement",
                  financial_stability: "stability",
                  wealth_growth: "growth",
                  risk_management: "risk",
                  fee_efficiency: "fees",
                  goal_alignment: "goals",
                };
                const deepInsight = deepInsights.find(
                  (d) => d.category === catToDeep[cat.category]
                );
                return (
                  <CategoryCard key={cat.category} category={cat} deepInsight={deepInsight} />
                );
              })}
            </motion.div>
          </section>
        </ScrollReveal>

        {/* Net worth chart */}
        <ScrollReveal direction="up" delay={0}>
          <section>
            <NetWorthChart netWorth={result.netWorth} />
          </section>
        </ScrollReveal>

        {/* AI Insights */}
        <ScrollReveal direction="up" delay={0}>
          <section>
            <h2 className="mb-4 font-sora font-semibold text-lg" style={{ letterSpacing: "-0.5px" }}>
              תובנות מותאמות אישית
            </h2>
            <div className="space-y-3">
              {insights.length > 0
                ? insights.map((insight, i) => (
                    <InsightCard key={insight.id} insight={insight} delay={0.08 * i} />
                  ))
                : <p className="text-sm" style={{ color: "#5A5650" }}>מייצר תובנות...</p>
              }
            </div>
          </section>
        </ScrollReveal>

        {/* Deep Insights Engine */}
        {deepInsights.length > 0 && (
          <DeepInsightsSection insights={deepInsights} />
        )}

        {/* What-If Simulator */}
        <ScrollReveal direction="up" delay={0}>
          <section>
            <h2 className="mb-1 font-sora font-semibold text-lg" style={{ letterSpacing: "-0.5px" }}>
              סימולטור ״מה אם?״
            </h2>
            <p className="mb-5 text-sm" style={{ color: "#8A8680" }}>
              הזז את המחוונים וראה איך החלטות שונות משפיעות על העתיד הפיננסי שלך
            </p>
            <SimulatorPanel profile={profile} />
          </section>
        </ScrollReveal>

        {/* Bonuses & Penalties */}
        {result.bonusesPenalties.some(b => b.applied) && (
          <ScrollReveal direction="up" delay={0}>
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
          </ScrollReveal>
        )}

        {/* Disclaimer */}
        <footer className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-center text-xs leading-relaxed" style={{ color: "#5A5650" }}>
            {result.disclaimer}
          </p>
        </footer>
      </div>

      {/* Floating AI Chat */}
      <ChatPanel />
      <ChatButton />

      {/* Keyboard shortcuts overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(6,8,12,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                backgroundColor: "#0E1015",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-5 font-sora text-base font-semibold" style={{ color: "#E8E4DC" }}>
                קיצורי מקלדת
              </h3>
              <div className="space-y-3">
                {[
                  { key: "C", desc: "פתח/סגור יועץ AI" },
                  { key: "?", desc: "הצג/הסתר קיצורים" },
                  { key: "Esc", desc: "סגור פאנלים פתוחים" },
                ].map(({ key, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "#8A8680" }}>{desc}</span>
                    <kbd
                      className="rounded-md px-2 py-1 font-jetbrains-mono text-xs"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#C8A24E",
                      }}
                    >
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs" style={{ color: "#3D3A38" }}>
                לחץ בכל מקום לסגירה
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
