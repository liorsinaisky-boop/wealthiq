"use client";
import { useState } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import type { IncomeSection } from "@/lib/types";
import { NumberField, SelectField, ToggleGroup, NavButtons, YesNo, FieldError } from "./FieldComponents";

const INDUSTRIES = ["הייטק","פיננסים","בריאות","חינוך","ממשלה","בנייה","מזון","שיווק","משפטים","אחר"].map(v => ({ value: v, label: v }));

export default function Section2Income() {
  const { data, updateSection, markComplete, nextStep, prevStep } = useQuestionnaireStore();
  const existing = data.income;
  const [form, setForm] = useState<Partial<IncomeSection>>({
    employmentStatus: existing?.employmentStatus ?? "employee",
    monthlyGrossSalary: existing?.monthlyGrossSalary ?? 0,
    monthlyNetSalary: existing?.monthlyNetSalary,
    additionalIncome: existing?.additionalIncome ?? [],
    yearsAtCurrentJob: existing?.yearsAtCurrentJob ?? 0,
    industry: existing?.industry ?? "",
  });
  const [hasAdditional, setHasAdditional] = useState(!!existing?.additionalIncome?.length);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof IncomeSection>(key: K, val: IncomeSection[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    if (!form.monthlyGrossSalary || form.monthlyGrossSalary <= 0) {
      setError("נא להזין משכורת חודשית ברוטו — זה נחוץ לחישוב הציון");
      return;
    }
    setError(null);
    updateSection("income", form as IncomeSection);
    markComplete("income");
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">הכנסה ותעסוקה</h3>
        <p className="text-slate-400">כמה אתה מרוויח וממה?</p>
      </div>

      <ToggleGroup label="סטטוס תעסוקה" value={form.employmentStatus ?? ""} onChange={(v) => update("employmentStatus", v as IncomeSection["employmentStatus"])}
        options={[
          { value: "employee", label: "שכיר" }, { value: "self_employed", label: "עצמאי" },
          { value: "both", label: "שכיר + עצמאי" }, { value: "unemployed", label: "לא עובד/ת" },
        ]} />

      <NumberField label="משכורת חודשית ברוטו" suffix="₪" value={form.monthlyGrossSalary || ""} onChange={(v) => { update("monthlyGrossSalary", v); setError(null); }} hint="לפני מס" />
      <NumberField label="משכורת חודשית נטו (אופציונלי)" suffix="₪" value={form.monthlyNetSalary || ""} onChange={(v) => update("monthlyNetSalary", v)} hint="אחרי מס. אם לא יודע/ת, נחשב אוטומטית" />

      <YesNo label="יש הכנסה נוספת?" value={hasAdditional} onChange={(v) => { setHasAdditional(v); if (!v) update("additionalIncome", []); }} />
      {hasAdditional && (
        <NumberField label="סכום חודשי נוסף" suffix="₪" value={form.additionalIncome?.[0]?.monthlyAmount || ""} onChange={(v) => update("additionalIncome", [{ type: "other", monthlyAmount: v }])} />
      )}

      <NumberField label="שנות ותק בעבודה הנוכחית" value={form.yearsAtCurrentJob || ""} onChange={(v) => update("yearsAtCurrentJob", v)} />
      <SelectField label="תחום" options={INDUSTRIES} value={form.industry ?? ""} onChange={(v) => update("industry", v)} />

      <FieldError message={error} />
      <NavButtons onNext={handleNext} onBack={prevStep} />
    </div>
  );
}
