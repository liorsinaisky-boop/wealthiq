import { NextRequest, NextResponse } from "next/server";
import type { SimulationRequest, SimulationResponse, TimeseriesPoint } from "@/lib/types";
import { projectNetWorth } from "@/lib/utils/calculations";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SimulationRequest;

    if (!body.profile || !body.scenarios) {
      return NextResponse.json<SimulationResponse>(
        { success: false, error: "Missing profile or scenarios" },
        { status: 400 }
      );
    }

    const { profile, scenarios, horizonYears = 30 } = body;
    const { profile: user, income, pension, investments, cashFlow, savings, realEstate, debt } = profile;

    const netSalary = income.monthlyNetSalary ?? income.monthlyGrossSalary * 0.65;
    const retAge = user.gender === "male" ? 67 : 65;

    // Calculate current net worth
    const pensionBal = pension.currentBalance + (pension.kerenHishtalmut.balance ?? 0);
    const reValue = realEstate.properties.reduce((s, p) => s + p.estimatedValue, 0);
    const reMortgage = realEstate.properties.reduce((s, p) => s + (p.mortgage?.remainingBalance ?? 0), 0);
    const invValue = (investments.brokerageAccount?.totalValue ?? 0) + (investments.crypto?.totalValue ?? 0);
    const savingsVal = savings.liquidSavings + (savings.fixedDepositsAmount ?? 0);
    const loanBal = debt.loans.reduce((s, l) => s + l.remainingBalance, 0) + debt.creditCardDebt;

    const currentNetWorth = pensionBal + reValue + invValue + savingsVal - reMortgage - loanBal;
    const monthlyContrib = cashFlow.monthlySavingsAmount + income.monthlyGrossSalary * 0.208;

    // Baseline projection
    const baseline = projectNetWorth({
      currentAge: user.age,
      retirementAge: Math.min(user.age + horizonYears, retAge),
      currentNetWorth,
      monthlyContributions: monthlyContrib,
      annualGrowth: 0.06,
      annualInflation: 0.025,
    });

    // Modified projection (apply first scenario)
    let modifiedMonthly = monthlyContrib;
    let modifiedGrowth = 0.06;
    let modifiedRetAge = retAge;

    for (const scenario of scenarios) {
      switch (scenario.type) {
        case "increase_pension_contribution":
          modifiedMonthly += scenario.value;
          break;
        case "change_retirement_age":
          modifiedRetAge = scenario.value;
          break;
        case "reduce_fees":
          modifiedGrowth += scenario.value / 100; // fee savings translate to growth
          break;
        case "salary_growth":
          modifiedMonthly *= 1 + scenario.value / 100;
          break;
        default:
          break;
      }
    }

    const modified = projectNetWorth({
      currentAge: user.age,
      retirementAge: Math.min(user.age + horizonYears, modifiedRetAge),
      currentNetWorth,
      monthlyContributions: modifiedMonthly,
      annualGrowth: modifiedGrowth,
      annualInflation: 0.025,
    });

    const toTimeseries = (pts: ReturnType<typeof projectNetWorth>): TimeseriesPoint[] =>
      pts.map((p) => ({
        year: p.year,
        age: p.age,
        netWorth: p.netWorth,
        pensionBalance: 0,
        investmentValue: 0,
        realEstateEquity: 0,
        totalDebt: 0,
        monthlyPassiveIncome: 0,
      }));

    const baselineTs = toTimeseries(baseline);
    const modifiedTs = toTimeseries(modified);
    const baselineEnd = baselineTs[baselineTs.length - 1];
    const modifiedEnd = modifiedTs[modifiedTs.length - 1];

    return NextResponse.json<SimulationResponse>({
      success: true,
      result: {
        baseline: baselineTs,
        modified: modifiedTs,
        summary: {
          retirementAgeBaseline: retAge,
          retirementAgeModified: modifiedRetAge,
          netWorthAtRetirementBaseline: baselineEnd?.netWorth ?? 0,
          netWorthAtRetirementModified: modifiedEnd?.netWorth ?? 0,
          monthlyPassiveIncomeBaseline: Math.round((baselineEnd?.netWorth ?? 0) * 0.04 / 12),
          monthlyPassiveIncomeModified: Math.round((modifiedEnd?.netWorth ?? 0) * 0.04 / 12),
          totalFeesSavedBaseline: 0,
          totalFeesSavedModified: 0,
          scoreImpact: 0,
        },
      },
    });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json<SimulationResponse>(
      { success: false, error: "Simulation failed" },
      { status: 500 }
    );
  }
}
