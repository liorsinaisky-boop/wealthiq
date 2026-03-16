// Shared test helpers for score engine tests
import type { FinancialProfile } from "@/lib/types";

/**
 * Returns a realistic base profile for a 32-year-old Israeli tech employee.
 * Mutate the returned object directly for per-test overrides.
 */
export function makeProfile(): FinancialProfile {
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
      targetBudget: 2_000_000,
      downPaymentAvailable: 300_000,
    },
    investments: {
      hasBrokerage: true,
      brokerageAccount: {
        platform: "interactive_brokers",
        totalValue: 150_000,
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
      crypto: { totalValue: 25_000, holdings: ["btc", "eth"] },
      hasOtherInvestments: false,
      otherInvestments: [],
    },
    savings: {
      liquidSavings: 50_000,
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
      monthlyExpenses: 9_000,
      monthlySavingsAmount: 3_500,
      budgetDiscipline: "loose",
    },
    completedAt: new Date().toISOString(),
  };
}

export const VALID_GRADES = ["A+", "A", "B+", "B", "C", "D", "F"] as const;

export function assertValidScore(score: number): void {
  // Re-export common assertions used by every test
  if (isNaN(score)) throw new Error(`Score is NaN`);
  if (!isFinite(score)) throw new Error(`Score is not finite: ${score}`);
  if (score < 0 || score > 100) throw new Error(`Score ${score} is outside 0–100`);
}
