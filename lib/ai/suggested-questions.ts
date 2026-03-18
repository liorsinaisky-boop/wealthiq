// ============================================================
// Suggested Questions — Contextual chat question generation
// Pure TypeScript, no AI, deterministic
// ============================================================
import type { FinancialProfile, WealthIQResult } from "@/lib/types";

// ── Opening goal buttons (shown with the greeting message) ────
export function getOpeningGoalButtons(
  profile: FinancialProfile,
  result: WealthIQResult
): string[] {
  const buttons: string[] = [];
  const age = profile.profile.age;
  const hasKids = profile.profile.dependents > 0;
  const ownsProperty = profile.realEstate.ownsProperty;
  const hasMortgage = (profile.realEstate.properties ?? []).some((p) => p.hasMortgage);
  const hasDebt = profile.debt.totalMonthlyObligations > 0;
  const stabilityScore = result.categoryScores.find(
    (c) => c.category === "financial_stability"
  );

  // Age-based primary goal
  if (age < 45) {
    buttons.push("אני רוצה לפרוש מוקדם");
  } else {
    buttons.push("האם אני מוכן/ה לפרישה?");
  }

  // Contextual situational goals
  if (!ownsProperty) buttons.push("אני רוצה לקנות דירה");
  if (hasMortgage) buttons.push("אני רוצה לסיים את המשכנתה מהר יותר");
  if (hasKids) buttons.push("אני רוצה להבטיח את עתיד הילדים");
  if (stabilityScore && stabilityScore.score < 60) {
    buttons.push("אני צריך/ה רשת ביטחון גדולה יותר");
  }
  if (hasDebt) buttons.push("אני רוצה לצאת מחובות");

  // Always offer a passive option
  buttons.push("פשוט הסבר לי את התוצאות");

  return buttons.slice(0, 4);
}

// ── Follow-up questions after each bot response ───────────────
const CATEGORY_FOLLOWUPS: Record<string, string> = {
  retirement_readiness: "איך הפנסיה שלי נראית?",
  financial_stability: "קרן החירום שלי מספיקה?",
  wealth_growth: "איך אוכל לצמיח את ההון שלי מהר יותר?",
  risk_management: "מאילו סיכונים כדאי לי לחשוש?",
  fee_efficiency: "האם דמי הניהול שלי גבוהים מדי?",
  goal_alignment: "האם אני בדרך הנכונה למטרות שלי?",
};

const EARLY_STAGE_QUESTIONS = [
  "באיזה גיל אני רוצה לפרוש?",
  "כמה אני צריך/ה בחודש בפרישה?",
  "מה הדאגה הכספית הגדולה שלי?",
];

export function getFollowUpQuestions(
  result: WealthIQResult,
  messageCount: number
): string[] {
  // Early conversation: generic exploratory questions
  if (messageCount <= 3) {
    return EARLY_STAGE_QUESTIONS;
  }

  // Later: probe the three weakest categories
  return [...result.categoryScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((cat) => CATEGORY_FOLLOWUPS[cat.category])
    .filter(Boolean) as string[];
}

// ── Legacy: kept for backward compat (no longer used in page.tsx) ──
export function generateInitialQuestions(
  result: WealthIQResult,
  _redFlagIds: string[]
): string[] {
  return [...result.categoryScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((cat) => CATEGORY_FOLLOWUPS[cat.category])
    .filter(Boolean) as string[];
}
