// ============================================================
// WealthIQ — Complete Type System
// ============================================================
// This file defines every data structure in the application.
// It is the single source of truth for the questionnaire data model,
// scoring outputs, AI insights, and simulation results.
//
// Place this at: /lib/types/index.ts
// ============================================================

// ────────────────────────────────────────────────────────────
// Section 1: Profile (הפרופיל שלך)
// ────────────────────────────────────────────────────────────

export type Gender = "male" | "female" | "prefer_not_to_say";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type RiskTolerance = "conservative" | "balanced" | "aggressive";

export type FinancialGoal =
  | "early_retirement"
  | "comfortable_retirement"
  | "buy_home"
  | "financial_independence"
  | "children_education"
  | "other";

export interface ProfileSection {
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dependents: number; // number of children/dependents
  city: string;
  riskTolerance: RiskTolerance;
  primaryGoal: FinancialGoal;
  goalDescription?: string; // free text if "other"
  targetRetirementAge: number;
}

// ────────────────────────────────────────────────────────────
// Section 2: Income & Employment (הכנסה ותעסוקה)
// ────────────────────────────────────────────────────────────

export type EmploymentStatus =
  | "employee"
  | "self_employed"
  | "both"
  | "unemployed";

export type AdditionalIncomeType =
  | "freelance"
  | "rental"
  | "dividends"
  | "other";

export interface AdditionalIncome {
  type: AdditionalIncomeType;
  monthlyAmount: number;
}

export interface IncomeSection {
  employmentStatus: EmploymentStatus;
  monthlyGrossSalary: number; // bruto
  monthlyNetSalary?: number; // neto (optional — can be estimated)
  additionalIncome: AdditionalIncome[];
  yearsAtCurrentJob: number;
  industry: string;
}

// ────────────────────────────────────────────────────────────
// Section 3: Pension & Long-term Savings (פנסיה וחסכון ארוך טווח)
// ────────────────────────────────────────────────────────────

export type PensionProductType =
  | "keren_pensia" // קרן פנסיה
  | "bituach_menahalim" // ביטוח מנהלים
  | "kupat_gemel" // קופת גמל
  | "not_sure";

export type InvestmentTrack =
  | "general" // מסלול כללי
  | "stocks" // מסלול מניות
  | "bonds" // מסלול אג"ח
  | "age_under_50" // תלוי גיל עד 50
  | "age_50_60" // תלוי גיל 50-60
  | "age_over_60" // תלוי גיל 60+
  | "sp500" // עוקב S&P 500
  | "halacha" // מסלול הלכתי
  | "shekel_cash" // כספי שקלי
  | "other";

export interface KerenHishtalmut {
  hasOne: boolean;
  balance?: number;
  maturityDate?: string; // ISO date or "already_matured"
}

export interface PensionSection {
  productType: PensionProductType;
  fundName?: string;
  investmentTrack: InvestmentTrack;
  currentBalance: number;
  managementFeePercent: number | null; // null = "I don't know"
  depositFeePercent: number | null; // null = "I don't know"
  kerenHishtalmut: KerenHishtalmut;
  hasOldAccounts: "yes" | "no" | "not_sure";
  oldAccountsEstimate?: number;
  makesVoluntaryContributions: boolean;
  voluntaryMonthlyAmount?: number;
}

// ────────────────────────────────────────────────────────────
// Section 4: Real Estate (נדל"ן)
// ────────────────────────────────────────────────────────────

export type PropertyType = "apartment" | "house" | "land" | "commercial";

export type MortgageTrackType =
  | "prime" // פריים
  | "fixed_unlinked" // קבועה לא צמודה
  | "fixed_cpi_linked" // קבועה צמודה
  | "variable_cpi_5yr" // משתנה צמודה כל 5 שנים
  | "variable_cpi_1yr" // משתנה צמודה כל שנה
  | "variable_unlinked_5yr" // משתנה לא צמודה כל 5 שנים
  | "mixed"; // משולב

export interface MortgageDetails {
  remainingBalance: number;
  monthlyPayment: number;
  interestRate: number; // as decimal, e.g., 0.035 for prime+0.5%
  trackType: MortgageTrackType;
  yearsRemaining: number;
}

export interface Property {
  type: PropertyType;
  city: string;
  neighborhood?: string;
  estimatedValue: number;
  purchaseYear: number;
  purchasePrice: number;
  hasMortgage: boolean;
  mortgage?: MortgageDetails;
  isRented: boolean;
  monthlyRentIncome?: number;
}

export interface RealEstateSection {
  ownsProperty: boolean;
  properties: Property[];
  planningToBuy: boolean;
  targetBudget?: number;
  downPaymentAvailable?: number;
  // Vehicle
  vehicleOwned?: boolean;
  vehicleValue?: number;
  monthlyCarPayment?: number;
  isLeased?: boolean;
}

// ────────────────────────────────────────────────────────────
// Section 5: Investments (השקעות)
// ────────────────────────────────────────────────────────────

export type BrokeragePlatform =
  | "ibi"
  | "meitav_dash"
  | "poalim"
  | "leumi"
  | "interactive_brokers"
  | "etoro"
  | "other";

export interface PortfolioAllocation {
  israeliStocks: number; // percentage as decimal
  internationalStocks: number;
  bonds: number;
  etfsIndexFunds: number;
  other: number;
  // Must sum to 1.0
}

export interface BrokerageAccount {
  platform: BrokeragePlatform;
  totalValue: number;
  allocation: PortfolioAllocation;
  annualFeePercent: number;
}

export type CryptoHolding =
  | "btc"
  | "eth"
  | "stablecoins"
  | "altcoins"
  | "other";

export interface CryptoInvestment {
  totalValue: number;
  holdings: CryptoHolding[];
}

export type OtherInvestmentType =
  | "private_equity"
  | "crowdfunding"
  | "p2p_lending"
  | "commodities"
  | "other";

export interface OtherInvestment {
  type: OtherInvestmentType;
  totalValue: number;
}

export interface InvestmentsSection {
  hasBrokerage: boolean;
  brokerageAccount?: BrokerageAccount;
  hasCrypto: boolean;
  crypto?: CryptoInvestment;
  hasOtherInvestments: boolean;
  otherInvestments: OtherInvestment[];
}

// ────────────────────────────────────────────────────────────
// Section 6: Savings & Emergency Fund (חסכונות וקרן חירום)
// ────────────────────────────────────────────────────────────

export interface SavingsSection {
  liquidSavings: number; // checking + savings accounts
  hasEmergencyFund: "yes" | "no" | "savings_is_emergency";
  emergencyFundAmount?: number;
  hasFixedDeposits: boolean; // פקדונות
  fixedDepositsAmount?: number;
  fixedDepositsRate?: number; // average interest rate
  hasSavingsPlans: boolean; // תוכניות חיסכון
  savingsPlansAmount?: number;
  savingsPlansMaturity?: string; // ISO date
  hasChildSavings: boolean; // חיסכון לכל ילד
  childSavingsBalance?: number;
}

// ────────────────────────────────────────────────────────────
// Section 7: Debt & Loans (חובות והלוואות)
// ────────────────────────────────────────────────────────────

export type LoanType =
  | "personal"
  | "car"
  | "education"
  | "credit_line"
  | "other";

export interface Loan {
  type: LoanType;
  remainingBalance: number;
  monthlyPayment: number;
  interestRate: number; // as decimal
  monthsRemaining: number;
}

export interface DebtSection {
  hasLoans: boolean;
  loans: Loan[];
  creditCardDebt: number; // 0 if paid in full monthly
  totalMonthlyObligations: number; // auto-calculated, editable
}

// ────────────────────────────────────────────────────────────
// Section 8: Insurance & Protection (ביטוח והגנה)
// ────────────────────────────────────────────────────────────

export interface InsuranceSection {
  hasLifeInsurance: "yes" | "no" | "through_pension";
  lifeCoverageAmount?: number;
  hasDisabilityInsurance: "yes" | "no" | "through_pension";
  disabilityMonthlyCoverage?: number;
  hasPrivateHealthInsurance: boolean; // beyond קופת חולים
  hasPropertyInsurance: boolean;
  hasWill: boolean;
}

// ────────────────────────────────────────────────────────────
// Section 9: Monthly Cash Flow (תזרים חודשי)
// ────────────────────────────────────────────────────────────

export interface ExpenseBreakdown {
  housing: number;       // rent or mortgage (auto-filled from Section 4 if available)
  utilities: number;     // electricity, water, gas, internet
  food: number;          // groceries & food
  transportation: number; // fuel, public transit, parking
  insurance: number;     // insurance premiums (auto-filled from Section 8 if available)
  childcare: number;     // childcare & education
  entertainment: number; // entertainment & dining out
  subscriptions: number; // subscriptions & memberships
  other: number;
}

export type BudgetDiscipline = "strict" | "loose" | "none";

export interface CashFlowSection {
  monthlyExpenses: number; // total, or sum of breakdown
  expenseBreakdown?: ExpenseBreakdown;
  monthlySavingsAmount: number;
  budgetDiscipline: BudgetDiscipline;
}

// ────────────────────────────────────────────────────────────
// Complete Financial Profile
// ────────────────────────────────────────────────────────────

export interface FinancialProfile {
  profile: ProfileSection;
  income: IncomeSection;
  pension: PensionSection;
  realEstate: RealEstateSection;
  investments: InvestmentsSection;
  savings: SavingsSection;
  debt: DebtSection;
  insurance: InsuranceSection;
  cashFlow: CashFlowSection;
  completedAt: string; // ISO timestamp
}

// ────────────────────────────────────────────────────────────
// Scoring Types
// ────────────────────────────────────────────────────────────

export type ScoreCategory =
  | "retirement_readiness"
  | "financial_stability"
  | "wealth_growth"
  | "risk_management"
  | "fee_efficiency"
  | "goal_alignment";

export type ScoreGrade =
  | "A+" // 90-100
  | "A" // 80-89
  | "B+" // 70-79
  | "B" // 60-69
  | "C" // 50-59
  | "D" // 40-49
  | "F"; // 0-39

export interface CategoryScore {
  category: ScoreCategory;
  categoryNameHe: string;
  score: number; // 0-100
  weight: number; // decimal, e.g., 0.25
  grade: ScoreGrade;
  details: Record<string, unknown>; // category-specific breakdown
}

export interface BonusPenalty {
  id: string;
  descriptionHe: string;
  points: number; // positive = bonus, negative = penalty
  applied: boolean;
  reason: string;
}

export interface WealthIQResult {
  totalScore: number; // 0-100
  grade: ScoreGrade;
  gradeHe: string;
  percentileEstimate: number; // estimated percentile vs. age cohort (1-99)
  categoryScores: CategoryScore[];
  bonusesPenalties: BonusPenalty[];
  netWorth: NetWorthSummary;
  insightsContext: InsightsContext; // sent to AI for insight generation
  disclaimer: string;
}

export interface NetWorthSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetBreakdown: {
    pension: number;
    kerenHishtalmut: number;
    realEstate: number;
    investments: number;
    crypto: number;
    savings: number;
    otherAssets: number;
  };
  liabilityBreakdown: {
    mortgages: number;
    loans: number;
    creditCardDebt: number;
  };
}

// ────────────────────────────────────────────────────────────
// AI Insights Types
// ────────────────────────────────────────────────────────────

export type InsightCategory =
  | "pension"
  | "real_estate"
  | "investments"
  | "savings"
  | "debt"
  | "insurance"
  | "cross_asset"
  | "cash_flow";

export type InsightImpact = "high" | "medium" | "low";

export interface Insight {
  id: string;
  titleHe: string;
  bodyHe: string;
  category: InsightCategory;
  impact: InsightImpact;
  estimatedScoreImpact: string; // e.g., "+5 to +10 points"
  icon: string; // emoji or icon name
}

export interface InsightsContext {
  // All the data the AI needs to generate insights
  age: number;
  salary: number;
  totalNetWorth: number;
  pensionBalance: number;
  pensionExpectedRatio: number;
  pensionFeeRatio: number;
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  largestAssetClass: string;
  largestAssetPct: number;
  hasDisabilityInsurance: boolean;
  hasDependents: boolean;
  hasWill: boolean;
  cryptoPctOfPortfolio: number;
  monthlyNetCashFlow: number;
  savingsRate: number;
  retirementReadinessScore: number;
  financialStabilityScore: number;
  yearsToRetirement: number;
  totalScore: number;
  grade: ScoreGrade;
  percentile: number;
  riskTolerance: RiskTolerance;
  primaryGoal: FinancialGoal;
  mortgageRate?: number;
  savingsAccountRate?: number;
  investmentFees?: number;
  realEstateConcentration: number; // % of net worth in real estate
  currencyDiversification: number; // % in non-NIS assets
  monthlyCarPayment?: number;
  expenseBreakdown?: Partial<ExpenseBreakdown>;
}

// ────────────────────────────────────────────────────────────
// Simulation / What-If Types
// ────────────────────────────────────────────────────────────

export type ScenarioType =
  | "increase_pension_contribution"
  | "change_retirement_age"
  | "sell_property"
  | "pay_off_loan"
  | "reallocate_savings"
  | "reduce_fees"
  | "change_inflation"
  | "salary_growth"
  | "buy_property";

export interface ScenarioModification {
  type: ScenarioType;
  value: number; // meaning depends on type
  label: string; // human-readable description
}

export interface TimeseriesPoint {
  year: number;
  age: number;
  netWorth: number;
  pensionBalance: number;
  investmentValue: number;
  realEstateEquity: number;
  totalDebt: number;
  monthlyPassiveIncome: number;
}

export interface ProjectionResult {
  baseline: TimeseriesPoint[];
  modified: TimeseriesPoint[];
  summary: {
    retirementAgeBaseline: number;
    retirementAgeModified: number;
    netWorthAtRetirementBaseline: number;
    netWorthAtRetirementModified: number;
    monthlyPassiveIncomeBaseline: number;
    monthlyPassiveIncomeModified: number;
    totalFeesSavedBaseline: number;
    totalFeesSavedModified: number;
    scoreImpact: number; // change in WealthIQ score
  };
}

// ────────────────────────────────────────────────────────────
// API Types
// ────────────────────────────────────────────────────────────

export interface ScoreRequest {
  profile: FinancialProfile;
}

export interface ScoreResponse {
  success: boolean;
  result?: WealthIQResult;
  error?: string;
}

export interface InsightsRequest {
  context: InsightsContext;
}

export interface InsightsResponse {
  success: boolean;
  insights?: Insight[];
  error?: string;
}

export interface SimulationRequest {
  profile: FinancialProfile;
  scenarios: ScenarioModification[];
  horizonYears: number; // 5, 10, 20, or 30
}

export interface SimulationResponse {
  success: boolean;
  result?: ProjectionResult;
  error?: string;
}

// ────────────────────────────────────────────────────────────
// Questionnaire UI Types
// ────────────────────────────────────────────────────────────

export type QuestionnaireStep =
  | "profile"
  | "income"
  | "pension"
  | "real_estate"
  | "investments"
  | "savings"
  | "debt"
  | "insurance"
  | "cash_flow";

export const QUESTIONNAIRE_STEPS: QuestionnaireStep[] = [
  "profile",
  "income",
  "pension",
  "real_estate",
  "investments",
  "savings",
  "debt",
  "insurance",
  "cash_flow",
];

export const STEP_NAMES_HE: Record<QuestionnaireStep, string> = {
  profile: "הפרופיל שלך",
  income: "הכנסה ותעסוקה",
  pension: "פנסיה וחסכון ארוך טווח",
  real_estate: "נדל״ן",
  investments: "השקעות",
  savings: "חסכונות וקרן חירום",
  debt: "חובות והלוואות",
  insurance: "ביטוח והגנה",
  cash_flow: "תזרים חודשי",
};

export const STEP_ICONS: Record<QuestionnaireStep, string> = {
  profile: "👤",
  income: "💰",
  pension: "🏦",
  real_estate: "🏠",
  investments: "📈",
  savings: "🏧",
  debt: "💳",
  insurance: "🛡️",
  cash_flow: "📊",
};

export interface QuestionnaireState {
  currentStep: QuestionnaireStep;
  completedSteps: QuestionnaireStep[];
  data: Partial<FinancialProfile>;
  isSubmitting: boolean;
  error: string | null;
}
