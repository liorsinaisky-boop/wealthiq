"use client";
import { useState } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import type { PensionSection } from "@/lib/types";
import { NumberField, SelectField, ToggleGroup, YesNo, NavButtons, FieldError } from "./FieldComponents";

const TRACKS = [
  { value: "general", label: "כללי" }, { value: "stocks", label: "מניות" }, { value: "bonds", label: "אג\"ח" },
  { value: "age_under_50", label: "תלוי גיל (עד 50)" }, { value: "age_50_60", label: "תלוי גיל (50-60)" },
  { value: "sp500", label: "עוקב S&P 500" }, { value: "halacha", label: "הלכתי" }, { value: "other", label: "אחר" },
];

export default function Section3Pension() {
  const { data, updateSection, markComplete, nextStep, prevStep } = useQuestionnaireStore();
  const e = data.pension;
  const [form, setForm] = useState<Partial<PensionSection>>({
    productType: e?.productType ?? "keren_pensia",
    investmentTrack: e?.investmentTrack ?? "general",
    currentBalance: e?.currentBalance ?? 0,
    managementFeePercent: e?.managementFeePercent ?? null,
    depositFeePercent: e?.depositFeePercent ?? null,
    kerenHishtalmut: e?.kerenHishtalmut ?? { hasOne: false },
    hasOldAccounts: e?.hasOldAccounts ?? "not_sure",
    makesVoluntaryContributions: e?.makesVoluntaryContributions ?? false,
    voluntaryMonthlyAmount: e?.voluntaryMonthlyAmount,
  });
  const [error, setError] = useState<string | null>(null);
  const [balanceTouched, setBalanceTouched] = useState(e?.currentBalance !== undefined);

  const update = <K extends keyof PensionSection>(key: K, val: PensionSection[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    if (!balanceTouched) {
      setError("נא להזין יתרת פנסיה (הערכה בסדר). אם אין לך פנסיה, הכנס 0");
      return;
    }
    setError(null);
    updateSection("pension", form as PensionSection);
    markComplete("pension");
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">פנסיה וחסכון ארוך טווח</h3>
        <p className="text-slate-400">הבסיס של העתיד הפיננסי שלך</p>
      </div>

      <ToggleGroup label="סוג מוצר פנסיוני" value={form.productType ?? ""} onChange={(v) => update("productType", v as PensionSection["productType"])}
        options={[
          { value: "keren_pensia", label: "קרן פנסיה" }, { value: "bituach_menahalim", label: "ביטוח מנהלים" },
          { value: "kupat_gemel", label: "קופת גמל" }, { value: "not_sure", label: "לא בטוח/ה" },
        ]} />

      <SelectField label="מסלול השקעה" options={TRACKS} value={form.investmentTrack ?? ""} onChange={(v) => update("investmentTrack", v as PensionSection["investmentTrack"])} />
      <NumberField label="יתרה נוכחית בפנסיה" suffix="₪" value={form.currentBalance ?? ""} onChange={(v) => { update("currentBalance", v); setBalanceTouched(true); setError(null); }} hint="סכום משוער" />
      <NumberField label="דמי ניהול מצבירה (%)" suffix="%" value={form.managementFeePercent ?? ""} onChange={(v) => update("managementFeePercent", v || null)} hint="אם לא יודע/ת, השאר ריק — נשתמש בממוצע" />
      <NumberField label="דמי ניהול מהפקדה (%)" suffix="%" value={form.depositFeePercent ?? ""} onChange={(v) => update("depositFeePercent", v || null)} hint="אם לא יודע/ת, השאר ריק" />

      <YesNo label="יש קרן השתלמות?" value={form.kerenHishtalmut?.hasOne ?? false}
        onChange={(v) => update("kerenHishtalmut", { hasOne: v, balance: form.kerenHishtalmut?.balance })} />
      {form.kerenHishtalmut?.hasOne && (
        <NumberField label="יתרה בקרן השתלמות" suffix="₪" value={form.kerenHishtalmut?.balance || ""}
          onChange={(v) => update("kerenHishtalmut", { ...form.kerenHishtalmut!, balance: v })} />
      )}

      <ToggleGroup label="יש חשבונות פנסיה ישנים/שכוחים?" value={form.hasOldAccounts ?? ""} onChange={(v) => update("hasOldAccounts", v as PensionSection["hasOldAccounts"])}
        options={[{ value: "yes", label: "כן" }, { value: "no", label: "לא" }, { value: "not_sure", label: "לא בטוח/ה" }]} />

      <YesNo label="מפקיד/ה הפקדות וולונטריות מעבר לחובה?" value={form.makesVoluntaryContributions ?? false}
        onChange={(v) => update("makesVoluntaryContributions", v)} />

      <FieldError message={error} />
      <NavButtons onNext={handleNext} onBack={prevStep} />
    </div>
  );
}
