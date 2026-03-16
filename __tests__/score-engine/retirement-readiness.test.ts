import { describe, it, expect } from "vitest";
import { scoreRetirementReadiness } from "@/lib/score-engine/retirement-readiness";
import { makeProfile, VALID_GRADES } from "./helpers";

describe("scoreRetirementReadiness", () => {
  it("returns score 0–100 for normal 32yo employee", () => {
    const result = scoreRetirementReadiness(makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(VALID_GRADES).toContain(result.grade);
  });

  it("returns correct category metadata", () => {
    const result = scoreRetirementReadiness(makeProfile());
    expect(result.category).toBe("retirement_readiness");
    expect(result.weight).toBe(0.25);
    expect(result.categoryNameHe).toBeTruthy();
  });

  it("young starter (age 23, zero balance) — no crash, valid score", () => {
    const p = makeProfile();
    p.profile.age = 23;
    p.pension.currentBalance = 0;
    p.pension.kerenHishtalmut = { hasOne: false };
    const result = scoreRetirementReadiness(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
  });

  it("near retirement (age 65) with substantial savings — high score", () => {
    const p = makeProfile();
    p.profile.age = 65;
    p.pension.currentBalance = 2_500_000;
    p.pension.managementFeePercent = 0.1;
    p.pension.depositFeePercent = 0.5;
    p.pension.investmentTrack = "age_over_60";
    const result = scoreRetirementReadiness(p);
    expect(result.score).toBeGreaterThan(50);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("zero salary — score is finite and valid", () => {
    const p = makeProfile();
    p.income.monthlyGrossSalary = 0;
    p.pension.currentBalance = 0;
    const result = scoreRetirementReadiness(p);
    expect(isNaN(result.score)).toBe(false);
    expect(isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("extreme: ₪50M balance — score is valid and high", () => {
    const p = makeProfile();
    p.pension.currentBalance = 50_000_000;
    // savingsAdequacy hits 100, but fee/allocation sub-scores pull composite below 100
    const result = scoreRetirementReadiness(p);
    expect(result.score).toBeGreaterThan(70);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
    // The savings sub-score itself is fully maxed
    expect(result.details.savingsSubScore as number).toBe(100);
  });

  it("null fees — falls back to averages, no NaN", () => {
    const p = makeProfile();
    p.pension.managementFeePercent = null;
    p.pension.depositFeePercent = null;
    const result = scoreRetirementReadiness(p);
    expect(isNaN(result.score)).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("low fees → higher fee sub-score than high fees", () => {
    const lowFees = makeProfile();
    lowFees.pension.managementFeePercent = 0.05;
    lowFees.pension.depositFeePercent = 0.3;

    const highFees = makeProfile();
    highFees.pension.managementFeePercent = 0.9;
    highFees.pension.depositFeePercent = 3.5;

    const low = scoreRetirementReadiness(lowFees);
    const high = scoreRetirementReadiness(highFees);
    expect(low.score).toBeGreaterThan(high.score);
  });

  it("having keren hishtalmut improves score vs not having one", () => {
    const withKH = makeProfile();
    withKH.pension.kerenHishtalmut = { hasOne: true, balance: 100_000 };

    const withoutKH = makeProfile();
    withoutKH.pension.kerenHishtalmut = { hasOne: false };

    const r1 = scoreRetirementReadiness(withKH);
    const r2 = scoreRetirementReadiness(withoutKH);
    expect(r1.score).toBeGreaterThan(r2.score);
  });

  it("details contain expected fields", () => {
    const result = scoreRetirementReadiness(makeProfile());
    expect(result.details).toHaveProperty("expectedBalance");
    expect(result.details).toHaveProperty("actualBalance");
    expect(result.details).toHaveProperty("yearsToRetirement");
    expect(result.details).toHaveProperty("savingsSubScore");
    expect(result.details).toHaveProperty("feeSubScore");
    expect(result.details).toHaveProperty("allocationSubScore");
  });

  it("female retirement age is 65, male is 67", () => {
    const male = makeProfile();
    male.profile.age = 40;
    male.profile.gender = "male";

    const female = makeProfile();
    female.profile.age = 40;
    female.profile.gender = "female";

    const maleResult = scoreRetirementReadiness(male);
    const femaleResult = scoreRetirementReadiness(female);
    // Female has fewer years to retirement → slightly different years
    expect((maleResult.details.yearsToRetirement as number)).toBe(27);
    expect((femaleResult.details.yearsToRetirement as number)).toBe(25);
  });

  it("savings ratio > 1.3x expected → full savings sub-score", () => {
    const p = makeProfile();
    // force balance to 200x expected to guarantee >1.3 ratio
    p.pension.currentBalance = 50_000_000;
    p.income.monthlyGrossSalary = 10_000;
    const result = scoreRetirementReadiness(p);
    expect(result.details.savingsSubScore as number).toBe(100);
  });
});
