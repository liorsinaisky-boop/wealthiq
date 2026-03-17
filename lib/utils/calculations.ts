/** Future Value of an ordinary annuity */
export function futureValueAnnuity(monthlyPayment: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return monthlyPayment * n;
  return monthlyPayment * (((1 + r) ** n - 1) / r);
}

/** Future Value of a lump sum */
export function futureValueLumpSum(pv: number, annualRate: number, years: number): number {
  return pv * (1 + annualRate) ** years;
}

/** Monthly loan payment (PMT) */
export function loanPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
}

/** Debt-to-income ratio */
export function debtToIncomeRatio(monthlyDebt: number, monthlyGross: number): number {
  if (monthlyGross === 0) return 0;
  return monthlyDebt / monthlyGross;
}

/** Emergency fund months coverage */
export function emergencyFundMonths(liquid: number, monthlyExpenses: number): number {
  if (monthlyExpenses === 0) return 12;
  return liquid / monthlyExpenses;
}

/** Savings rate */
export function savingsRate(monthlySaved: number, monthlyNet: number): number {
  if (monthlyNet === 0) return 0;
  return monthlySaved / monthlyNet;
}

/** Total fee cost over N years with growing balance */
export function totalFeeCost(
  balance: number, monthlyContrib: number,
  feePct: number, years: number, growth = 0.05
): number {
  let bal = balance;
  let fees = 0;
  for (let y = 0; y < years; y++) {
    bal += monthlyContrib * 12;
    bal *= 1 + growth;
    fees += bal * (feePct / 100);
  }
  return fees;
}

/** Project net worth over time */
export function projectNetWorth(p: {
  currentAge: number; retirementAge: number; currentNetWorth: number;
  monthlyContributions: number; annualGrowth: number; annualInflation: number;
}) {
  const years = p.retirementAge - p.currentAge;
  const result: Array<{ year: number; age: number; netWorth: number; realNetWorth: number }> = [];
  let nominal = p.currentNetWorth;
  for (let y = 0; y <= years; y++) {
    const inflFactor = (1 + p.annualInflation) ** y;
    result.push({
      year: new Date().getFullYear() + y,
      age: p.currentAge + y,
      netWorth: Math.round(nominal),
      realNetWorth: Math.round(nominal / inflFactor),
    });
    nominal += p.monthlyContributions * 12;
    nominal *= 1 + p.annualGrowth;
  }
  return result;
}
