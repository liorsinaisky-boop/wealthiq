"use client";

import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CardSelect, YesNo, CurrencyField, Expandable, MicroInsight } from "./FieldComponents";

export default function Section8Insurance() {
  const { insurance, profile, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof insurance>) => updateSection("insurance", data);

  const gaps: string[] = [];
  if (insurance.hasLifeInsurance === "no" && (profile.dependents ?? 0) > 0) gaps.push("ביטוח חיים");
  if (insurance.hasDisabilityInsurance === "no") gaps.push("אובדן כושר עבודה");
  if (!insurance.hasWill && (profile.dependents ?? 0) > 0) gaps.push("צוואה");

  return (
    <SectionWrapper title="ביטוח והגנה" subtitle="כיסוי ביטוחי, אובדן כושר עבודה, צוואה">
      <CardSelect label="ביטוח חיים" value={insurance.hasLifeInsurance ?? "no"}
        onChange={(v) => update({ hasLifeInsurance: v as "yes" | "no" | "through_pension" })}
        options={[["yes", "כן, פרטי"], ["through_pension", "דרך הפנסיה"], ["no", "אין"]]} columns={3} />

      <Expandable show={insurance.hasLifeInsurance === "yes"}>
        <CurrencyField label="סכום כיסוי" value={insurance.lifeCoverageAmount}
          onChange={(v) => update({ lifeCoverageAmount: v })} placeholder="לדוגמה: 2000000" />
      </Expandable>

      <CardSelect label="ביטוח אובדן כושר עבודה" value={insurance.hasDisabilityInsurance ?? "no"}
        onChange={(v) => update({ hasDisabilityInsurance: v as "yes" | "no" | "through_pension" })}
        options={[["yes", "כן, פרטי"], ["through_pension", "דרך הפנסיה"], ["no", "אין"]]} columns={3} />

      <Expandable show={insurance.hasDisabilityInsurance === "yes"}>
        <CurrencyField label="כיסוי חודשי" value={insurance.disabilityMonthlyCoverage}
          onChange={(v) => update({ disabilityMonthlyCoverage: v })} placeholder="לדוגמה: 15000" />
      </Expandable>

      <YesNo label="ביטוח בריאות משלים (מעבר לקופ״ח)?" value={insurance.hasPrivateHealthInsurance ?? false}
        onChange={(v) => update({ hasPrivateHealthInsurance: v })} />

      <YesNo label="ביטוח דירה / רכוש?" value={insurance.hasPropertyInsurance ?? false}
        onChange={(v) => update({ hasPropertyInsurance: v })} />

      <YesNo label="יש לך צוואה?" value={insurance.hasWill ?? false}
        onChange={(v) => update({ hasWill: v })} />

      {gaps.length > 0 && (
        <MicroInsight>
          שווה לשים לב: חסרים לך {gaps.join(", ")}.
          {(profile.dependents ?? 0) > 0 ? " זה חשוב במיוחד כשיש תלויים." : ""}
        </MicroInsight>
      )}
    </SectionWrapper>
  );
}
