// ============================================================
// Red Flags — Detects critical financial warning conditions
// Pure TypeScript, deterministic, no AI, no side effects
// ============================================================
import type { FinancialProfile, WealthIQResult } from "@/lib/types";

export interface RedFlag {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning";
  metric: string;
  value: string;
}

export function detectRedFlags(
  profile: FinancialProfile,
  result: WealthIQResult
): RedFlag[] {
  const ctx = result.insightsContext;
  const flags: RedFlag[] = [];

  // 1. Pension management fee > 1.2%
  const mgmtFee = profile.pension.managementFeePercent;
  if (mgmtFee !== null && mgmtFee > 1.2) {
    flags.push({
      id: "high_pension_fees",
      title: "דמי הניהול שלך אוכלים את הפנסיה",
      description:
        "דמי ניהול מעל 1.2% עלולים לצמצם את הפנסיה שלך בעשרות אחוזים לאורך הזמן.",
      severity: "critical",
      metric: "דמי ניהול",
      value: `${mgmtFee.toFixed(2)}%`,
    });
  }

  // 2. Emergency fund < 2 months
  if (ctx.emergencyFundMonths < 2) {
    flags.push({
      id: "low_emergency_fund",
      title: "כמעט אין לך רשת ביטחון פיננסית",
      description:
        "פחות מחודשיים של קרן חירום חושפים אותך לסיכון גבוה בכל מצב בלתי צפוי.",
      severity: "critical",
      metric: "חודשי כיסוי",
      value: `${ctx.emergencyFundMonths.toFixed(1)} חודשים`,
    });
  }

  // 3. Crypto > 20% of total assets
  if (ctx.cryptoPctOfPortfolio > 0.2) {
    flags.push({
      id: "crypto_concentration",
      title: "ריכוז קריפטו מסוכן בתיק",
      description:
        "יותר מ-20% מהתיק בקריפטו חושף אותך לתנודתיות קיצונית ולסיכון גבוה במיוחד.",
      severity: "critical",
      metric: "אחוז קריפטו",
      value: `${(ctx.cryptoPctOfPortfolio * 100).toFixed(0)}%`,
    });
  }

  // 4. No disability insurance + has dependents
  if (!ctx.hasDisabilityInsurance && ctx.hasDependents) {
    flags.push({
      id: "no_disability_insurance",
      title: "המשפחה שלך ללא הגנה על ההכנסה",
      description:
        "ללא ביטוח אובדן כושר עבודה, פגיעה ביכולת ההשתכרות תשאיר את המשפחה ללא מקור הכנסה.",
      severity: "critical",
      metric: "ביטוח אובדן כושר",
      value: "לא קיים",
    });
  }

  // 5. Debt-to-income ratio > 50%
  if (ctx.debtToIncomeRatio > 0.5) {
    flags.push({
      id: "high_dti",
      title: "יותר ממחצית ההכנסה שלך הולכת לחוב",
      description:
        "יחס חוב-הכנסה גבוה מסכן את היציבות הפיננסית ומגביל מאוד את יכולת החיסכון.",
      severity: "critical",
      metric: "יחס חוב-הכנסה",
      value: `${(ctx.debtToIncomeRatio * 100).toFixed(0)}%`,
    });
  }

  // 6. No will + has dependents
  if (!ctx.hasWill && ctx.hasDependents) {
    flags.push({
      id: "no_will",
      title: "המשפחה שלך ללא הגנה משפטית",
      description:
        "ללא צוואה, חלוקת הרכוש תיקבע על פי חוק — לא בהכרח לפי רצונך.",
      severity: "warning",
      metric: "צוואה",
      value: "לא קיימת",
    });
  }

  // 7. Savings rate < 5%
  if (ctx.savingsRate < 0.05) {
    flags.push({
      id: "low_savings_rate",
      title: "כמעט לא חוסך/ת",
      description:
        "שיעור חיסכון מתחת ל-5% יקשה מאוד על בניית ביטחון פיננסי לטווח הארוך.",
      severity: "warning",
      metric: "שיעור חיסכון",
      value: `${(ctx.savingsRate * 100).toFixed(1)}%`,
    });
  }

  // 8. Single asset class > 50% of net worth
  if (ctx.largestAssetPct > 0.5) {
    flags.push({
      id: "asset_concentration",
      title: "העושר שלך תלוי בדבר אחד",
      description:
        "ריכוז של יותר מ-50% בנכס אחד יוצר חשיפה גבוהה — גיוון הוא הבסיס לניהול סיכונים.",
      severity: "warning",
      metric: "ריכוז בנכס מוביל",
      value: `${(ctx.largestAssetPct * 100).toFixed(0)}%`,
    });
  }

  return flags;
}
