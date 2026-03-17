/**
 * Deep Insights Generator
 * DETERMINISTIC TypeScript only — no AI, no randomness, no side effects.
 * Takes FinancialProfile + WealthIQResult → returns DeepInsight[]
 */

import type { FinancialProfile, WealthIQResult, DeepInsight, ScoreGrade } from "@/lib/types";

// ── Benchmark averages by age bracket ────────────────────────
const BENCHMARKS: Record<string, Record<string, number>> = {
  "20-29": { retirement: 45, stability: 55, growth: 50, risk: 60, fees: 65, goals: 50 },
  "30-39": { retirement: 55, stability: 60, growth: 58, risk: 58, fees: 60, goals: 55 },
  "40-49": { retirement: 62, stability: 65, growth: 62, risk: 55, fees: 55, goals: 60 },
  "50-59": { retirement: 68, stability: 68, growth: 58, risk: 52, fees: 50, goals: 65 },
  "60+":   { retirement: 72, stability: 70, growth: 52, risk: 50, fees: 48, goals: 70 },
};

function getAgeBracket(age: number): string {
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
}

function calcPercentile(score: number, avg: number): number {
  if (score >= avg) {
    return 50 + ((score - avg) / (100 - avg)) * 50;
  }
  return (score / avg) * 50;
}

function getBenchmarkLabel(percentile: number): string {
  if (percentile >= 80) return "Top 20%";
  if (percentile >= 65) return "Above average";
  if (percentile >= 45) return "Average";
  if (percentile >= 25) return "Below average";
  return "Needs improvement";
}

function gradeFromScore(score: number): ScoreGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

// ── Formatters ────────────────────────────────────────────────
const fmt = (n: number) =>
  "₪" + Math.round(n).toLocaleString("en-US").replace(/,/g, ",");
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const pctRaw = (n: number) => `${n.toFixed(1)}%`;

// ── Category generators ────────────────────────────────────────

function buildRetirement(
  profile: FinancialProfile,
  score: number,
  avg: number,
  percentile: number
): Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade"> {
  const ctx = profile.pension;
  const age = profile.profile.age;
  const retireAge = profile.profile.targetRetirementAge;
  const yearsLeft = Math.max(0, retireAge - age);
  const balance = ctx.currentBalance ?? 0;
  const fee = ctx.managementFeePercent ?? 0;

  const aboveAvg = score >= avg;

  const analysis = aboveAvg
    ? `Your retirement readiness score of ${Math.round(score)} ranks in the top ${Math.round(100 - percentile)}% for your age group. ` +
      `Your pension balance of ${fmt(balance)} reflects disciplined, long-term saving. ` +
      (fee > 0.5
        ? `Your management fee of ${pctRaw(fee)}% is worth reviewing — even a 0.3% reduction compounds to a significant sum over ${yearsLeft} years. `
        : `Your management fee of ${pctRaw(fee)}% is competitive. `) +
      `With ${yearsLeft} years to your target retirement age, continued contributions will further strengthen this foundation.`
    : `Your retirement readiness score of ${Math.round(score)} is below the age-group average of ${avg}. ` +
      `Your current pension balance of ${fmt(balance)} has room to grow. ` +
      (fee > 0.5
        ? `A management fee of ${pctRaw(fee)}% is higher than typical benchmarks (0.1–0.3%) — reducing it can meaningfully improve long-term outcomes. `
        : "") +
      `With ${yearsLeft} years ahead, consistent contributions and investment track selection will close the gap significantly.`;

  const actions: string[] = [];
  if (fee > 0.5) actions.push(`Review your pension management fee (currently ${pctRaw(fee)}%) and compare with lower-cost track options`);
  if (!ctx.makesVoluntaryContributions) actions.push("Consider voluntary (Hibur) pension contributions to accelerate tax-advantaged savings");
  if (balance < 100_000 && yearsLeft > 10) actions.push("Increase monthly pension contribution — even ₪200 extra per month grows substantially over time");
  if (actions.length === 0) actions.push("Maintain current contribution schedule and review your investment track allocation annually");

  return {
    title: "מוכנות לפרישה",
    analysis,
    actions: actions.slice(0, 3),
    relatedMetrics: [
      { label: "יתרת פנסיה", value: fmt(balance), trend: balance > 200_000 ? "positive" : balance > 50_000 ? "neutral" : "negative" },
      { label: "דמי ניהול", value: `${pctRaw(fee)}%`, trend: fee <= 0.3 ? "positive" : fee <= 0.6 ? "neutral" : "negative" },
      { label: "שנים לפרישה", value: `${yearsLeft}`, trend: yearsLeft > 20 ? "positive" : yearsLeft > 10 ? "neutral" : "negative" },
    ],
  };
}

function buildStability(
  profile: FinancialProfile,
  result: WealthIQResult,
  score: number,
  avg: number,
  percentile: number
): Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade"> {
  const ctx = result.insightsContext;
  const efMonths = ctx.emergencyFundMonths;
  const dti = ctx.debtToIncomeRatio;
  const hasDeps = ctx.hasDependents;
  const aboveAvg = score >= avg;
  const targetMonths = hasDeps ? 9 : 6;

  const analysis = aboveAvg
    ? `Your financial stability score of ${Math.round(score)} is above the average of ${avg} for your age group. ` +
      `Your emergency fund covers ${efMonths.toFixed(1)} months of expenses, providing a solid safety net. ` +
      `Your debt-to-income ratio of ${pct(dti)} is ${dti < 0.35 ? "within" : "above"} the recommended range. ` +
      `Overall your cash flow management supports a stable financial foundation.`
    : `Your financial stability score of ${Math.round(score)} is below the average of ${avg} for your age group. ` +
      `Your emergency fund covers ${efMonths.toFixed(1)} months — the recommended minimum is ${targetMonths} months${hasDeps ? " with dependents" : ""}. ` +
      (dti > 0.35
        ? `Your debt-to-income ratio of ${pct(dti)} is above the recommended 35% ceiling, which limits your financial flexibility. `
        : "") +
      `Building resilience in this area creates the foundation for all other financial goals.`;

  const actions: string[] = [];
  if (efMonths < targetMonths) {
    const gapMonths = Math.ceil(targetMonths - efMonths);
    actions.push(`Build emergency fund to ${targetMonths} months of expenses — you currently have ${efMonths.toFixed(1)} months (${gapMonths} months to go)`);
  }
  if (dti > 0.35) actions.push(`Prioritize paying off high-interest debt — your DTI of ${pct(dti)} limits savings and investment capacity`);
  if (ctx.savingsRate < 0.1) actions.push(`Increase savings rate — aim for 20% of net income; current rate is ${pct(ctx.savingsRate)}`);
  if (actions.length === 0) actions.push("Maintain your emergency fund and review debt levels annually");

  return {
    title: "יציבות פיננסית",
    analysis,
    actions: actions.slice(0, 3),
    relatedMetrics: [
      { label: "קרן חירום", value: `${efMonths.toFixed(1)} חודשים`, trend: efMonths >= targetMonths ? "positive" : efMonths >= 3 ? "neutral" : "negative" },
      { label: "יחס חוב/הכנסה", value: pct(dti), trend: dti <= 0.2 ? "positive" : dti <= 0.35 ? "neutral" : "negative" },
      { label: "שיעור חיסכון", value: pct(ctx.savingsRate), trend: ctx.savingsRate >= 0.2 ? "positive" : ctx.savingsRate >= 0.1 ? "neutral" : "negative" },
    ],
  };
}

function buildGrowth(
  profile: FinancialProfile,
  result: WealthIQResult,
  score: number,
  avg: number,
  percentile: number
): Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade"> {
  const ctx = result.insightsContext;
  const nw = result.netWorth;
  const aboveAvg = score >= avg;
  const rePct = ctx.realEstateConcentration;
  const cryptoPct = ctx.cryptoPctOfPortfolio;

  const analysis = aboveAvg
    ? `Your wealth growth score of ${Math.round(score)} is above the average of ${avg} for your age group. ` +
      `Your current net worth of ${fmt(nw.netWorth)} reflects strong asset accumulation. ` +
      (rePct > 0.6
        ? `Real estate represents ${pct(rePct)} of your portfolio — diversifying into liquid assets can improve resilience. `
        : `Your asset allocation appears reasonably diversified. `) +
      "Continuing to invest consistently will compound your wealth over time."
    : `Your wealth growth score of ${Math.round(score)} is below the average of ${avg} for your age group. ` +
      `Building net worth requires consistent saving and investing across multiple asset classes. ` +
      (rePct > 0.6
        ? `With ${pct(rePct)} of assets concentrated in real estate, consider gradually diversifying into liquid investments. `
        : "") +
      (cryptoPct > 0.1
        ? `Crypto represents ${pct(cryptoPct)} of your portfolio — this concentration adds significant volatility risk. `
        : "") +
      "Focusing on diversified long-term investing will steadily improve this score.";

  const actions: string[] = [];
  if (!profile.investments.hasBrokerage) actions.push("Consider opening a brokerage account for long-term diversified index investing");
  if (rePct > 0.6) actions.push(`Real estate is ${pct(rePct)} of your net worth — consider gradually building a liquid investment portfolio`);
  if (cryptoPct > 0.15) actions.push(`Crypto is ${pct(cryptoPct)} of your portfolio — consider rebalancing to reduce concentration risk`);
  if (actions.length === 0) actions.push("Review asset allocation annually and consider increasing investment contributions with salary growth");

  return {
    title: "צמיחת עושר",
    analysis,
    actions: actions.slice(0, 3),
    relatedMetrics: [
      { label: "שווי נטו", value: fmt(nw.netWorth), trend: nw.netWorth > 500_000 ? "positive" : nw.netWorth > 100_000 ? "neutral" : "negative" },
      { label: "ריכוז נדל״ן", value: pct(rePct), trend: rePct <= 0.5 ? "positive" : rePct <= 0.7 ? "neutral" : "negative" },
      { label: "נכסי השקעה", value: fmt(nw.assetBreakdown.investments), trend: nw.assetBreakdown.investments > 50_000 ? "positive" : "neutral" },
    ],
  };
}

function buildRisk(
  profile: FinancialProfile,
  result: WealthIQResult,
  score: number,
  avg: number
): Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade"> {
  const ctx = result.insightsContext;
  const ins = profile.insurance;
  const aboveAvg = score >= avg;

  const analysis = aboveAvg
    ? `Your risk management score of ${Math.round(score)} demonstrates strong protective coverage for your financial situation. ` +
      (ins.hasDisabilityInsurance !== "no" ? "Having disability insurance provides important income protection. " : "") +
      (ins.hasWill ? "A will in place ensures your assets are protected for your family. " : "") +
      "Maintaining adequate insurance coverage is one of the highest-value steps in personal finance."
    : `Your risk management score of ${Math.round(score)} is below the average of ${avg} for your age group. ` +
      (ins.hasDisabilityInsurance === "no" && ctx.hasDependents
        ? "Without disability insurance and with dependents, your family's financial security is vulnerable. "
        : ins.hasDisabilityInsurance === "no"
        ? "Disability insurance protects your most valuable asset — your income earning ability. "
        : "") +
      (!ins.hasWill && ctx.hasDependents ? "A will is one of the most impactful documents you can create to protect your family. " : "") +
      "Addressing coverage gaps can meaningfully improve your financial resilience.";

  const actions: string[] = [];
  if (ins.hasDisabilityInsurance === "no") {
    actions.push(ctx.hasDependents
      ? "Obtain disability insurance — with dependents, income protection is critical"
      : "Review disability insurance options — your pension may include some coverage worth checking"
    );
  }
  if (!ins.hasWill && ctx.hasDependents) actions.push("Create a will — especially important with dependents to protect their financial future");
  if (!ins.hasLifeInsurance || ins.hasLifeInsurance === "no") actions.push("Verify life insurance coverage matches your current income and family obligations");
  if (actions.length === 0) actions.push("Review all insurance policies annually to ensure coverage matches your evolving life circumstances");

  return {
    title: "ניהול סיכונים",
    analysis,
    actions: actions.slice(0, 3),
    relatedMetrics: [
      { label: "ביטוח נכות", value: ins.hasDisabilityInsurance !== "no" ? "יש ✓" : "אין ✗", trend: ins.hasDisabilityInsurance !== "no" ? "positive" : "negative" },
      { label: "צוואה", value: ins.hasWill ? "יש ✓" : "אין ✗", trend: ins.hasWill ? "positive" : ctx.hasDependents ? "negative" : "neutral" },
      { label: "ביטוח בריאות פרטי", value: ins.hasPrivateHealthInsurance ? "יש ✓" : "אין ✗", trend: ins.hasPrivateHealthInsurance ? "positive" : "neutral" },
    ],
  };
}

function buildFees(
  profile: FinancialProfile,
  result: WealthIQResult,
  score: number,
  avg: number
): Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade"> {
  const pension = profile.pension;
  const ctx = result.insightsContext;
  const fee = pension.managementFeePercent ?? 0;
  const aboveAvg = score >= avg;
  const balance = pension.currentBalance ?? 0;
  const age = profile.profile.age;
  const retireAge = profile.profile.targetRetirementAge;
  const years = Math.max(0, retireAge - age);

  // Rough fee drag estimate over time
  const annualFeeDrag = balance * (fee / 100);

  const analysis = aboveAvg
    ? `Your fee efficiency score of ${Math.round(score)} is above average — you are keeping a good share of your investment returns. ` +
      (fee <= 0.3
        ? `Your pension management fee of ${pctRaw(fee)}% is well within competitive range. `
        : `Your pension management fee of ${pctRaw(fee)}% has room for improvement. `) +
      "Fee efficiency is a silent multiplier — every fraction of a percent saved compounds over decades. " +
      "Regular review of all product fees is a simple but high-impact habit."
    : `Your fee efficiency score of ${Math.round(score)} suggests fees are eroding meaningful returns. ` +
      `Your pension management fee of ${pctRaw(fee)}% is higher than the typical benchmark range of 0.1–0.3%. ` +
      `On a balance of ${fmt(balance)}, this represents approximately ${fmt(annualFeeDrag)} per year in direct costs. ` +
      `Over ${years} years, reducing fees could add significantly to your retirement outcome.`;

  const actions: string[] = [];
  if (fee > 0.5) actions.push(`Review pension management fee (${pctRaw(fee)}%) — benchmark for managed tracks is 0.2–0.4%, and index tracks often offer 0.1–0.2%`);
  if (ctx.investmentFees && ctx.investmentFees > 0.005) actions.push("Review investment product fees — low-cost index funds typically offer market returns at minimal cost");
  actions.push("Request a fee breakdown from all financial product providers annually — fees are often negotiable");

  return {
    title: "יעילות עמלות",
    analysis,
    actions: actions.slice(0, 3),
    relatedMetrics: [
      { label: "דמי ניהול פנסיה", value: `${pctRaw(fee)}%`, trend: fee <= 0.3 ? "positive" : fee <= 0.6 ? "neutral" : "negative" },
      { label: "עלות שנתית משוערת", value: fmt(annualFeeDrag), trend: annualFeeDrag < 500 ? "positive" : annualFeeDrag < 2000 ? "neutral" : "negative" },
      { label: "יתרת פנסיה", value: fmt(balance), trend: "neutral" },
    ],
  };
}

function buildGoals(
  profile: FinancialProfile,
  result: WealthIQResult,
  score: number,
  avg: number
): Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade"> {
  const ctx = result.insightsContext;
  const goal = profile.profile.primaryGoal;
  const retireAge = profile.profile.targetRetirementAge;
  const yearsLeft = ctx.yearsToRetirement;
  const aboveAvg = score >= avg;

  const goalNames: Record<string, string> = {
    early_retirement: "early retirement",
    comfortable_retirement: "comfortable retirement",
    buy_home: "buying a home",
    financial_independence: "financial independence",
    children_education: "children's education",
    other: "your financial goal",
  };

  const analysis = aboveAvg
    ? `Your goal alignment score of ${Math.round(score)} shows your current financial trajectory is well-aligned with ${goalNames[goal] ?? goalNames.other}. ` +
      `With ${yearsLeft} years to your target retirement age of ${retireAge}, your overall score of ${result.totalScore}/100 supports this timeline. ` +
      "Maintaining this trajectory and adjusting annually for life changes will keep you on track. " +
      "The most important factor is consistency — small, regular actions compound powerfully over time."
    : `Your goal alignment score of ${Math.round(score)} is below the average of ${avg} for your age group, suggesting a gap between your current trajectory and ${goalNames[goal] ?? goalNames.other}. ` +
      `With ${yearsLeft} years to your target retirement age of ${retireAge}, action now will have a disproportionate impact. ` +
      "Review which specific category scores are weakest — those represent the highest-leverage improvement areas. " +
      "Consider revising your retirement timeline if needed, or identifying specific monthly contribution increases.";

  const actions: string[] = [];
  if (goal === "early_retirement") actions.push(`To retire at ${retireAge}, model required savings rate using a financial planning tool — current trajectory may need adjustment`);
  if (goal === "buy_home") actions.push("Track down payment progress separately — aim for 20-25% of target property value to avoid mandatory mortgage insurance");
  if (ctx.savingsRate < 0.15) actions.push(`Increase monthly savings rate — current ${pct(ctx.savingsRate)} is below the 20% benchmark for strong goal alignment`);
  if (actions.length < 2) actions.push("Review your WealthIQ score every 6 months and track which categories are improving");

  return {
    title: "התאמה ליעדים",
    analysis,
    actions: actions.slice(0, 3),
    relatedMetrics: [
      { label: "ציון כולל", value: `${result.totalScore}/100`, trend: result.totalScore >= 70 ? "positive" : result.totalScore >= 50 ? "neutral" : "negative" },
      { label: "שנים לפרישה", value: `${yearsLeft}`, trend: yearsLeft > 20 ? "positive" : yearsLeft > 10 ? "neutral" : "negative" },
      { label: "שיעור חיסכון", value: pct(ctx.savingsRate), trend: ctx.savingsRate >= 0.2 ? "positive" : ctx.savingsRate >= 0.1 ? "neutral" : "negative" },
    ],
  };
}

// ── Main export ───────────────────────────────────────────────

export function generateDeepInsights(
  profile: FinancialProfile,
  result: WealthIQResult
): DeepInsight[] {
  const age = profile.profile.age;
  const bracket = getAgeBracket(age);
  const benchmarks = BENCHMARKS[bracket];

  // Build score map from categoryScores
  const scoreMap: Record<string, number> = {};
  for (const cs of result.categoryScores) {
    if (cs.category === "retirement_readiness") scoreMap.retirement = cs.score;
    else if (cs.category === "financial_stability") scoreMap.stability = cs.score;
    else if (cs.category === "wealth_growth") scoreMap.growth = cs.score;
    else if (cs.category === "risk_management") scoreMap.risk = cs.score;
    else if (cs.category === "fee_efficiency") scoreMap.fees = cs.score;
    else if (cs.category === "goal_alignment") scoreMap.goals = cs.score;
  }

  const cats = ["retirement", "stability", "growth", "risk", "fees", "goals"] as const;

  return cats.map((cat, i) => {
    const score = scoreMap[cat] ?? 50;
    const avg = benchmarks[cat];
    const percentile = calcPercentile(score, avg);
    const grade = gradeFromScore(score);

    const benchmark = {
      average: avg,
      percentile: Math.round(percentile),
      label: getBenchmarkLabel(percentile),
    };

    let partial: Omit<DeepInsight, "id" | "category" | "benchmark" | "score" | "grade">;

    if (cat === "retirement") partial = buildRetirement(profile, score, avg, percentile);
    else if (cat === "stability") partial = buildStability(profile, result, score, avg, percentile);
    else if (cat === "growth") partial = buildGrowth(profile, result, score, avg, percentile);
    else if (cat === "risk") partial = buildRisk(profile, result, score, avg);
    else if (cat === "fees") partial = buildFees(profile, result, score, avg);
    else partial = buildGoals(profile, result, score, avg);

    return {
      id: `deep-${cat}-${i}`,
      category: cat,
      score: Math.round(score),
      grade,
      benchmark,
      ...partial,
    };
  });
}
