import type { FinancialProfile, CategoryScore } from "@/lib/types";
import { CATEGORY_WEIGHTS, MEDIAN_SALARY_BY_AGE } from "./constants";
import { clamp, scoreToGrade } from "@/lib/utils/format";

function calcNetWorth(profile: FinancialProfile) {
  const { pension, realEstate, investments, savings } = profile;
  const assets =
    pension.currentBalance +
    (pension.kerenHishtalmut.balance ?? 0) +
    (pension.oldAccountsEstimate ?? 0) +
    realEstate.properties.reduce((sum, p) => sum + p.estimatedValue, 0) +
    (investments.brokerageAccount?.totalValue ?? 0) +
    (investments.crypto?.totalValue ?? 0) +
    investments.otherInvestments.reduce((sum, i) => sum + i.totalValue, 0) +
    savings.liquidSavings +
    (savings.emergencyFundAmount ?? 0) +
    (savings.fixedDepositsAmount ?? 0) +
    (savings.savingsPlansAmount ?? 0) +
    (savings.childSavingsBalance ?? 0);

  const liabilities =
    realEstate.properties.reduce((sum, p) => sum + (p.mortgage?.remainingBalance ?? 0), 0) +
    profile.debt.loans.reduce((sum, l) => sum + l.remainingBalance, 0) +
    profile.debt.creditCardDebt;

  return { assets, liabilities, netWorth: assets - liabilities };
}

function netWorthBenchmark(age: number, salary: number): number {
  // Simple benchmark: net worth should be ~(age - 25) * annual salary * 0.1
  const yearsWorking = Math.max(0, age - 25);
  return yearsWorking * salary * 12 * 0.1;
}

function diversificationScore(profile: FinancialProfile, totalAssets: number): number {
  if (totalAssets === 0) return 50;
  const buckets = [
    profile.pension.currentBalance + (profile.pension.kerenHishtalmut.balance ?? 0),
    profile.realEstate.properties.reduce((s, p) => s + p.estimatedValue, 0),
    (profile.investments.brokerageAccount?.totalValue ?? 0) + profile.investments.otherInvestments.reduce((s, i) => s + i.totalValue, 0),
    profile.investments.crypto?.totalValue ?? 0,
    profile.savings.liquidSavings + (profile.savings.fixedDepositsAmount ?? 0),
  ].map(b => b / totalAssets);

  // Herfindahl index: sum of squared shares (lower = more diversified)
  const hhi = buckets.reduce((sum, pct) => sum + pct * pct, 0);
  // HHI ranges from 0.2 (perfectly diversified across 5) to 1.0 (all in one)
  if (hhi <= 0.25) return 100;
  if (hhi <= 0.35) return 70 + ((0.35 - hhi) / 0.1) * 30;
  if (hhi <= 0.5) return 40 + ((0.5 - hhi) / 0.15) * 30;
  return Math.max(0, 40 - (hhi - 0.5) * 80);
}

export function scoreWealthGrowth(profile: FinancialProfile): CategoryScore {
  const { assets, liabilities, netWorth } = calcNetWorth(profile);
  const benchmark = netWorthBenchmark(profile.profile.age, profile.income.monthlyGrossSalary);

  // Net worth vs benchmark
  let nwScore: number;
  if (benchmark === 0) { nwScore = 50; }
  else {
    const ratio = netWorth / benchmark;
    nwScore = ratio >= 2 ? 100 : ratio >= 1 ? 70 + (ratio - 1) * 30 : ratio >= 0.5 ? 40 + (ratio - 0.5) * 60 : Math.max(0, ratio * 80);
  }

  const divScore = diversificationScore(profile, assets);

  // Real estate equity as growth component
  const reEquity = profile.realEstate.properties.reduce((s, p) => s + p.estimatedValue - (p.mortgage?.remainingBalance ?? 0), 0);
  const reScore = reEquity > 0 ? Math.min(100, 50 + (reEquity / (profile.income.monthlyGrossSalary * 120)) * 50) : 30;

  const raw = nwScore * 0.35 + divScore * 0.3 + reScore * 0.2 + (netWorth > 0 ? 70 : 20) * 0.15;
  const score = clamp(Math.round(raw * 10) / 10, 0, 100);

  return {
    category: "wealth_growth",
    categoryNameHe: "צמיחת עושר",
    score,
    weight: CATEGORY_WEIGHTS.wealth_growth,
    grade: scoreToGrade(score).grade,
    details: {
      totalAssets: Math.round(assets),
      totalLiabilities: Math.round(liabilities),
      netWorth: Math.round(netWorth),
      benchmark: Math.round(benchmark),
      diversificationScore: Math.round(divScore),
      realEstateEquity: Math.round(reEquity),
    },
  };
}
