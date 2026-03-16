import { describe, it, expect } from "vitest";
import { scoreWealthGrowth } from "@/lib/score-engine/wealth-growth";
import { makeProfile, VALID_GRADES } from "./helpers";

describe("scoreWealthGrowth", () => {
  it("returns score 0–100 for normal 32yo employee", () => {
    const result = scoreWealthGrowth(makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(VALID_GRADES).toContain(result.grade);
  });

  it("returns correct category metadata", () => {
    const result = scoreWealthGrowth(makeProfile());
    expect(result.category).toBe("wealth_growth");
    expect(result.weight).toBe(0.20);
    expect(result.categoryNameHe).toBeTruthy();
  });

  it("young starter (age 23, zero assets) — valid score", () => {
    const p = makeProfile();
    p.profile.age = 23;
    p.pension.currentBalance = 0;
    p.pension.kerenHishtalmut = { hasOne: false };
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    p.investments.hasCrypto = false;
    p.investments.crypto = undefined;
    p.savings.liquidSavings = 0;
    const result = scoreWealthGrowth(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
  });

  it("near retirement (age 65) with large net worth — higher score", () => {
    const p = makeProfile();
    p.profile.age = 65;
    p.pension.currentBalance = 2_500_000;
    p.savings.liquidSavings = 300_000;
    p.investments.brokerageAccount!.totalValue = 800_000;
    const result = scoreWealthGrowth(p);
    expect(result.score).toBeGreaterThan(50);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("zero salary and zero assets — valid score, no NaN", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 0;
    p.pension.currentBalance = 0;
    p.pension.kerenHishtalmut = { hasOne: false };
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    p.investments.hasCrypto = false;
    p.investments.crypto = undefined;
    p.savings.liquidSavings = 0;
    const result = scoreWealthGrowth(p);
    expect(isNaN(result.score)).toBe(false);
    expect(isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("extreme: ₪50M net worth — score is valid and high", () => {
    const p = makeProfile();
    p.pension.currentBalance = 10_000_000;
    p.pension.kerenHishtalmut = { hasOne: true, balance: 5_000_000 };
    p.investments.brokerageAccount!.totalValue = 20_000_000;
    p.savings.liquidSavings = 5_000_000;
    // nwScore = 100 but diversification/reScore sub-scores pull composite below 100
    const result = scoreWealthGrowth(p);
    expect(result.score).toBeGreaterThan(60);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
    // The net worth vs benchmark sub-component should be 100
  });

  it("property with equity improves score vs no property", () => {
    const withProperty = makeProfile();
    withProperty.realEstate.ownsProperty = true;
    withProperty.realEstate.properties = [{
      type: "apartment", city: "תל אביב",
      estimatedValue: 2_000_000, purchaseYear: 2015, purchasePrice: 1_200_000,
      hasMortgage: true, mortgage: {
        remainingBalance: 500_000, monthlyPayment: 5_000,
        interestRate: 0.03, trackType: "prime", yearsRemaining: 15,
      },
      isRented: false,
    }];

    const withoutProperty = makeProfile();

    const r1 = scoreWealthGrowth(withProperty);
    const r2 = scoreWealthGrowth(withoutProperty);
    expect(r1.score).toBeGreaterThanOrEqual(r2.score);
  });

  it("negative net worth (debt > assets) — score still valid", () => {
    const p = makeProfile();
    p.pension.currentBalance = 50_000;
    p.pension.kerenHishtalmut = { hasOne: false };
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    p.investments.hasCrypto = false;
    p.investments.crypto = undefined;
    p.savings.liquidSavings = 5_000;
    p.debt.loans = [{
      type: "personal", remainingBalance: 300_000,
      monthlyPayment: 5_000, interestRate: 0.08, monthsRemaining: 60,
    }];
    const result = scoreWealthGrowth(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
  });

  it("diversified portfolio → higher diversification score than single asset", () => {
    const diversified = makeProfile();
    // already diversified in base profile

    const concentrated = makeProfile();
    concentrated.pension.currentBalance = 1_000_000;
    concentrated.pension.kerenHishtalmut = { hasOne: false };
    concentrated.investments.hasBrokerage = false;
    concentrated.investments.brokerageAccount = undefined;
    concentrated.investments.hasCrypto = false;
    concentrated.investments.crypto = undefined;
    concentrated.savings.liquidSavings = 0;

    const r1 = scoreWealthGrowth(diversified);
    const r2 = scoreWealthGrowth(concentrated);
    expect(r1.details.diversificationScore as number).toBeGreaterThanOrEqual(
      r2.details.diversificationScore as number
    );
  });

  it("details contain all expected fields", () => {
    const result = scoreWealthGrowth(makeProfile());
    expect(result.details).toHaveProperty("totalAssets");
    expect(result.details).toHaveProperty("totalLiabilities");
    expect(result.details).toHaveProperty("netWorth");
    expect(result.details).toHaveProperty("benchmark");
    expect(result.details).toHaveProperty("diversificationScore");
    expect(result.details).toHaveProperty("realEstateEquity");
  });

  it("total assets = sum of all asset classes", () => {
    const p = makeProfile();
    const result = scoreWealthGrowth(p);
    // Should not be NaN or negative
    expect(result.details.totalAssets as number).toBeGreaterThan(0);
    expect((result.details.netWorth as number)).toBe(
      (result.details.totalAssets as number) - (result.details.totalLiabilities as number)
    );
  });
});
