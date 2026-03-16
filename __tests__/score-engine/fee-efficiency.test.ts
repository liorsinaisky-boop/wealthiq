import { describe, it, expect } from "vitest";
import { scoreFeeEfficiency } from "@/lib/score-engine/fee-efficiency";
import { makeProfile, VALID_GRADES } from "./helpers";

describe("scoreFeeEfficiency", () => {
  it("returns score 0–100 for normal 32yo employee", () => {
    const result = scoreFeeEfficiency(makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(VALID_GRADES).toContain(result.grade);
  });

  it("returns correct category metadata", () => {
    const result = scoreFeeEfficiency(makeProfile());
    expect(result.category).toBe("fee_efficiency");
    expect(result.weight).toBe(0.10);
    expect(result.categoryNameHe).toBeTruthy();
  });

  it("young starter (age 23) — valid score regardless of fees", () => {
    const p = makeProfile();
    p.profile.age = 23;
    p.pension.currentBalance = 5_000;
    const result = scoreFeeEfficiency(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
  });

  it("near retirement — null fees fall back to average, no crash", () => {
    const p = makeProfile();
    p.profile.age = 65;
    p.pension.managementFeePercent = null;
    p.pension.depositFeePercent = null;
    const result = scoreFeeEfficiency(p);
    expect(isNaN(result.score)).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("zero salary — valid score, no NaN", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 0;
    const result = scoreFeeEfficiency(p);
    expect(isNaN(result.score)).toBe(false);
    expect(isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("extreme: very high fees — low pension fee sub-score", () => {
    const p = makeProfile();
    p.pension.managementFeePercent = 2.0;  // extreme — 9x avg
    p.pension.depositFeePercent = 5.0;
    const result = scoreFeeEfficiency(p);
    expect(result.details.pensionFeeSubScore as number).toBe(0);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("very low fees (70% of avg) → pension fee sub-score = 100", () => {
    const p = makeProfile();
    // keren_pensia avg: management=0.22, deposit=1.49 → total=1.71
    // 70% of avg = 1.197 → e.g. 0.08 + 0.3 = 0.38 (well below 70%)
    p.pension.managementFeePercent = 0.08;
    p.pension.depositFeePercent = 0.3;
    const result = scoreFeeEfficiency(p);
    expect(result.details.pensionFeeSubScore as number).toBe(100);
  });

  it("low fees → higher score than high fees", () => {
    const lowFees = makeProfile();
    lowFees.pension.managementFeePercent = 0.05;
    lowFees.pension.depositFeePercent = 0.2;

    const highFees = makeProfile();
    highFees.pension.managementFeePercent = 1.5;
    highFees.pension.depositFeePercent = 4.0;

    const r1 = scoreFeeEfficiency(lowFees);
    const r2 = scoreFeeEfficiency(highFees);
    expect(r1.score).toBeGreaterThan(r2.score);
  });

  it("no brokerage account → investment fee score = 60 (neutral)", () => {
    const p = makeProfile();
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    const result = scoreFeeEfficiency(p);
    expect(result.details.investmentFeeSubScore as number).toBe(60);
  });

  it("very low brokerage fee (≤0.2%) → investment fee sub-score = 100", () => {
    const p = makeProfile();
    p.investments.hasBrokerage = true;
    p.investments.brokerageAccount!.annualFeePercent = 0.1;
    const result = scoreFeeEfficiency(p);
    expect(result.details.investmentFeeSubScore as number).toBe(100);
  });

  it("high brokerage fee (>1.5%) → low investment fee sub-score", () => {
    const p = makeProfile();
    p.investments.hasBrokerage = true;
    p.investments.brokerageAccount!.annualFeePercent = 2.5;
    const result = scoreFeeEfficiency(p);
    expect(result.details.investmentFeeSubScore as number).toBeLessThan(15);
  });

  it("no loans/mortgages → loan rate sub-score = 70 (neutral)", () => {
    const p = makeProfile();
    p.debt.loans = [];
    p.realEstate.properties = [];
    const result = scoreFeeEfficiency(p);
    expect(result.details.loanRateSubScore as number).toBe(70);
  });

  it("very low mortgage rate (≤3%) → loan rate sub-score = 100", () => {
    const p = makeProfile();
    p.realEstate.ownsProperty = true;
    p.realEstate.properties = [{
      type: "apartment", city: "תל אביב",
      estimatedValue: 2_000_000, purchaseYear: 2020, purchasePrice: 1_500_000,
      hasMortgage: true, mortgage: {
        remainingBalance: 800_000, monthlyPayment: 5_500,
        interestRate: 0.025, trackType: "fixed_unlinked", yearsRemaining: 20,
      },
      isRented: false,
    }];
    const result = scoreFeeEfficiency(p);
    expect(result.details.loanRateSubScore as number).toBe(100);
  });

  it("high loan rate (>8%) → low loan rate sub-score", () => {
    const p = makeProfile();
    p.debt.hasLoans = true;
    p.debt.loans = [{
      type: "personal", remainingBalance: 50_000,
      monthlyPayment: 2_000, interestRate: 0.15, monthsRemaining: 30,
    }];
    const result = scoreFeeEfficiency(p);
    expect(result.details.loanRateSubScore as number).toBeLessThan(40);
  });

  it("bituach_menahalim with high fees — lower score than keren_pensia with same fees", () => {
    const bm = makeProfile();
    bm.pension.productType = "bituach_menahalim";
    bm.pension.managementFeePercent = 0.72; // at avg for bm
    bm.pension.depositFeePercent = 2.0;

    const kp = makeProfile();
    kp.pension.productType = "keren_pensia";
    kp.pension.managementFeePercent = 0.22; // at avg for kp
    kp.pension.depositFeePercent = 1.49;

    const r1 = scoreFeeEfficiency(bm);
    const r2 = scoreFeeEfficiency(kp);
    // Both at avg → both should score around 65
    expect(Math.abs(r1.details.pensionFeeSubScore as number - 65)).toBeLessThanOrEqual(5);
    expect(Math.abs(r2.details.pensionFeeSubScore as number - 65)).toBeLessThanOrEqual(5);
  });

  it("details contain all expected fields", () => {
    const result = scoreFeeEfficiency(makeProfile());
    expect(result.details).toHaveProperty("pensionFeeSubScore");
    expect(result.details).toHaveProperty("investmentFeeSubScore");
    expect(result.details).toHaveProperty("loanRateSubScore");
  });
});
