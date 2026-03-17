import type { FinancialProfile, CategoryScore } from "@/lib/types";
import { CATEGORY_WEIGHTS, LIFE_INSURANCE_MULTIPLIER, DISABILITY_COVERAGE_PCT } from "./constants";
import { clamp, scoreToGrade } from "@/lib/utils/format";

function insuranceCoverageScore(profile: FinancialProfile): number {
  const { insurance, income, profile: p } = profile;
  let score = 0;
  const hasDeps = p.dependents > 0;
  const annualSalary = income.monthlyGrossSalary * 12;

  // Life insurance
  if (insurance.hasLifeInsurance === "yes" || insurance.hasLifeInsurance === "through_pension") {
    const coverage = insurance.lifeCoverageAmount ?? annualSalary * 3;
    const target = annualSalary * LIFE_INSURANCE_MULTIPLIER;
    score += Math.min(30, (coverage / target) * 30);
  } else if (!hasDeps) {
    score += 20; // less critical without dependents
  }

  // Disability insurance
  if (insurance.hasDisabilityInsurance === "yes" || insurance.hasDisabilityInsurance === "through_pension") {
    score += 30;
  } else if (!hasDeps) {
    score += 10;
  }

  // Health + property insurance
  if (insurance.hasPrivateHealthInsurance) score += 15;
  else score += 5;
  if (insurance.hasPropertyInsurance) score += 10;
  else score += 3;

  // Will
  if (insurance.hasWill) score += 15;
  else if (!hasDeps) score += 10;

  return Math.min(100, score);
}

function concentrationRiskScore(profile: FinancialProfile): number {
  const total =
    profile.pension.currentBalance +
    profile.realEstate.properties.reduce((s, p) => s + p.estimatedValue, 0) +
    (profile.investments.brokerageAccount?.totalValue ?? 0) +
    (profile.investments.crypto?.totalValue ?? 0) +
    profile.savings.liquidSavings;

  if (total === 0) return 50;

  const re = profile.realEstate.properties.reduce((s, p) => s + p.estimatedValue, 0);
  const crypto = profile.investments.crypto?.totalValue ?? 0;
  const maxBucket = Math.max(re, profile.pension.currentBalance, profile.investments.brokerageAccount?.totalValue ?? 0, crypto, profile.savings.liquidSavings);
  const concentration = maxBucket / total;

  if (concentration <= 0.3) return 100;
  if (concentration <= 0.5) return 60 + ((0.5 - concentration) / 0.2) * 40;
  if (concentration <= 0.7) return 30 + ((0.7 - concentration) / 0.2) * 30;
  return Math.max(0, concentration < 1 ? 30 - (concentration - 0.7) * 100 : 0);
}

function currencyDiversificationScore(profile: FinancialProfile): number {
  const total =
    (profile.investments.brokerageAccount?.totalValue ?? 0) +
    (profile.investments.crypto?.totalValue ?? 0);
  if (total === 0) return 40;

  const intl = (profile.investments.brokerageAccount?.allocation.internationalStocks ?? 0) *
    (profile.investments.brokerageAccount?.totalValue ?? 0);
  const cryptoUsd = profile.investments.crypto?.totalValue ?? 0;
  const usdExposure = (intl + cryptoUsd) / (total || 1);

  if (usdExposure >= 0.3 && usdExposure <= 0.7) return 100;
  if (usdExposure >= 0.15) return 60 + ((usdExposure - 0.15) / 0.15) * 40;
  return Math.max(20, usdExposure * 400);
}

export function scoreRiskManagement(profile: FinancialProfile): CategoryScore {
  const s1 = insuranceCoverageScore(profile);
  const s2 = concentrationRiskScore(profile);
  const s3 = currencyDiversificationScore(profile);
  const s4 = profile.insurance.hasWill ? 100 : profile.profile.dependents > 0 ? 20 : 60;

  const raw = s1 * 0.4 + s2 * 0.3 + s3 * 0.15 + s4 * 0.15;
  const score = clamp(Math.round(raw * 10) / 10, 0, 100);

  return {
    category: "risk_management",
    categoryNameHe: "ניהול סיכונים",
    score,
    weight: CATEGORY_WEIGHTS.risk_management,
    grade: scoreToGrade(score).grade,
    details: {
      insuranceSubScore: Math.round(s1),
      concentrationSubScore: Math.round(s2),
      currencySubScore: Math.round(s3),
      estatePlanningSubScore: Math.round(s4),
    },
  };
}
