import { describe, it, expect } from "vitest";
import { scoreFinancialStability } from "@/lib/score-engine/financial-stability";
import { makeProfile, VALID_GRADES } from "./helpers";

describe("scoreFinancialStability", () => {
  it("returns score 0–100 for normal 32yo employee", () => {
    const result = scoreFinancialStability(makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(VALID_GRADES).toContain(result.grade);
  });

  it("returns correct category metadata", () => {
    const result = scoreFinancialStability(makeProfile());
    expect(result.category).toBe("financial_stability");
    expect(result.weight).toBe(0.20);
    expect(result.categoryNameHe).toBeTruthy();
  });

  it("young starter (age 23, zero savings) — valid score", () => {
    const p = makeProfile();
    p.profile.age = 23;
    p.savings.liquidSavings = 0;
    p.cashFlow.monthlySavingsAmount = 0;
    const result = scoreFinancialStability(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
  });

  it("near retirement (age 65) with large emergency fund — high score", () => {
    const p = makeProfile();
    p.profile.age = 65;
    p.savings.liquidSavings = 500_000;
    p.savings.hasEmergencyFund = "yes";
    p.savings.emergencyFundAmount = 500_000;
    p.cashFlow.monthlyExpenses = 15_000;
    p.cashFlow.monthlySavingsAmount = 10_000;
    p.debt.totalMonthlyObligations = 0;
    const result = scoreFinancialStability(p);
    expect(result.score).toBeGreaterThan(60);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("zero salary — no crash, valid score", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 0;
    p.income.monthlyNetSalary = 0;
    p.cashFlow.monthlyExpenses = 0;
    p.cashFlow.monthlySavingsAmount = 0;
    const result = scoreFinancialStability(p);
    expect(isNaN(result.score)).toBe(false);
    expect(isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("extreme: very high savings rate and zero debt — near-max score", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 50_000;
    p.income.monthlyNetSalary = 35_000;
    p.cashFlow.monthlySavingsAmount = 15_000; // 43% savings rate
    p.cashFlow.monthlyExpenses = 10_000;
    p.savings.liquidSavings = 300_000;
    p.savings.emergencyFundAmount = 300_000;
    p.savings.hasEmergencyFund = "yes";
    p.debt.totalMonthlyObligations = 0;
    const result = scoreFinancialStability(p);
    expect(result.score).toBeGreaterThan(70);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("very high DTI (>83%) → debt sub-score = 0", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 10_000;
    p.debt.totalMonthlyObligations = 9_000; // 90% DTI → 20-(0.9-0.5)*60 = -4 → max(0) = 0
    const result = scoreFinancialStability(p);
    expect(result.details.debtSubScore as number).toBe(0);
  });

  it("high DTI (60%) → debt sub-score is very low (<20)", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 10_000;
    p.debt.totalMonthlyObligations = 6_000; // 60% DTI
    const result = scoreFinancialStability(p);
    expect(result.details.debtSubScore as number).toBeLessThan(20);
  });

  it("zero monthly expenses — emergencyFundMonths defaults to 12", () => {
    const p = makeProfile();
    p.cashFlow.monthlyExpenses = 0;
    p.savings.liquidSavings = 50_000;
    const result = scoreFinancialStability(p);
    // emergencyFundMonths(50000, 0) = 12 → full coverage → high sub-score
    expect(result.details.emergencyFundMonths as number).toBe(12);
    expect(isNaN(result.score)).toBe(false);
  });

  it("good emergency fund → higher score than no emergency fund", () => {
    const goodEF = makeProfile();
    goodEF.savings.liquidSavings = 120_000; // 13+ months at ₪9k expenses
    goodEF.savings.hasEmergencyFund = "savings_is_emergency";

    const noEF = makeProfile();
    noEF.savings.liquidSavings = 0;

    const r1 = scoreFinancialStability(goodEF);
    const r2 = scoreFinancialStability(noEF);
    expect(r1.score).toBeGreaterThan(r2.score);
  });

  it("high savings rate (>30%) → max savings sub-score", () => {
    const p = makeProfile();
    p.income.monthlyNetSalary = 20_000;
    p.cashFlow.monthlySavingsAmount = 7_000; // 35%
    const result = scoreFinancialStability(p);
    expect(result.details.savingsSubScore as number).toBe(100);
  });

  it("with dependents needs more emergency fund than without", () => {
    const withDeps = makeProfile();
    withDeps.profile.dependents = 2;
    withDeps.savings.liquidSavings = 54_000; // 6 months at ₪9k

    const withoutDeps = makeProfile();
    withoutDeps.savings.liquidSavings = 54_000;

    const r1 = scoreFinancialStability(withDeps);
    const r2 = scoreFinancialStability(withoutDeps);
    // Without dependents: 6 months meets target (score=75+)
    // With dependents: 6 months is below 9-month target (score lower)
    expect(r1.details.efSubScore as number).toBeLessThan(r2.details.efSubScore as number);
  });

  it("details contain all expected fields", () => {
    const result = scoreFinancialStability(makeProfile());
    expect(result.details).toHaveProperty("emergencyFundMonths");
    expect(result.details).toHaveProperty("debtToIncomeRatio");
    expect(result.details).toHaveProperty("savingsRate");
    expect(result.details).toHaveProperty("efSubScore");
    expect(result.details).toHaveProperty("debtSubScore");
    expect(result.details).toHaveProperty("savingsSubScore");
    expect(result.details).toHaveProperty("cashFlowSubScore");
  });
});
