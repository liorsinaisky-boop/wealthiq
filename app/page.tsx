"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// ── Demo ring constants ───────────────────────────────────────
const DEMO_SCORE = 78;
const RING = 260;
const R = (RING - 20) / 2;
const CIRC = 2 * Math.PI * R;
const OFFSET = CIRC - (DEMO_SCORE / 100) * CIRC;

// ── Category data ─────────────────────────────────────────────
const CATEGORIES = [
  { name: "מוכנות לפרישה",  weight: 25, color: "#60A5FA", score: 68 },
  { name: "יציבות פיננסית",  weight: 20, color: "#34D399", score: 81 },
  { name: "צמיחת עושר",      weight: 20, color: "#C8A24E", score: 74 },
  { name: "ניהול סיכונים",   weight: 15, color: "#FB923C", score: 55 },
  { name: "יעילות עמלות",    weight: 10, color: "#F472B6", score: 62 },
  { name: "התאמה ליעדים",    weight: 10, color: "#A78BFA", score: 77 },
];

const PILLS = ["פנסיה", "נדל״ן", "השקעות", "חסכונות", "הלוואות", "ביטוח"];

// Positions (top%, right%) relative to ring container (360×360px)
const PILL_POS = [
  { top: "-14px", right: "50%", transform: "translateX(50%)" },
  { top: "22%",   right: "-64px" },
  { top: "65%",   right: "-64px" },
  { bottom: "-14px", right: "50%", transform: "translateX(50%)" },
  { top: "65%",   left: "-64px" },
  { top: "22%",   left: "-64px" },
];

const HOW_IT_WORKS = [
  { num: "01", title: "ענה/י על שאלות",   desc: "9 קטגוריות שמכסות את כל התמונה הפיננסית — פנסיה, נדל״ן, השקעות, חסכונות, חובות וביטוח" },
  { num: "02", title: "קבל/י ציון מותאם", desc: "מנוע ניקוד דטרמיניסטי מחשב ציון מ-0 עד 100 עם פירוט לפי 6 ממדים ובנצ׳מארקים ישראלים" },
  { num: "03", title: "גלה/י מה לשפר",    desc: "תובנות AI בעברית וסימולטור אינטרקטיבי שמראה איך כל החלטה משפיעה על העתיד הפיננסי שלך" },
];

const FEATURES = [
  { num: "01", title: "ניתוח פנסיה מלא",    desc: "קרן פנסיה, ביטוח מנהלים, קרן השתלמות, מסלול השקעה ודמי ניהול — הכל מנוטר" },
  { num: "02", title: "ציון WealthIQ",       desc: "6 ממדים, 45 שאלות, ניקוד 0–100 עם פרמיות על התנהגות נבונה ועונשין על סיכון גבוה" },
  { num: "03", title: "סימולטור מה-אם",     desc: "הזז מחוון אחד וראה מיד כיצד הוא משפיע על שווי הנטו שלך בגיל הפרישה" },
  { num: "04", title: "תובנות AI בעברית",   desc: "Gemini 2.5 מייצר תובנות מותאמות אישית בהתבסס על הנתונים שלך — לא תבניות גנריות" },
  { num: "05", title: "פרטיות מלאה",        desc: "הנתונים שלך לא נשמרים בשום שרת. הכל מחושב בזמן אמת ונמחק כשסוגרים את הדפדפן" },
  { num: "06", title: "חינם לחלוטין",       desc: "ללא הרשמה, ללא כרטיס אשראי, ללא מנוי. WealthIQ הוא ויישאר כלי ציבורי חינמי" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ backgroundColor: "#06080C", color: "#E8E4DC", minHeight: "100vh" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(6,8,12,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="font-sora text-lg font-semibold" style={{ color: "#C8A24E" }}>
            WealthIQ
          </span>
          <div className="hidden items-center gap-8 text-sm md:flex" style={{ color: "#8A8680" }}>
            <a href="#how"      className="transition-colors hover:text-[#E8E4DC]">איך זה עובד</a>
            <a href="#score"    className="transition-colors hover:text-[#E8E4DC]">מנוע הניקוד</a>
            <a href="#features" className="transition-colors hover:text-[#E8E4DC]">יכולות</a>
          </div>
          <Link href="/check" className="btn-gold px-5 py-2 text-sm">
            התחל בדיקה ←
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="px-6 pb-24 pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="section-label mb-6 inline-block">Financial Health Platform</span>
            <h1
              className="mb-6 font-sora font-bold leading-[1.1]"
              style={{ fontSize: "clamp(34px, 4.5vw, 54px)", letterSpacing: "-2px" }}
            >
              דע/י את המספר שלך.{" "}
              <span className="gold-text">קח/י אחריות על העתיד.</span>
            </h1>
            <p className="mb-10 leading-relaxed" style={{ fontSize: "17px", color: "#8A8680" }}>
              פנסיה, נדל״ן, השקעות, חסכונות וחובות — הכל במקום אחד.
              ענה/י על כמה שאלות וקבל/י ציון מ-0 עד 100 עם תובנות מותאמות אישית.
            </p>
            <Link
              href="/check"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-base"
              style={{ boxShadow: "0 0 36px rgba(200,162,78,0.28)" }}
            >
              התחל בדיקה חינמית ←
            </Link>

            {/* Stats */}
            <div className="mt-12 flex gap-10">
              {(
                [["45", "שאלות"], ["6", "ממדים"], ["0", "נתונים נשמרים"]] as [string, string][]
              ).map(([num, label]) => (
                <div key={label}>
                  <div
                    className="font-jetbrains-mono text-2xl font-bold"
                    style={{ color: "#C8A24E" }}
                  >
                    {num}
                  </div>
                  <div className="mt-0.5 text-sm" style={{ color: "#8A8680" }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Score ring column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {/* Outer decorative wrapper */}
            <div className="relative" style={{ width: "340px", height: "340px" }}>
              {/* Orbital rings */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-28px",
                  border: "1px solid rgba(200,162,78,0.07)",
                  borderRadius: "50%",
                }}
              />

              {/* SVG score ring — centered inside 340px box */}
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <svg width={RING} height={RING} style={{ transform: "rotate(-90deg)" }}>
                  <circle
                    cx={RING / 2} cy={RING / 2} r={R}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx={RING / 2} cy={RING / 2} r={R}
                    fill="none"
                    stroke="#C8A24E"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    initial={{ strokeDashoffset: CIRC }}
                    animate={{ strokeDashoffset: OFFSET }}
                    transition={{ duration: 2.2, ease: "easeOut", delay: 0.6 }}
                    style={{
                      filter: "drop-shadow(0 0 12px #C8A24E) drop-shadow(0 0 28px rgba(200,162,78,0.35))",
                    }}
                  />
                </svg>
                {/* Center text */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <motion.span
                    className="font-sora font-bold tabular-nums"
                    style={{ fontSize: "72px", lineHeight: 1, color: "#C8A24E", letterSpacing: "-3px" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {DEMO_SCORE}
                  </motion.span>
                  <span
                    className="mt-1 uppercase tracking-[3px]"
                    style={{ fontSize: "11px", color: "#5A5650" }}
                  >
                    הציון שלך
                  </span>
                </div>
              </div>

              {/* Floating category pills */}
              {PILLS.map((pill, i) => (
                <motion.div
                  key={pill}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                  className="absolute hidden text-xs md:flex items-center px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(200,162,78,0.15)",
                    color: "#8A8680",
                    whiteSpace: "nowrap",
                    ...PILL_POS[i],
                  }}
                >
                  {pill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="section-label mb-4 inline-block">תהליך</span>
            <h2
              className="font-sora font-bold text-4xl"
              style={{ letterSpacing: "-1.5px" }}
            >
              איך זה עובד?
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.num}
                className="card relative p-8 transition-colors duration-300 hover:border-[rgba(200,162,78,0.18)]"
              >
                {/* Ghost number */}
                <span
                  className="pointer-events-none absolute font-sora font-bold"
                  style={{
                    fontSize: "88px",
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.025)",
                    top: "16px",
                    left: "20px",
                  }}
                >
                  {step.num}
                </span>
                <span className="section-label mb-5 inline-block">{step.num}</span>
                <h3
                  className="mb-3 font-sora font-semibold text-xl"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {step.title}
                </h3>
                <p className="leading-relaxed" style={{ fontSize: "15px", color: "#8A8680" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORING ENGINE ──────────────────────────────────── */}
      <section
        id="score"
        className="px-6 py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-2">

          {/* Left: explanation + category list */}
          <div>
            <span className="section-label mb-4 inline-block">מנוע הניקוד</span>
            <h2
              className="mb-4 font-sora font-bold text-3xl"
              style={{ letterSpacing: "-1.5px" }}
            >
              ציון מבוסס מדע, לא תחושה
            </h2>
            <p className="mb-10 leading-relaxed" style={{ fontSize: "15px", color: "#8A8680" }}>
              מנוע הניקוד של WealthIQ הוא TypeScript טהור — דטרמיניסטי, ניתן לבדיקה ועם 94 בדיקות יחידה.
              כל ממד מקבל משקל מתוכנן ומחושב לפי בנצ׳מארקים ישראלים עדכניים.
            </p>
            <div className="space-y-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <div
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1 text-sm">{cat.name}</span>
                  <span
                    className="font-jetbrains-mono text-sm"
                    style={{ color: "#8A8680" }}
                  >
                    {cat.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: demo score card */}
          <div
            className="card p-8"
            style={{ borderColor: "rgba(200,162,78,0.12)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm" style={{ color: "#8A8680" }}>ציון לדוגמה</p>
                <span
                  className="font-sora font-bold"
                  style={{ fontSize: "52px", color: "#C8A24E", letterSpacing: "-2px", lineHeight: 1 }}
                >
                  72
                </span>
              </div>
              {/* Mini gauge */}
              <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                <circle
                  cx={40} cy={40} r={32}
                  fill="none"
                  stroke="#C8A24E"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - 0.72)}
                  style={{ filter: "drop-shadow(0 0 6px rgba(200,162,78,0.5))" }}
                />
              </svg>
            </div>
            <div className="space-y-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#8A8680" }}>{cat.name}</span>
                    <span
                      className="font-jetbrains-mono text-xs"
                      style={{ color: cat.color }}
                    >
                      {cat.score}
                    </span>
                  </div>
                  <div
                    className="h-[3px] overflow-hidden rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section
        id="features"
        className="px-6 py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="section-label mb-4 inline-block">יכולות</span>
            <h2
              className="font-sora font-bold text-4xl"
              style={{ letterSpacing: "-1.5px" }}
            >
              כל מה שצריך לדעת
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((feat) => (
              <div
                key={feat.num}
                className="card p-7 transition-all duration-300 hover:border-[rgba(200,162,78,0.2)] hover:bg-[rgba(255,255,255,0.04)]"
              >
                <span className="section-label mb-4 inline-block">{feat.num}</span>
                <h3
                  className="mb-2 font-sora font-semibold text-[17px]"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {feat.title}
                </h3>
                <p className="leading-relaxed" style={{ fontSize: "14px", color: "#8A8680" }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "520px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,162,78,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative">
          <span className="section-label mb-4 inline-block">מוכן/ה?</span>
          <h2
            className="mb-5 font-sora font-bold text-4xl"
            style={{ letterSpacing: "-2px" }}
          >
            גלה/י את הציון הפיננסי שלך
          </h2>
          <p className="mb-10 text-[15px]" style={{ color: "#8A8680" }}>
            חינם לחלוטין &bull; כ-10 דקות &bull; ללא הרשמה
          </p>
          <Link
            href="/check"
            className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-base"
            style={{ boxShadow: "0 0 48px rgba(200,162,78,0.32)" }}
          >
            התחל עכשיו ←
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-sora font-semibold" style={{ color: "#C8A24E" }}>WealthIQ</span>
          <p className="text-center text-xs" style={{ color: "#5A5650" }}>
            מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, או המלצה לפעולה כלשהי.
            לייעוץ מותאם אישית, פנה/י ליועץ פנסיוני מורשה.
          </p>
          <p className="text-xs" style={{ color: "#5A5650" }}>נבנה על ידי Lior</p>
        </div>
      </footer>
    </div>
  );
}
