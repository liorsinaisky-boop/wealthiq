"use client";

import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CurrencyField, CardSelect, YesNo, Expandable, MicroInsight } from "./FieldComponents";

export default function Section6Savings() {
  const { savings, cashFlow, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof savings>) => updateSection("savings", data);

  const efMonths = (cashFlow.monthlyExpenses ?? 1) > 0
    ? ((savings.hasEmergencyFund === "yes" ? savings.emergencyFundAmount ?? 0 : savings.hasEmergencyFund === "savings_is_emergency" ? savings.liquidSavings ?? 0 : 0) / (cashFlow.monthlyExpenses ?? 10000)).toFixed(1)
    : "—";

  return (
    <SectionWrapper title="חסכונות וקרן חירום" subtitle="כמה מזומן ונזילות יש לך?">
      <CurrencyField label="סך חסכונות נזילים (עו״ש + חסכון)" value={savings.liquidSavings}
        onChange={(v) => update({ liquidSavings: v ?? 0 })} placeholder="לדוגמה: 50000" />

      <CardSelect label="יש לך קרן חירום ייעודית?" value={savings.hasEmergencyFund ?? "no"}
        onChange={(v) => update({ hasEmergencyFund: v as any })}
        options={[["yes", "כן, נפרדת"], ["savings_is_emergency", "החסכון שלי = קרן החירום"], ["no", "לא"]]} columns={3} />

      <Expandable show={savings.hasEmergencyFund === "yes"}>
        <CurrencyField label="סכום קרן חירום" value={savings.emergencyFundAmount}
          onChange={(v) => update({ emergencyFundAmount: v })} />
      </Expandable>

      <YesNo label="יש לך פקדונות בנקאיים?" value={savings.hasFixedDeposits ?? false}
        onChange={(v) => update({ hasFixedDeposits: v })} />
      <Expandable show={savings.hasFixedDeposits ?? false}>
        <CurrencyField label="סך פקדונות" value={savings.fixedDepositsAmount}
          onChange={(v) => update({ fixedDepositsAmount: v })} />
      </Expandable>

      <YesNo label="חיסכון לכל ילד?" value={savings.hasChildSavings ?? false}
        onChange={(v) => update({ hasChildSavings: v })} />
      <Expandable show={savings.hasChildSavings ?? false}>
        <CurrencyField label="יתרה כוללת" value={savings.childSavingsBalance}
          onChange={(v) => update({ childSavingsBalance: v })} />
      </Expandable>

      {(savings.liquidSavings ?? 0) > 0 && (
        <MicroInsight>
          קרן החירום שלך מכסה כ-{efMonths} חודשי הוצאות. המומלץ: 3-6 חודשים.
        </MicroInsight>
      )}
    </SectionWrapper>
  );
}
