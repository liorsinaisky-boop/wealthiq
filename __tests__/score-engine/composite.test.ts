// ============================================================
// __tests__/score-engine/composite.test.ts
// Tests for the WealthIQ score engine
// ============================================================

import { describe, it, expect } from "vitest";
import { calculateWealthIQ } from "@/lib/score-engine/composite";
import type { FinancialProfile } from "@/lib/types";

// ── Helper: Create a default profile ─────────────────────────

function makeProfile(overrides: Partial<Record<string, unknown>> = {}): FinancialProfile {
  return {
    profile: {
      age: 32,
      gender: "male",
      maritalStatus: "single",
      dependents: 0,
      city: "תל אביב",
      riskTolerance: "balanced",
      primaryGoal: "comfortable_retirement",
      targetRetirementAge: 67,
    },
    income: {
      employmentStatus: "employee",
      monthlyGrossSalary: 18000,
      monthlyNetSalary: 12500,
      additionalIncome: [],
      yearsAtCurrentJob: 5,
      industry: "tech",
    },
    pension: {
      productType: "keren_pensia",
      investmentTrack: "general",
      currentBalance: 210000,
      managementFeePercent: 0.22,
      depositFeePercent: 1.49,
      kerenHishtalmut: { hasOne: true, balance: 80000 },
      hasOldAccounts: "no",
      makesVoluntaryContributions: false,
    },
    realEstate: {
      ownsProperty: false,
      properties: [],
      planningToBuy: true,
      targetBudget: 2000000,
      downPaymentAvailable: 300000,
    },
    investments: {
      hasBrokerage: true,
      brokerageAccount: {
        platform: "interactive_brokers",
        totalValue: 150000,
        allocation: {
          israeliStocks: 0.2,
          internationalStocks: 0.5,
          bonds: 0.1,
          etfsIndexFunds: 0.15,
          other: 0.05,
        },
        annualFeePercent: 0.3,
      },
      hasCrypto: true,
      crypto: { totalValue: 25000, holdings: ["btc", "eth"] },
      hasOtherInvestments: false,
      otherInvestments: [],
    },
    savings: {
      liquidSavings: 50000,
      hasEmergencyFund: "savings_is_emergency",
      hasFixedDeposits: false,
      hasSavingsPlans: false,
      hasChildSavings: false,
    },
    debt: {
      hasLoans: false,
      loans: [],
      creditCardDebt: 0,
      totalMonthlyObligations: 0,
    },
    insurance: {
      hasLifeInsurance: "no",
      hasDisabilityInsurance: "through_pension",
      hasPrivateHealthInsurance: true,
      hasPropertyInsurance: false,
      hasWill: false,
    },
    cashFlow: {
      monthlyExpenses: 9000,
      monthlySavingsAmount: 3500,
      budgetDiscipline: "loose",
    },
    completedAt: new Date().toISOString(),
    ...(overrides as Record<string, unknown>),
  } as FinancialProfile;
}

// ── Tests ────────────────────────────────────────────────────

describe("calculateWealthIQ", () => {
  it("should return a score between 0 and 100", () => {
    const result = calculateWealthIQ(makeProfile());
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });

  it("should return all 6 category scores", () => {
    const result = calculateWealthIQ(makeProfile());
    expect(result.categoryScores).toHaveLength(6);
    
    const categories = result.categoryScores.map((c) => c.category);
    expect(categories).toContain("retirement_readiness");
    expect(categories).toContain("financial_stability");
    expect(categories).toContain("wealth_growth");
    expect(categories).toContain("risk_management");
    expect(categories).toContain("fee_efficiency");
    expect(categories).toContain("goal_alignment");
  });

  it("should return valid grades", () => {
    const validGrades = ["A+", "A", "B+", "B", "C", "D", "F"];
    const result = calculateWealthIQ(makeProfile());
    expect(validGrades).toContain(result.grade);
    
    for (const cat of result.categoryScores) {
      expect(validGrades).toContain(cat.grade);
    }
  });

  it("should return a percentile between 1 and 99", () => {
    const result = calculateWealthIQ(makeProfile());
    expect(result.percentileEstimate).toBeGreaterThanOrEqual(1);
    expect(result.percentileEstimate).toBeLessThanOrEqual(99);
  });

  it("should compute net worth correctly", () => {
    const result = calculateWealthIQ(makeProfile());
    expect(result.netWorth.totalAssets).toBeGreaterThan(0);
    expect(result.netWorth.netWorth).toBe(
      result.netWorth.totalAssets - result.netWorth.totalLiabilities
    );
  });

  it("should apply crypto penalty when crypto > 20% of portfolio", () => {
    const highCrypto = makeProfile();
    highCrypto.investments.crypto = { totalValue: 500000, holdings: ["btc"] };
    highCrypto.savings.liquidSavings = 10000;
    
    const result = calculateWealthIQ(highCrypto);
    const cryptoPenalty = result.bonusesPenalties.find((bp) => bp.id === "crypto_heavy");
    expect(cryptoPenalty?.applied).toBe(true);
  });

  it("should give higher score to someone with low fees", () => {
    const lowFees = makeProfile();
    lowFees.pension.managementFeePercent = 0.08;
    lowFees.pension.depositFeePercent = 0.5;

    const highFees = makeProfile();
    highFees.pension.managementFeePercent = 0.8;
    highFees.pension.depositFeePercent = 3.0;

    const lowResult = calculateWealthIQ(lowFees);
    const highResult = calculateWealthIQ(highFees);

    const lowFeeScore = lowResult.categoryScores.find((c) => c.category === "fee_efficiency")!.score;
    const highFeeScore = highResult.categoryScores.find((c) => c.category === "fee_efficiency")!.score;

    expect(lowFeeScore).toBeGreaterThan(highFeeScore);
  });

  it("should include disclaimer", () => {
    const result = calculateWealthIQ(makeProfile());
    expect(result.disclaimer).toBeTruthy();
    expect(result.disclaimer).toContain("מידע כללי בלבד");
  });

  it("should build insights context with all required fields", () => {
    const result = calculateWealthIQ(makeProfile());
    const ctx = result.insightsContext;
    
    expect(ctx.age).toBe(32);
    expect(ctx.salary).toBe(18000);
    expect(ctx.totalScore).toBeGreaterThan(0);
    expect(ctx.grade).toBeTruthy();
    expect(ctx.percentile).toBeGreaterThan(0);
    expect(typeof ctx.emergencyFundMonths).toBe("number");
    expect(typeof ctx.debtToIncomeRatio).toBe("number");
  });

  it("should handle edge case: very young user with no assets", () => {
    const young = makeProfile();
    young.profile.age = 23;
    young.pension.currentBalance = 0;
    young.investments.hasBrokerage = false;
    young.investments.brokerageAccount = undefined;
    young.investments.hasCrypto = false;
    young.investments.crypto = undefined;
    young.savings.liquidSavings = 5000;

    const result = calculateWealthIQ(young);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });

  it("should handle edge case: near-retirement user", () => {
    const senior = makeProfile();
    senior.profile.age = 65;
    senior.pension.currentBalance = 2500000;
    senior.pension.investmentTrack = "age_over_60";

    const result = calculateWealthIQ(senior);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
  });
});
