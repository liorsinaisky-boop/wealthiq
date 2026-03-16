import { describe, it, expect } from "vitest";
import { scoreGoalAlignment } from "@/lib/score-engine/goal-alignment";
import { makeProfile, VALID_GRADES } from "./helpers";

describe("scoreGoalAlignment", () => {
  it("returns score 0–100 for normal 32yo (comfortable_retirement goal)", () => {
    const result = scoreGoalAlignment(makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(VALID_GRADES).toContain(result.grade);
  });

  it("returns correct category metadata", () => {
    const result = scoreGoalAlignment(makeProfile());
    expect(result.category).toBe("goal_alignment");
    expect(result.weight).toBe(0.10);
    expect(result.categoryNameHe).toBeTruthy();
  });

  it("young starter (age 23) with zero pension — valid score, no NaN", () => {
    const p = makeProfile();
    p.profile.age = 23;
    p.pension.currentBalance = 0;
    p.cashFlow.monthlyExpenses = 5_000;
    const result = scoreGoalAlignment(p);
    expect(isNaN(result.score)).toBe(false);
    expect(isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("near retirement (age 65) with large pension — high score", () => {
    const p = makeProfile();
    p.profile.age = 65;
    p.profile.targetRetirementAge = 67;
    p.pension.currentBalance = 3_000_000;
    p.cashFlow.monthlyExpenses = 12_000;
    const result = scoreGoalAlignment(p);
    expect(result.score).toBeGreaterThan(50);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("zero salary and zero pension — no NaN, valid score", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 0;
    p.pension.currentBalance = 0;
    p.cashFlow.monthlyExpenses = 0; // targetIncome = 0 → returns 70
    const result = scoreGoalAlignment(p);
    expect(isNaN(result.score)).toBe(false);
    expect(isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("extreme: ₪50M pension, 30yo → very high score", () => {
    const p = makeProfile();
    p.profile.age = 30;
    p.pension.currentBalance = 50_000_000;
    p.cashFlow.monthlyExpenses = 15_000;
    // retirement projection = 100, but goalSpecificScore for comfortable_retirement = 60 (default)
    // raw = 100*0.6 + 60*0.4 = 84 → score = 84
    const result = scoreGoalAlignment(p);
    expect(result.score).toBeGreaterThan(80);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
    expect(result.details.retirementProjectionScore as number).toBe(100);
  });

  it("goal: buy_home — already owns property → high goal-specific score (90)", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "buy_home";
    p.realEstate.ownsProperty = true;
    p.realEstate.properties = [{
      type: "apartment", city: "תל אביב",
      estimatedValue: 2_000_000, purchaseYear: 2018, purchasePrice: 1_500_000,
      hasMortgage: false, isRented: false,
    }];
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(90);
  });

  it("goal: buy_home — no property, good savings → mid-range goal score", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "buy_home";
    p.realEstate.ownsProperty = false;
    p.realEstate.downPaymentAvailable = 250_000; // > ₪200K → 70
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(70);
  });

  it("goal: buy_home — no savings for down payment → low goal score", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "buy_home";
    p.realEstate.ownsProperty = false;
    p.realEstate.downPaymentAvailable = 50_000; // < ₪100K → 30
    p.savings.liquidSavings = 50_000;
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(30);
  });

  it("goal: early_retirement with target age 56 (11 years early) → low score (40)", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "early_retirement";
    // yearsEarly = 67-56 = 11 → yearsEarly > 10 → 40
    p.profile.targetRetirementAge = 56;
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(40);
  });

  it("goal: early_retirement with target age 57 (exactly 10 years early) → mid score (55)", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "early_retirement";
    // yearsEarly = 67-57 = 10 → NOT > 10, yearsEarly > 5 → 55
    p.profile.targetRetirementAge = 57;
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(55);
  });

  it("goal: early_retirement with target age 61 (6 years early) → mid score (55)", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "early_retirement";
    // yearsEarly = 67-61 = 6 → yearsEarly > 5 → 55
    p.profile.targetRetirementAge = 61;
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(55);
  });

  it("goal: early_retirement with target age 62 (exactly 5 years early) → higher score (70)", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "early_retirement";
    // yearsEarly = 67-62 = 5 → NOT > 5 → 70
    p.profile.targetRetirementAge = 62;
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(70);
  });

  it("goal: financial_independence with high savings rate → high goal score", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "financial_independence";
    p.income.monthlyNetSalary = 20_000;
    p.cashFlow.monthlySavingsAmount = 9_000; // 45% → ≥ 40% → 90
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(90);
  });

  it("goal: financial_independence with low savings rate → lower goal score", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "financial_independence";
    p.income.monthlyNetSalary = 20_000;
    p.cashFlow.monthlySavingsAmount = 1_000; // 5% → < 15% → 25
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(25);
  });

  it("goal: other/children_education → falls through to default (60)", () => {
    const p = makeProfile();
    p.profile.primaryGoal = "children_education";
    const result = scoreGoalAlignment(p);
    expect(result.details.goalSpecificScore as number).toBe(60);
  });

  it("zero monthly expenses → retirement projection returns 70 (targetIncome = 0)", () => {
    const p = makeProfile();
    p.cashFlow.monthlyExpenses = 0;
    const result = scoreGoalAlignment(p);
    expect(result.details.retirementProjectionScore as number).toBe(70);
    expect(isNaN(result.score)).toBe(false);
  });

  it("more years to retirement → higher pension projection vs near-retirement low balance", () => {
    const young = makeProfile();
    young.profile.age = 30;
    young.pension.currentBalance = 100_000;
    young.cashFlow.monthlyExpenses = 10_000;

    const old = makeProfile();
    old.profile.age = 60;
    old.pension.currentBalance = 100_000;
    old.cashFlow.monthlyExpenses = 10_000;

    const r1 = scoreGoalAlignment(young);
    const r2 = scoreGoalAlignment(old);
    expect(r1.details.retirementProjectionScore as number).toBeGreaterThan(
      r2.details.retirementProjectionScore as number
    );
  });

  it("details contain all expected fields", () => {
    const result = scoreGoalAlignment(makeProfile());
    expect(result.details).toHaveProperty("retirementProjectionScore");
    expect(result.details).toHaveProperty("goalSpecificScore");
    expect(result.details).toHaveProperty("primaryGoal");
  });
});
