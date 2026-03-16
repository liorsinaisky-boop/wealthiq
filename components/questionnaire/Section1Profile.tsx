"use client";
import { useState } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import type { ProfileSection } from "@/lib/types";
import { NumberField, SelectField, ToggleGroup, SliderField, NavButtons, FieldError } from "./FieldComponents";

const CITIES = ["תל אביב","ירושלים","חיפה","ראשון לציון","פתח תקווה","אשדוד","נתניה","באר שבע","חולון","בני ברק","רמת גן","אשקלון","הרצליה","כפר סבא","רעננה","מודיעין","בת ים","אילת","אחר"].map(c => ({ value: c, label: c }));

export default function Section1Profile() {
  const { data, updateSection, markComplete, nextStep } = useQuestionnaireStore();
  const existing = data.profile;
  const [form, setForm] = useState<Partial<ProfileSection>>({
    age: existing?.age ?? 30,
    gender: existing?.gender ?? "male",
    maritalStatus: existing?.maritalStatus ?? "single",
    dependents: existing?.dependents ?? 0,
    city: existing?.city ?? "",
    riskTolerance: existing?.riskTolerance ?? "balanced",
    primaryGoal: existing?.primaryGoal ?? "comfortable_retirement",
    targetRetirementAge: existing?.targetRetirementAge ?? 67,
  });
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProfileSection>(key: K, val: ProfileSection[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    if (!form.age || form.age < 18 || form.age > 100) {
      setError("נא להזין גיל תקין (18–100)");
      return;
    }
    setError(null);
    updateSection("profile", form as ProfileSection);
    markComplete("profile");
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">ספר/י לנו על עצמך</h3>
        <p className="text-slate-400">מידע בסיסי שעוזר להתאים את הניתוח</p>
      </div>

      <SliderField label="גיל" min={18} max={80} value={form.age ?? 30} onChange={(v) => update("age", v)} />

      <ToggleGroup label="מגדר" value={form.gender ?? ""} onChange={(v) => update("gender", v as ProfileSection["gender"])}
        options={[{ value: "male", label: "גבר" }, { value: "female", label: "אישה" }, { value: "prefer_not_to_say", label: "לא רוצה לציין" }]} />

      <ToggleGroup label="מצב משפחתי" value={form.maritalStatus ?? ""} onChange={(v) => update("maritalStatus", v as ProfileSection["maritalStatus"])}
        options={[{ value: "single", label: "רווק/ה" }, { value: "married", label: "נשוי/אה" }, { value: "divorced", label: "גרוש/ה" }]} />

      <SliderField label="מספר ילדים / תלויים" min={0} max={10} value={form.dependents ?? 0} onChange={(v) => update("dependents", v)} />

      <SelectField label="עיר מגורים" options={CITIES} value={form.city ?? ""} onChange={(v) => update("city", v)} />

      <SliderField label="מוכנות לסיכון" min={1} max={3} value={form.riskTolerance === "conservative" ? 1 : form.riskTolerance === "aggressive" ? 3 : 2}
        onChange={(v) => update("riskTolerance", v === 1 ? "conservative" : v === 3 ? "aggressive" : "balanced")}
        formatValue={(v) => v === 1 ? "שמרני" : v === 3 ? "אגרסיבי" : "מאוזן"}
        labels={{ start: "שמרני", end: "אגרסיבי" }} />

      <ToggleGroup label="המטרה הפיננסית העיקרית שלך" value={form.primaryGoal ?? ""} onChange={(v) => update("primaryGoal", v as ProfileSection["primaryGoal"])}
        options={[
          { value: "comfortable_retirement", label: "פרישה נוחה", icon: "🏖️" },
          { value: "early_retirement", label: "פרישה מוקדמת", icon: "⏰" },
          { value: "buy_home", label: "רכישת דירה", icon: "🏠" },
          { value: "financial_independence", label: "עצמאות כלכלית", icon: "🚀" },
          { value: "children_education", label: "חינוך ילדים", icon: "🎓" },
          { value: "other", label: "אחר", icon: "✨" },
        ]} />

      <SliderField label="גיל פרישה מתוכנן" min={55} max={75} value={form.targetRetirementAge ?? 67} onChange={(v) => update("targetRetirementAge", v)} />

      <FieldError message={error} />
      <NavButtons onNext={handleNext} />
    </div>
  );
}
