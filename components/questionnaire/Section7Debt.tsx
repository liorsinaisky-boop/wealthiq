"use client";

import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CurrencyField, YesNo, Expandable, MicroInsight } from "./FieldComponents";

export default function Section7Debt() {
  const { debt, income, realEstate, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof debt>) => updateSection("debt", data);

  const mortgagePayment = realEstate.properties?.[0]?.mortgage?.monthlyPayment ?? 0;
  const loanPayment = debt.loans?.[0]?.monthlyPayment ?? 0;
  const autoCalcObligations = mortgagePayment + loanPayment;

  const dti = (income.monthlyGrossSalary ?? 1) > 0
    ? ((debt.totalMonthlyObligations ?? autoCalcObligations) / (income.monthlyGrossSalary ?? 1) * 100).toFixed(0)
    : "0";

  const updateLoanPayment = (v: number | undefined) => {
    const newPayment = v ?? 0;
    update({
      loans: [{ ...debt.loans?.[0]!, monthlyPayment: newPayment }],
      totalMonthlyObligations: newPayment + mortgagePayment,
    });
  };

  const updateLoanBalance = (v: number | undefined) => {
    update({
      loans: [{
        type: "personal",
        remainingBalance: v ?? 0,
        monthlyPayment: loanPayment,
        interestRate: debt.loans?.[0]?.interestRate ?? 0.05,
        monthsRemaining: debt.loans?.[0]?.monthsRemaining ?? 36,
      }],
      totalMonthlyObligations: loanPayment + mortgagePayment,
    });
  };

  return (
    <SectionWrapper title="חובות והלוואות" subtitle="חוץ מהמשכנתא — הלוואות, אשראי, התחייבויות">
      <YesNo label="יש לך הלוואות (חוץ ממשכנתא)?" value={debt.hasLoans ?? false}
        onChange={(v) => update({ hasLoans: v, loans: v ? debt.loans : [] })} />

      <Expandable show={debt.hasLoans ?? false}>
        <CurrencyField label="יתרת הלוואות" value={debt.loans?.[0]?.remainingBalance}
          onChange={updateLoanBalance} />
        <CurrencyField label="תשלום חודשי" value={debt.loans?.[0]?.monthlyPayment}
          onChange={updateLoanPayment} />
      </Expandable>

      <CurrencyField label="חוב כרטיס אשראי (שלא משולם בזמן)" value={debt.creditCardDebt}
        onChange={(v) => update({ creditCardDebt: v ?? 0 })} hint="0 אם משלם/ת הכל כל חודש" />

      <CurrencyField
        label="סך תשלומי חובות חודשיים (כולל משכנתא)"
        value={(debt.totalMonthlyObligations ?? autoCalcObligations) || undefined}
        onChange={(v) => update({ totalMonthlyObligations: v ?? 0 })}
        hint={autoCalcObligations > 0
          ? `מחושב אוטומטית: ₪${autoCalcObligations.toLocaleString()} — ניתן לשנות`
          : "סכום כל התשלומים החודשיים הקבועים"}
      />

      {((debt.totalMonthlyObligations ?? autoCalcObligations) > 0) && (income.monthlyGrossSalary ?? 0) > 0 && (
        <MicroInsight>
          יחס החוב להכנסה שלך: {dti}%.
          {parseInt(dti) > 40 ? " זה גבוה — מעל 40% נחשב מדאיג." : parseInt(dti) > 20 ? " זה סביר, אבל שווה לשים לב." : " מצוין — יחס בריא."}
        </MicroInsight>
      )}
    </SectionWrapper>
  );
}
