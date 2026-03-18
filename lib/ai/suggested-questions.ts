// ============================================================
// Suggested Questions — Generates contextual chat questions
// Pure TypeScript, no AI, based on weakest categories + red flags
// ============================================================
import type { WealthIQResult } from "@/lib/types";

const CATEGORY_QUESTIONS: Record<string, string> = {
  retirement_readiness: "האם אני בדרך הנכונה לפרישה?",
  financial_stability: "איך אני יכול/ה לשפר את היציבות הפיננסית שלי?",
  wealth_growth: "מה הדרך הטובה ביותר לצמיח את ההון שלי?",
  risk_management: "איך אני יכול/ה להגן טוב יותר על הנכסים שלי?",
  fee_efficiency: "כמה עולים לי דמי הניהול ואיך להפחיתם?",
  goal_alignment: "האם אני מתקדם/ת לעבר המטרות הפיננסיות שלי?",
};

const RED_FLAG_QUESTIONS: Record<string, string> = {
  high_pension_fees: "למה דמי הניהול של הפנסיה כל כך חשובים?",
  low_emergency_fund: "כמה חסכון חירום אני באמת צריך/ה?",
  crypto_concentration: "מה הסיכון בהחזקת קריפטו כחלק גדול מהתיק?",
  no_disability_insurance: "למה ביטוח אובדן כושר עבודה כל כך חשוב?",
  high_dti: "איך אני יכול/ה להפחית את יחס החוב-הכנסה שלי?",
  no_will: "למה צריך צוואה ואיך עושים אחת?",
  low_savings_rate: "איך אני יכול/ה להגדיל את שיעור החיסכון שלי?",
  asset_concentration: "איך לגוון את תיק ההשקעות שלי?",
};

export function generateInitialQuestions(
  result: WealthIQResult,
  redFlagIds: string[]
): string[] {
  const questions: string[] = [];

  // First: up to 2 contextual questions from active red flags
  for (const id of redFlagIds.slice(0, 2)) {
    const q = RED_FLAG_QUESTIONS[id];
    if (q) questions.push(q);
  }

  // Fill remaining slots from weakest scoring categories
  const sorted = [...result.categoryScores].sort((a, b) => a.score - b.score);
  for (const cat of sorted) {
    if (questions.length >= 3) break;
    const q = CATEGORY_QUESTIONS[cat.category];
    if (q && !questions.includes(q)) questions.push(q);
  }

  return questions.slice(0, 3);
}
