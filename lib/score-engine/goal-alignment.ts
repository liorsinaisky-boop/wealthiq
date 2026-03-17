import type { FinancialProfile, CategoryScore } from "@/lib/types";
import { CATEGORY_WEIGHTS, RETIREMENT_AGE_MALE, RETIREMENT_AGE_FEMALE } from "./constants";
import { futureValueAnnuity, futureValueLumpSum } from "@/lib/utils/calculations";
import { clamp, scoreToGrade } from "@/lib/utils/format";

function retirementProjection(profile: FinancialProfile): number {
  const { pension, income, profile: p, cashFlow } = profile;
  const retAge = p.targetRetirementAge || (p.gender === "female" ? RETIREMENT_AGE_FEMALE : RETIREMENT_AGE_MALE);
  const yearsLeft = Math.max(0, retAge - p.age);
  const monthlyContrib = income.monthlyGrossSalary * 0.185;
  const projectedPension = futureValueLumpSum(pension.currentBalance, 0.05, yearsLeft) +
    futureValueAnnuity(monthlyContrib, 0.05, yearsLeft);
  // Safe withdrawal: 4% rule → monthly income
  const monthlyRetirementIncome = (projectedPension * 0.04) / 12;
  const targetIncome = cashFlow.monthlyExpenses * 0.8; // 80% replacement
  if (targetIncome === 0) return 70;
  const ratio = monthlyRetirementIncome / targetIncome;
  if (ratio >= 1.2) return 100;
  if (ratio >= 1.0) return 80 + ((ratio - 1.0) / 0.2) * 20;
  if (ratio >= 0.7) return 50 + ((ratio - 0.7) / 0.3) * 30;
  if (ratio >= 0.4) return 20 + ((ratio - 0.4) / 0.3) * 30;
  return Math.max(0, ratio * 50);
}

function goalSpecificScore(profile: FinancialProfile): number {
  const goal = profile.profile.primaryGoal;
  switch (goal) {
    case "buy_home": {
      if (profile.realEstate.ownsProperty) return 90; // already owns
      const saved = profile.savings.liquidSavings + (profile.savings.fixedDepositsAmount ?? 0);
      const target = profile.realEstate.downPaymentAvailable ?? saved;
      return target >= 200_000 ? 70 : target >= 100_000 ? 50 : 30;
    }
    case "early_retirement": {
      const yearsEarly = (profile.profile.gender === "female" ? RETIREMENT_AGE_FEMALE : RETIREMENT_AGE_MALE) - profile.profile.targetRetirementAge;
      return yearsEarly > 10 ? 40 : yearsEarly > 5 ? 55 : 70; // harder the earlier
    }
    case "financial_independence": {
      const netSalary = profile.income.monthlyNetSalary ?? profile.income.monthlyGrossSalary * 0.65;
      const sr = profile.cashFlow.monthlySavingsAmount / (netSalary || 1);
      return sr >= 0.4 ? 90 : sr >= 0.25 ? 65 : sr >= 0.15 ? 45 : 25;
    }
    default:
      return 60;
  }
}

export function scoreGoalAlignment(profile: FinancialProfile): CategoryScore {
  const s1 = retirementProjection(profile);
  const s2 = goalSpecificScore(profile);
  const raw = s1 * 0.6 + s2 * 0.4;
  const score = clamp(Math.round(raw * 10) / 10, 0, 100);

  return {
    category: "goal_alignment",
    categoryNameHe: "התאמה ליעדים",
    score,
    weight: CATEGORY_WEIGHTS.goal_alignment,
    grade: scoreToGrade(score).grade,
    details: {
      retirementProjectionScore: Math.round(s1),
      goalSpecificScore: Math.round(s2),
      primaryGoal: profile.profile.primaryGoal,
    },
  };
}
