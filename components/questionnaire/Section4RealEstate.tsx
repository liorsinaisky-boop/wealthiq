"use client";

import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CurrencyField, YesNo, CardSelect, Expandable, MicroInsight } from "./FieldComponents";
import type { Property } from "@/lib/types";

export default function Section4RealEstate() {
  const { realEstate, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof realEstate>) => updateSection("realEstate", data);

  const ownsProperty = realEstate.ownsProperty ?? false;
  const prop = realEstate.properties?.[0];

  const updateProperty = (data: Partial<Property>) => {
    const existing = realEstate.properties?.[0] ?? {
      type: "apartment" as const, city: "", estimatedValue: 0,
      purchaseYear: 2020, purchasePrice: 0, hasMortgage: false, isRented: false,
    };
    update({ properties: [{ ...existing, ...data } as Property] });
  };

  return (
    <SectionWrapper title="נדל״ן" subtitle="בואו נראה מה מצב הנכסים שלך">
      <YesNo label="יש לך דירה/נכס בבעלותך?" value={ownsProperty}
        onChange={(v) => update({ ownsProperty: v, properties: v ? realEstate.properties : [] })} />

      <Expandable show={ownsProperty}>
        <CardSelect label="סוג נכס" value={prop?.type ?? "apartment"} onChange={(v) => updateProperty({ type: v as Property["type"] })}
          options={[["apartment", "דירה"], ["house", "בית"], ["land", "קרקע"], ["commercial", "מסחרי"]]} />

        <CurrencyField label="שווי משוער כיום" value={prop?.estimatedValue} placeholder="לדוגמה: 2500000"
          onChange={(v) => updateProperty({ estimatedValue: v ?? 0 })} />

        <CurrencyField label="מחיר רכישה" value={prop?.purchasePrice} placeholder="לדוגמה: 1800000"
          onChange={(v) => updateProperty({ purchasePrice: v ?? 0 })} />

        <YesNo label="יש משכנתא?" value={prop?.hasMortgage ?? false}
          onChange={(v) => updateProperty({ hasMortgage: v })} />

        <Expandable show={prop?.hasMortgage ?? false}>
          <CurrencyField label="יתרת משכנתא" value={prop?.mortgage?.remainingBalance}
            onChange={(v) => updateProperty({ mortgage: { ...prop?.mortgage, remainingBalance: v ?? 0, monthlyPayment: prop?.mortgage?.monthlyPayment ?? 0, interestRate: prop?.mortgage?.interestRate ?? 0.04, trackType: prop?.mortgage?.trackType ?? "prime", yearsRemaining: prop?.mortgage?.yearsRemaining ?? 20 } })} />
          <CurrencyField label="תשלום חודשי" value={prop?.mortgage?.monthlyPayment}
            onChange={(v) => updateProperty({ mortgage: { ...prop?.mortgage!, monthlyPayment: v ?? 0 } })} />
        </Expandable>

        <YesNo label="הנכס מושכר?" value={prop?.isRented ?? false}
          onChange={(v) => updateProperty({ isRented: v })} />
        <Expandable show={prop?.isRented ?? false}>
          <CurrencyField label="שכירות חודשית" value={prop?.monthlyRentIncome}
            onChange={(v) => updateProperty({ monthlyRentIncome: v ?? 0 })} />
        </Expandable>
      </Expandable>

      <YesNo label="מתכנן/ת לרכוש נכס ב-2 השנים הקרובות?" value={realEstate.planningToBuy ?? false}
        onChange={(v) => update({ planningToBuy: v })} />

      <Expandable show={realEstate.planningToBuy ?? false}>
        <CurrencyField label="תקציב מתוכנן" value={realEstate.targetBudget} placeholder="לדוגמה: 2000000"
          onChange={(v) => update({ targetBudget: v })} />
        <CurrencyField label="הון עצמי זמין" value={realEstate.downPaymentAvailable} placeholder="לדוגמה: 500000"
          onChange={(v) => update({ downPaymentAvailable: v })} />
      </Expandable>

      {ownsProperty && prop?.estimatedValue && prop.estimatedValue > 0 && (
        <MicroInsight>
          שווי הנכס שלך: ₪{prop.estimatedValue.toLocaleString()}
          {prop.hasMortgage && prop.mortgage?.remainingBalance ? ` (הון עצמי: ₪${(prop.estimatedValue - prop.mortgage.remainingBalance).toLocaleString()})` : ""}
        </MicroInsight>
      )}
    </SectionWrapper>
  );
}
