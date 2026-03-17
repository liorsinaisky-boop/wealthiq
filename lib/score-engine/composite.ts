// ============================================================
// Composite Score — Aggregates all category scores + bonus/penalty
// ============================================================
import type { FinancialProfile, WealthIQResult, CategoryScore, BonusPenalty, NetWorthSummary, InsightsContext } from "@/lib/types";
import { scoreRetirementReadiness } from "./retirement-readiness";
import { scoreFinancialStability } from "./financial-stability";
import { scoreWealthGrowth } from "./wealth-growth";
import { scoreRiskManagement } from "./risk-management";
import { scoreFeeEfficiency } from "./fee-efficiency";
import { scoreGoalAlignment } from "./goal-alignment";
import { DISCLAIMER_HE, RETIREMENT_AGE_MALE, RETIREMENT_AGE_FEMALE } from "./constants";
import { clamp, scoreToGrade } from "@/lib/utils/format";
import { emergencyFundMonths, debtToIncomeRatio } from "@/lib/utils/calculations";

function calcBonusesPenalties(profile: FinancialProfile, categories: CategoryScore[]): BonusPenalty[] {
  const { savings, debt, insurance, investments, profile: p, income, cashFlow } = profile;
  const results: BonusPenalty[] = [];
  const hasDeps = p.dependents > 0;

  const liquid = savings.liquidSavings + (savings.emergencyFundAmount ?? 0);
  const efMonths = emergencyFundMonths(liquid, cashFlow.monthlyExpenses);
  results.push({
    id: "ef_bonus", descriptionHe: "קרן חירום מעל 6 חודשים",
    points: 5, applied: efMonths > 6, reason: `${efMonths.toFixed(1)} months coverage`,
  });

  const dti = debtToIncomeRatio(debt.totalMonthlyObligations, income.monthlyGrossSalary);
  results.push({
    id: "low_dti", descriptionHe: "יחס חוב-הכנסה נמוך",
    points: 3, applied: dti < 0.2, reason: `DTI: ${(dti * 100).toFixed(1)}%`,
  });

  results.push({
    id: "no_disability", descriptionHe: "ללא ביטוח אובדן כושר עבודה + תלויים",
    points: -5, applied: insurance.hasDisabilityInsurance === "no" && hasDeps,
    reason: "No disability insurance with dependents",
  });

  // Asset concentration
  const totalAssets = (categories.find(c => c.category === "wealth_growth")?.details?.totalAssets as number) ?? 0;
  const reValue = profile.realEstate.properties.reduce((s, pr) => s + pr.estimatedValue, 0);
  const singleAssetPct = totalAssets > 0 ? Math.max(reValue, profile.pension.currentBalance, investments.brokerageAccount?.totalValue ?? 0) / totalAssets : 0;
  results.push({
    id: "concentration", descriptionHe: "ריכוז גבוה בנכס אחד (מעל 50%)",
    points: -5, applied: singleAssetPct > 0.5, reason: `Largest asset: ${(singleAssetPct * 100).toFixed(0)}%`,
  });

  results.push({
    id: "no_will", descriptionHe: "ללא צוואה + תלויים",
    points: -3, applied: !insurance.hasWill && hasDeps, reason: "No will with dependents",
  });

  const cryptoVal = investments.crypto?.totalValue ?? 0;
  const cryptoPct = totalAssets > 0 ? cryptoVal / totalAssets : 0;
  results.push({
    id: "crypto_heavy", descriptionHe: "קריפטו מעל 20% מהתיק",
    points: -10, applied: cryptoPct > 0.2, reason: `Crypto: ${(cryptoPct * 100).toFixed(0)}%`,
  });

  return results;
}

function buildNetWorthSummary(profile: FinancialProfile): NetWorthSummary {
  const { pension, realEstate, investments, savings, debt } = profile;
  const assetBreakdown = {
    pension: pension.currentBalance,
    kerenHishtalmut: pension.kerenHishtalmut.balance ?? 0,
    realEstate: realEstate.properties.reduce((s, p) => s + p.estimatedValue, 0),
    investments: (investments.brokerageAccount?.totalValue ?? 0) + investments.otherInvestments.reduce((s, i) => s + i.totalValue, 0),
    crypto: investments.crypto?.totalValue ?? 0,
    savings: savings.liquidSavings + (savings.emergencyFundAmount ?? 0) + (savings.fixedDepositsAmount ?? 0) + (savings.savingsPlansAmount ?? 0),
    otherAssets: savings.childSavingsBalance ?? 0,
  };
  const liabilityBreakdown = {
    mortgages: realEstate.properties.reduce((s, p) => s + (p.mortgage?.remainingBalance ?? 0), 0),
    loans: debt.loans.reduce((s, l) => s + l.remainingBalance, 0),
    creditCardDebt: debt.creditCardDebt,
  };
  const totalAssets = Object.values(assetBreakdown).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilityBreakdown).reduce((a, b) => a + b, 0);

  return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities, assetBreakdown, liabilityBreakdown };
}

function buildInsightsContext(profile: FinancialProfile, categories: CategoryScore[], nw: NetWorthSummary, totalScore: number, percentile: number): InsightsContext {
  const { pension, investments, savings, debt, insurance, cashFlow, income, profile: p } = profile;
  const liquid = savings.liquidSavings + (savings.emergencyFundAmount ?? 0);
  const efM = emergencyFundMonths(liquid, cashFlow.monthlyExpenses);
  const dti = debtToIncomeRatio(debt.totalMonthlyObligations, income.monthlyGrossSalary);
  const netSalary = income.monthlyNetSalary ?? income.monthlyGrossSalary * 0.65;
  const sr = netSalary > 0 ? cashFlow.monthlySavingsAmount / netSalary : 0;
  const retAge = p.gender === "female" ? RETIREMENT_AGE_FEMALE : RETIREMENT_AGE_MALE;

  // Find largest asset class
  const buckets = Object.entries(nw.assetBreakdown).sort((a, b) => b[1] - a[1]);
  const largest = buckets[0] || ["none", 0];
  const largestPct = nw.totalAssets > 0 ? (largest[1] as number) / nw.totalAssets : 0;

  const cryptoPct = nw.totalAssets > 0 ? (investments.crypto?.totalValue ?? 0) / nw.totalAssets : 0;
  const rePct = nw.totalAssets > 0 ? nw.assetBreakdown.realEstate / nw.totalAssets : 0;

  const retScore = categories.find(c => c.category === "retirement_readiness");
  const stabScore = categories.find(c => c.category === "financial_stability");

  // Currency diversification (rough)
  const intlPct = (investments.brokerageAccount?.allocation?.internationalStocks ?? 0);
  const intlValue = (investments.brokerageAccount?.totalValue ?? 0) * intlPct;
  const currencyDiv = nw.totalAssets > 0 ? (intlValue + (investments.crypto?.totalValue ?? 0)) / nw.totalAssets : 0;

  return {
    age: p.age, salary: income.monthlyGrossSalary, totalNetWorth: nw.netWorth,
    pensionBalance: pension.currentBalance,
    pensionExpectedRatio: +(retScore?.details?.savingsRatio as number ?? 0),
    pensionFeeRatio: +(retScore?.details?.feeSubScore as number ?? 0) / 100,
    emergencyFundMonths: +efM.toFixed(1),
    debtToIncomeRatio: +dti.toFixed(3),
    largestAssetClass: largest[0] as string,
    largestAssetPct: +largestPct.toFixed(2),
    hasDisabilityInsurance: insurance.hasDisabilityInsurance !== "no",
    hasDependents: p.dependents > 0,
    hasWill: insurance.hasWill,
    cryptoPctOfPortfolio: +cryptoPct.toFixed(3),
    monthlyNetCashFlow: netSalary - cashFlow.monthlyExpenses - debt.totalMonthlyObligations,
    savingsRate: +sr.toFixed(3),
    retirementReadinessScore: retScore?.score ?? 0,
    financialStabilityScore: stabScore?.score ?? 0,
    yearsToRetirement: Math.max(0, retAge - p.age),
    totalScore, grade: scoreToGrade(totalScore).grade,
    percentile,
    riskTolerance: p.riskTolerance,
    primaryGoal: p.primaryGoal,
    mortgageRate: profile.realEstate.properties[0]?.mortgage?.interestRate,
    savingsAccountRate: savings.fixedDepositsRate ?? undefined,
    investmentFees: investments.brokerageAccount?.annualFeePercent,
    realEstateConcentration: +rePct.toFixed(2),
    currencyDiversification: +currencyDiv.toFixed(2),
  };
}

function estimatePercentile(score: number, age: number): number {
  const mean = age < 30 ? 48 : age > 50 ? 56 : 52;
  const std = 18;
  const z = (score - mean) / std;
  const pct = 50 * (1 + Math.min(1, Math.max(-1, z * 0.7071))); // approx erf
  return Math.min(99, Math.max(1, Math.round(pct)));
}

export function calculateWealthIQ(profile: FinancialProfile): WealthIQResult {
  const categories = [
    scoreRetirementReadiness(profile),
    scoreFinancialStability(profile),
    scoreWealthGrowth(profile),
    scoreRiskManagement(profile),
    scoreFeeEfficiency(profile),
    scoreGoalAlignment(profile),
  ];

  const weightedSum = categories.reduce((sum, c) => sum + c.score * c.weight, 0);
  const bonusesPenalties = calcBonusesPenalties(profile, categories);
  const bonusPoints = bonusesPenalties.filter(b => b.applied).reduce((sum, b) => sum + b.points, 0);
  const totalScore = clamp(Math.round((weightedSum + bonusPoints) * 10) / 10, 0, 100);
  const { grade, gradeHe } = scoreToGrade(totalScore);
  const percentile = estimatePercentile(totalScore, profile.profile.age);
  const netWorth = buildNetWorthSummary(profile);
  const insightsContext = buildInsightsContext(profile, categories, netWorth, totalScore, percentile);

  return {
    totalScore, grade, gradeHe, percentileEstimate: percentile,
    categoryScores: categories, bonusesPenalties, netWorth, insightsContext,
    disclaimer: DISCLAIMER_HE,
  };
}
