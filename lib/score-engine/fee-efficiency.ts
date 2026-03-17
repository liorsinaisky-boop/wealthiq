import type { FinancialProfile, CategoryScore } from "@/lib/types";
import { AVG_FEES, CATEGORY_WEIGHTS } from "./constants";
import { clamp, scoreToGrade } from "@/lib/utils/format";

function pensionFeeScore(profile: FinancialProfile): number {
  const { pension } = profile;
  const avg = AVG_FEES[pension.productType as keyof typeof AVG_FEES] || AVG_FEES.not_sure;
  const mgmt = pension.managementFeePercent ?? avg.management;
  const dep = pension.depositFeePercent ?? avg.deposit;
  const total = mgmt + dep;
  const avgTotal = avg.management + avg.deposit;
  if (avgTotal === 0) return 70;
  const ratio = total / avgTotal;
  if (ratio <= 0.7) return 100;
  if (ratio <= 1.0) return 65 + ((1.0 - ratio) / 0.3) * 35;
  if (ratio <= 1.3) return 35 + ((1.3 - ratio) / 0.3) * 30;
  return Math.max(0, 35 - (ratio - 1.3) * 50);
}

function investmentFeeScore(profile: FinancialProfile): number {
  if (!profile.investments.hasBrokerage) return 60; // neutral
  const fee = profile.investments.brokerageAccount?.annualFeePercent ?? 0.8;
  if (fee <= 0.2) return 100;
  if (fee <= 0.5) return 75 + ((0.5 - fee) / 0.3) * 25;
  if (fee <= 1.0) return 40 + ((1.0 - fee) / 0.5) * 35;
  if (fee <= 1.5) return 15 + ((1.5 - fee) / 0.5) * 25;
  return Math.max(0, 15 - (fee - 1.5) * 15);
}

function loanRateScore(profile: FinancialProfile): number {
  const { debt, realEstate } = profile;
  const rates: number[] = [];
  (realEstate.properties ?? []).forEach(p => { if (p.mortgage) rates.push(p.mortgage.interestRate); });
  (debt.loans ?? []).forEach(l => rates.push(l.interestRate));

  if (rates.length === 0) return 70; // no debt = neutral-positive
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  if (avgRate <= 0.03) return 100;
  if (avgRate <= 0.05) return 70 + ((0.05 - avgRate) / 0.02) * 30;
  if (avgRate <= 0.08) return 40 + ((0.08 - avgRate) / 0.03) * 30;
  return Math.max(0, 40 - (avgRate - 0.08) * 200);
}

export function scoreFeeEfficiency(profile: FinancialProfile): CategoryScore {
  const s1 = pensionFeeScore(profile);
  const s2 = investmentFeeScore(profile);
  const s3 = loanRateScore(profile);
  const raw = s1 * 0.4 + s2 * 0.3 + s3 * 0.3;
  const score = clamp(Math.round(raw * 10) / 10, 0, 100);

  return {
    category: "fee_efficiency",
    categoryNameHe: "יעילות עלויות",
    score,
    weight: CATEGORY_WEIGHTS.fee_efficiency,
    grade: scoreToGrade(score).grade,
    details: {
      pensionFeeSubScore: Math.round(s1),
      investmentFeeSubScore: Math.round(s2),
      loanRateSubScore: Math.round(s3),
    },
  };
}
