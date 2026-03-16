"use client";

import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CurrencyField, CardSelect, MicroInsight } from "./FieldComponents";

export default function Section9CashFlow() {
  const { cashFlow, income, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof cashFlow>) => updateSection("cashFlow", data);

  const netSalary = income.monthlyNetSalary ?? (income.monthlyGrossSalary ?? 0) * 0.65;
  const expenses = cashFlow.monthlyExpenses ?? 0;
  const savings = cashFlow.monthlySavingsAmount ?? 0;
  const savingsRate = netSalary > 0 ? Math.round((savings / netSalary) * 100) : 0;

  return (
    <SectionWrapper title="תזרים חודשי" subtitle="הוצאות, חיסכון ותקציב — הסקשן האחרון!">
      <CurrencyField
        label="הוצאות חודשיות (לא כולל חסכונות ותשלומי חובות)"
        value={cashFlow.monthlyExpenses}
        onChange={(v) => update({ monthlyExpenses: v ?? 0 })}
        placeholder="לדוגמה: 10000"
        hint="דיור, אוכל, תחבורה, ילדים, בילויים, ביגוד..."
      />

      <CurrencyField
        label="כמה את/ה חוסך/ת בחודש?"
        value={cashFlow.monthlySavingsAmount}
        onChange={(v) => update({ monthlySavingsAmount: v ?? 0 })}
        placeholder="לדוגמה: 3000"
        hint="לא כולל הפקדות לפנסיה — רק חסכון אקטיבי"
      />

      <CardSelect
        label="יש לך תקציב?"
        value={cashFlow.budgetDiscipline ?? "loose"}
        onChange={(v) => update({ budgetDiscipline: v as "strict" | "loose" | "none" })}
        options={[
          ["strict", "כן, קפדני"],
          ["loose", "כן, גמיש"],
          ["none", "לא באמת"],
        ]}
        columns={3}
      />

      {netSalary > 0 && savings > 0 && (
        <MicroInsight>
          קצב החיסכון שלך: {savingsRate}% מההכנסה נטו.
          {savingsRate >= 20
            ? " מצוין! מעל 20% זה יעד שרוב האנשים לא מגיעים אליו."
            : savingsRate >= 10
              ? " לא רע — שאיפה טובה היא להגיע ל-20%."
              : " שווה לבדוק אם יש מקום להגדיל. גם ₪500 נוספים בחודש עושים הבדל גדול לאורך זמן."}
        </MicroInsight>
      )}

      {expenses > 0 && netSalary > 0 && expenses > netSalary * 0.9 && (
        <MicroInsight>
          ההוצאות שלך ({Math.round((expenses / netSalary) * 100)}% מהנטו) גבוהות יחסית.
          כדאי לשקול לבדוק אם יש מקום לייעל.
        </MicroInsight>
      )}

      {/* Final summary before submit */}
      <div className="rounded-xl border border-gold-400/30 bg-gold-400/5 p-5 text-center">
        <p className="text-base font-bold text-gold-400 mb-1">🎉 סיימת!</p>
        <p className="text-sm text-gray-300">
          לחץ/י &quot;סיום וחישוב ציון&quot; כדי לקבל את ה-WealthIQ Score שלך
        </p>
      </div>
    </SectionWrapper>
  );
}
