import type { FinancialProfile, CategoryScore } from "@/lib/types";
import { AVG_FEES, TOTAL_PENSION_RATE, EMPLOYER_SEVERANCE_RATE, CAREER_START_AGE, LONG_TERM_NOMINAL_RETURN, TRACK_EQUITY_PCT, RETIREMENT_AGE_MALE, RETIREMENT_AGE_FEMALE, CATEGORY_WEIGHTS } from "./constants";
import { futureValueAnnuity } from "@/lib/utils/calculations";
import { clamp, scoreToGrade } from "@/lib/utils/format";

function expectedBalance(age: number, salary: number): number {
  const years = Math.max(0, age - CAREER_START_AGE);
  if (years === 0) return 0;
  return futureValueAnnuity(salary * (TOTAL_PENSION_RATE + EMPLOYER_SEVERANCE_RATE), LONG_TERM_NOMINAL_RETURN, years);
}

function savingsAdequacy(actual: number, expected: number): number {
  if (expected === 0) return 50;
  const r = actual / expected;
  if (r >= 1.3) return 100;
  if (r >= 1.0) return 80 + ((r - 1.0) / 0.3) * 20;
  if (r >= 0.7) return 55 + ((r - 0.7) / 0.3) * 25;
  if (r >= 0.4) return 25 + ((r - 0.4) / 0.3) * 30;
  return Math.max(0, r * 62.5);
}

function feeEfficiency(mgmt: number | null, dep: number | null, type: string): number {
  const avg = AVG_FEES[type as keyof typeof AVG_FEES] || AVG_FEES.not_sure;
  const total = (mgmt ?? avg.management) + (dep ?? avg.deposit);
  const avgTotal = avg.management + avg.deposit;
  if (avgTotal === 0) return 70;
  const ratio = total / avgTotal;
  if (ratio <= 0.6) return 100;
  if (ratio <= 1.0) return 65 + ((1.0 - ratio) / 0.4) * 35;
  if (ratio <= 1.5) return 15 + ((1.5 - ratio) / 0.5) * 50;
  return Math.max(0, 15 - (ratio - 1.5) * 20);
}

function allocationFit(age: number, risk: string, track: string): number {
  const targets: Record<string, number> = {
    conservative: Math.max(15, 90 - age),
    balanced: Math.max(25, 110 - age),
    aggressive: Math.max(40, 125 - age),
  };
  const target = targets[risk] ?? targets.balanced;
  const actual = TRACK_EQUITY_PCT[track] ?? 50;
  const dev = Math.abs(actual - target);
  if (dev <= 5) return 100;
  if (dev <= 15) return 60 + ((15 - dev) / 10) * 40;
  if (dev <= 30) return 20 + ((30 - dev) / 15) * 40;
  return Math.max(0, 20 - (dev - 30) * 1.5);
}

export function scoreRetirementReadiness(profile: FinancialProfile): CategoryScore {
  const { pension, profile: p, income } = profile;
  const expected = expectedBalance(p.age, income.monthlyGrossSalary);
  const s1 = savingsAdequacy(pension.currentBalance, expected);
  const s2 = feeEfficiency(pension.managementFeePercent, pension.depositFeePercent, pension.productType);
  const s3 = allocationFit(p.age, p.riskTolerance, pension.investmentTrack);
  const s4 = pension.kerenHishtalmut.hasOne ? 75 : 25;
  const raw = s1 * 0.4 + s2 * 0.2 + s3 * 0.2 + s4 * 0.2;
  const score = clamp(Math.round(raw * 10) / 10, 0, 100);

  return {
    category: "retirement_readiness",
    categoryNameHe: "מוכנות לפרישה",
    score,
    weight: CATEGORY_WEIGHTS.retirement_readiness,
    grade: scoreToGrade(score).grade,
    details: {
      expectedBalance: Math.round(expected),
      actualBalance: pension.currentBalance,
      savingsRatio: expected > 0 ? +(pension.currentBalance / expected).toFixed(2) : null,
      savingsSubScore: Math.round(s1),
      feeSubScore: Math.round(s2),
      allocationSubScore: Math.round(s3),
      yearsToRetirement: Math.max(0, (p.gender === "female" ? RETIREMENT_AGE_FEMALE : RETIREMENT_AGE_MALE) - p.age),
    },
  };
}
