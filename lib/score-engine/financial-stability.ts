import type { FinancialProfile, CategoryScore } from "@/lib/types";
import { CATEGORY_WEIGHTS, EMERGENCY_FUND_MONTHS_RECOMMENDED, EMERGENCY_FUND_MONTHS_WITH_DEPENDENTS } from "./constants";
import { debtToIncomeRatio, emergencyFundMonths, savingsRate } from "@/lib/utils/calculations";
import { clamp, scoreToGrade } from "@/lib/utils/format";

function emergencyFundScore(months: number, hasDependents: boolean): number {
  const target = hasDependents ? EMERGENCY_FUND_MONTHS_WITH_DEPENDENTS : EMERGENCY_FUND_MONTHS_RECOMMENDED;
  const ratio = months / target;
  if (ratio >= 1.5) return 100;
  if (ratio >= 1.0) return 75 + ((ratio - 1.0) / 0.5) * 25;
  if (ratio >= 0.5) return 40 + ((ratio - 0.5) / 0.5) * 35;
  return Math.max(0, ratio * 80);
}

function debtScore(dti: number): number {
  if (dti <= 0.1) return 100;
  if (dti <= 0.2) return 80 + ((0.2 - dti) / 0.1) * 20;
  if (dti <= 0.35) return 50 + ((0.35 - dti) / 0.15) * 30;
  if (dti <= 0.5) return 20 + ((0.5 - dti) / 0.15) * 30;
  return Math.max(0, 20 - (dti - 0.5) * 60);
}

function savingsRateScore(rate: number): number {
  if (rate >= 0.3) return 100;
  if (rate >= 0.2) return 80 + ((rate - 0.2) / 0.1) * 20;
  if (rate >= 0.1) return 50 + ((rate - 0.1) / 0.1) * 30;
  if (rate >= 0.05) return 25 + ((rate - 0.05) / 0.05) * 25;
  return Math.max(0, rate * 500);
}

function cashFlowScore(income: number, expenses: number, debtPayments: number): number {
  if (income === 0) return 0;
  const ratio = (expenses + debtPayments) / income;
  if (ratio <= 0.6) return 100;
  if (ratio <= 0.75) return 70 + ((0.75 - ratio) / 0.15) * 30;
  if (ratio <= 0.9) return 40 + ((0.9 - ratio) / 0.15) * 30;
  if (ratio <= 1.0) return 10 + ((1.0 - ratio) / 0.1) * 30;
  return 0;
}

export function scoreFinancialStability(profile: FinancialProfile): CategoryScore {
  const { savings, debt, income, cashFlow, profile: p, realEstate } = profile;

  const liquidTotal = savings.liquidSavings + (savings.emergencyFundAmount ?? 0);
  const efMonths = emergencyFundMonths(liquidTotal, cashFlow.monthlyExpenses);
  const hasDeps = p.dependents > 0;
  const s1 = emergencyFundScore(efMonths, hasDeps);

  // Include vehicle car payment in monthly obligations
  const totalDebtPayments = (debt.totalMonthlyObligations ?? 0) + (realEstate.monthlyCarPayment ?? 0);
  const dti = debtToIncomeRatio(totalDebtPayments, income.monthlyGrossSalary);
  const s2 = debtScore(dti);

  const netSalary = income.monthlyNetSalary ?? income.monthlyGrossSalary * 0.65;
  const sr = savingsRate(cashFlow.monthlySavingsAmount, netSalary);
  const s3 = savingsRateScore(sr);

  const s4 = cashFlowScore(netSalary, cashFlow.monthlyExpenses, totalDebtPayments);

  const raw = s1 * 0.3 + s2 * 0.3 + s3 * 0.2 + s4 * 0.2;
  const score = clamp(Math.round(raw * 10) / 10, 0, 100);

  return {
    category: "financial_stability",
    categoryNameHe: "יציבות פיננסית",
    score,
    weight: CATEGORY_WEIGHTS.financial_stability,
    grade: scoreToGrade(score).grade,
    details: {
      emergencyFundMonths: +efMonths.toFixed(1),
      debtToIncomeRatio: +dti.toFixed(3),
      savingsRate: +sr.toFixed(3),
      efSubScore: Math.round(s1),
      debtSubScore: Math.round(s2),
      savingsSubScore: Math.round(s3),
      cashFlowSubScore: Math.round(s4),
    },
  };
}
