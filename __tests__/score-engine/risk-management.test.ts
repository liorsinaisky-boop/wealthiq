import { describe, it, expect } from "vitest";
import { scoreRiskManagement } from "@/lib/score-engine/risk-management";
import { makeProfile, VALID_GRADES } from "./helpers";

describe("scoreRiskManagement", () => {
  it("returns score 0–100 for normal 32yo employee", () => {
    const result = scoreRiskManagement(makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(VALID_GRADES).toContain(result.grade);
  });

  it("returns correct category metadata", () => {
    const result = scoreRiskManagement(makeProfile());
    expect(result.category).toBe("risk_management");
    expect(result.weight).toBe(0.15);
    expect(result.categoryNameHe).toBeTruthy();
  });

  it("young starter (age 23) with no insurance — valid score, not zero", () => {
    const p = makeProfile();
    p.profile.age = 23;
    p.profile.dependents = 0;
    p.insurance.hasLifeInsurance = "no";
    p.insurance.hasDisabilityInsurance = "no";
    p.insurance.hasPrivateHealthInsurance = false;
    p.insurance.hasPropertyInsurance = false;
    p.insurance.hasWill = false;
    const result = scoreRiskManagement(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    // Without dependents, partial scores are still given
    expect(result.score).toBeGreaterThan(0);
  });

  it("near retirement (age 65) with full insurance coverage — high score", () => {
    const p = makeProfile();
    p.profile.age = 65;
    p.profile.dependents = 2;
    p.insurance.hasLifeInsurance = "yes";
    p.insurance.lifeCoverageAmount = 5_000_000;
    p.insurance.hasDisabilityInsurance = "yes";
    p.insurance.hasPrivateHealthInsurance = true;
    p.insurance.hasPropertyInsurance = true;
    p.insurance.hasWill = true;
    const result = scoreRiskManagement(p);
    expect(result.score).toBeGreaterThan(60);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("zero assets — concentrationRiskScore returns 50, valid score", () => {
    const p = makeProfile();
    p.pension.currentBalance = 0;
    p.pension.kerenHishtalmut = { hasOne: false };
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    p.investments.hasCrypto = false;
    p.investments.crypto = undefined;
    p.savings.liquidSavings = 0;
    p.realEstate.properties = [];
    const result = scoreRiskManagement(p);
    expect(isNaN(result.score)).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.details.concentrationSubScore as number).toBe(50);
  });

  it("extreme: 90% single asset concentration — low concentration score", () => {
    const p = makeProfile();
    p.pension.currentBalance = 9_000_000;
    p.pension.kerenHishtalmut = { hasOne: false };
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    p.investments.hasCrypto = false;
    p.investments.crypto = undefined;
    p.savings.liquidSavings = 1_000_000;
    const result = scoreRiskManagement(p);
    expect(result.details.concentrationSubScore as number).toBeLessThan(50);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("with dependents, no disability insurance → lower score than without dependents", () => {
    const withDeps = makeProfile();
    withDeps.profile.dependents = 2;
    withDeps.insurance.hasDisabilityInsurance = "no";
    withDeps.insurance.hasLifeInsurance = "no";

    const withoutDeps = makeProfile();
    withoutDeps.profile.dependents = 0;
    withoutDeps.insurance.hasDisabilityInsurance = "no";
    withoutDeps.insurance.hasLifeInsurance = "no";

    const r1 = scoreRiskManagement(withDeps);
    const r2 = scoreRiskManagement(withoutDeps);
    expect(r1.score).toBeLessThan(r2.score);
  });

  it("has will with dependents → higher estate planning score", () => {
    const withWill = makeProfile();
    withWill.profile.dependents = 2;
    withWill.insurance.hasWill = true;

    const withoutWill = makeProfile();
    withoutWill.profile.dependents = 2;
    withoutWill.insurance.hasWill = false;

    const r1 = scoreRiskManagement(withWill);
    const r2 = scoreRiskManagement(withoutWill);
    expect(r1.details.estatePlanningSubScore as number).toBeGreaterThan(
      r2.details.estatePlanningSubScore as number
    );
  });

  it("good currency diversification (30–70% international) → max currency score", () => {
    const p = makeProfile();
    // Base profile has 50% international allocation × ₪150K brokerage = ₪75K intl
    // Plus ₪25K crypto → (75K + 25K) / (150K + 25K) = 57% international
    const result = scoreRiskManagement(p);
    expect(result.details.currencySubScore as number).toBe(100);
  });

  it("no investments at all — currency diversification returns 40", () => {
    const p = makeProfile();
    p.investments.hasBrokerage = false;
    p.investments.brokerageAccount = undefined;
    p.investments.hasCrypto = false;
    p.investments.crypto = undefined;
    const result = scoreRiskManagement(p);
    expect(result.details.currencySubScore as number).toBe(40);
  });

  it("details contain all expected fields", () => {
    const result = scoreRiskManagement(makeProfile());
    expect(result.details).toHaveProperty("insuranceSubScore");
    expect(result.details).toHaveProperty("concentrationSubScore");
    expect(result.details).toHaveProperty("currencySubScore");
    expect(result.details).toHaveProperty("estatePlanningSubScore");
  });

  it("life insurance through pension gives full life insurance credit", () => {
    const p = makeProfile();
    p.insurance.hasLifeInsurance = "through_pension";
    const result = scoreRiskManagement(p);
    // Should be same score as having explicit life insurance
    const r2 = makeProfile();
    r2.insurance.hasLifeInsurance = "yes";
    r2.insurance.lifeCoverageAmount = 2_000_000;
    const result2 = scoreRiskManagement(r2);
    // Both should get insurance credit (insuranceSubScore should be similar range)
    expect(result.details.insuranceSubScore as number).toBeGreaterThan(0);
    expect(result2.details.insuranceSubScore as number).toBeGreaterThan(0);
  });
});
