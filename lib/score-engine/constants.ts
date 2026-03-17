// ============================================================
// lib/score-engine/constants.ts — Israeli financial system constants
// ============================================================

// ── Pension Contribution Rates (2025/2026) ──────────────────
export const EMPLOYEE_PENSION_RATE = 0.06; // 6%
export const EMPLOYER_PENSION_RATE = 0.065; // 6.5%
export const EMPLOYER_SEVERANCE_RATE = 0.0833; // 8.33% (Section 14)
export const TOTAL_PENSION_RATE = EMPLOYEE_PENSION_RATE + EMPLOYER_PENSION_RATE; // 12.5%
export const TOTAL_WITH_SEVERANCE = TOTAL_PENSION_RATE + EMPLOYER_SEVERANCE_RATE; // ~20.83%

// ── Retirement Ages ──────────────────────────────────────────
export const RETIREMENT_AGE_MALE = 67;
export const RETIREMENT_AGE_FEMALE = 65;
export const CAREER_START_AGE = 23;

// ── Long-term Assumptions ────────────────────────────────────
export const LONG_TERM_NOMINAL_RETURN = 0.06; // 6% nominal
export const LONG_TERM_REAL_RETURN = 0.04; // ~4% real (after inflation)
export const INFLATION_RATE = 0.025; // 2.5% average
export const PRIME_RATE = 0.06; // Bank of Israel prime (update periodically)

// ── Fee Averages by Fund Type ────────────────────────────────
export const AVG_FEES = {
  keren_pensia: { management: 0.22, deposit: 1.49 },
  bituach_menahalim: { management: 0.72, deposit: 2.0 },
  kupat_gemel: { management: 0.53, deposit: 0.0 },
  not_sure: { management: 0.35, deposit: 1.0 }, // conservative estimate
} as const;

// ── Investment Track Equity Exposure (%) ─────────────────────
export const TRACK_EQUITY_PCT: Record<string, number> = {
  general: 50,
  stocks: 85,
  bonds: 15,
  age_under_50: 65,
  age_50_60: 45,
  age_over_60: 25,
  sp500: 95,
  halacha: 45,
  shekel_cash: 5,
  other: 50,
};

// ── Scoring Weights ──────────────────────────────────────────
export const CATEGORY_WEIGHTS = {
  retirement_readiness: 0.25,
  financial_stability: 0.20,
  wealth_growth: 0.20,
  risk_management: 0.15,
  fee_efficiency: 0.10,
  goal_alignment: 0.10,
} as const;

// ── Insurance Benchmarks ─────────────────────────────────────
export const LIFE_INSURANCE_MULTIPLIER = 10; // 10x annual salary
export const DISABILITY_COVERAGE_PCT = 0.75; // 75% of net salary
export const EMERGENCY_FUND_MONTHS_MIN = 3;
export const EMERGENCY_FUND_MONTHS_RECOMMENDED = 6;
export const EMERGENCY_FUND_MONTHS_WITH_DEPENDENTS = 9;

// ── Expected Pension Balance by Age ──────────────────────────
// Assumes: median salary trajectory, 12.5% contribution, 5% annual return
// These are rough benchmarks — the score engine also calculates dynamically
export const EXPECTED_BALANCE_BY_AGE: Record<number, number> = {
  25: 40_000,
  30: 175_000,
  35: 400_000,
  40: 720_000,
  45: 1_150_000,
  50: 1_700_000,
  55: 2_350_000,
  60: 3_050_000,
  65: 3_800_000,
};

// ── Salary Percentiles by Age (Monthly Gross, NIS) ───────────
// Source: הלמ"ס income data (approximate)
export const MEDIAN_SALARY_BY_AGE: Record<number, number> = {
  25: 9_000,
  30: 12_500,
  35: 15_500,
  40: 17_500,
  45: 19_000,
  50: 19_500,
  55: 19_000,
  60: 17_000,
  65: 14_000,
};

// ── Real Estate Average Price per SQM by City ────────────────
export const REAL_ESTATE_PRICES: Record<string, { avgPricePerSqm: number; annualAppreciation: number }> = {
  "תל אביב": { avgPricePerSqm: 55_000, annualAppreciation: 0.06 },
  "ירושלים": { avgPricePerSqm: 40_000, annualAppreciation: 0.04 },
  "חיפה": { avgPricePerSqm: 22_000, annualAppreciation: 0.05 },
  "באר שבע": { avgPricePerSqm: 18_000, annualAppreciation: 0.07 },
  "נתניה": { avgPricePerSqm: 30_000, annualAppreciation: 0.05 },
  "ראשון לציון": { avgPricePerSqm: 32_000, annualAppreciation: 0.05 },
  "פתח תקווה": { avgPricePerSqm: 28_000, annualAppreciation: 0.05 },
  "הרצליה": { avgPricePerSqm: 45_000, annualAppreciation: 0.05 },
  "רעננה": { avgPricePerSqm: 38_000, annualAppreciation: 0.04 },
  "כפר סבא": { avgPricePerSqm: 28_000, annualAppreciation: 0.04 },
};

// ── Disclaimer ───────────────────────────────────────────────
export const DISCLAIMER_HE = "מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, או המלצה לפעולה כלשהי. לקבלת ייעוץ מותאם אישית, פנה/י ליועץ פנסיוני מורשה.";
export const DISCLAIMER_EN = "General information only. Not financial, investment, or pension advice. Consult a licensed advisor for personalized guidance.";
