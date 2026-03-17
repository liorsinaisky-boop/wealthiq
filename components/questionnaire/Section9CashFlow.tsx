"use client";

import { useState } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CurrencyField, CardSelect, MicroInsight } from "./FieldComponents";
import type { ExpenseBreakdown } from "@/lib/types";

const BREAKDOWN_FIELDS: { key: keyof ExpenseBreakdown; label: string; hint?: string }[] = [
  { key: "housing",       label: "דיור (שכ״ד / משכנתא)",    hint: "ממולא אוטומטית אם הזנת משכנתא" },
  { key: "utilities",     label: "חשבונות (חשמל, מים, גז, אינטרנט)" },
  { key: "food",          label: "מזון וסופר" },
  { key: "transportation", label: "תחבורה (דלק, תחבורה ציבורית, חניה)" },
  { key: "insurance",     label: "ביטוחים (פרמיות חודשיות)" },
  { key: "childcare",     label: "ילדים וחינוך" },
  { key: "entertainment", label: "בילויים ומסעדות" },
  { key: "subscriptions", label: "מנויים ומשלמים" },
  { key: "other",         label: "אחר" },
];

export default function Section9CashFlow() {
  const { cashFlow, income, realEstate, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof cashFlow>) => updateSection("cashFlow", data);

  const [showBreakdown, setShowBreakdown] = useState(false);

  const netSalary = income.monthlyNetSalary ?? (income.monthlyGrossSalary ?? 0) * 0.65;
  const expenses = cashFlow.monthlyExpenses ?? 0;
  const savings = cashFlow.monthlySavingsAmount ?? 0;
  const savingsRate = netSalary > 0 ? Math.round((savings / netSalary) * 100) : 0;

  const bd = cashFlow.expenseBreakdown ?? ({} as Partial<ExpenseBreakdown>);
  const breakdownTotal = Object.values(bd).reduce((sum: number, v) => sum + (v ?? 0), 0);

  const updateBreakdown = (key: keyof ExpenseBreakdown, value: number | undefined) => {
    const next = { ...bd, [key]: value ?? 0 } as ExpenseBreakdown;
    // Auto-update total expenses to match breakdown sum
    const total = Object.values(next).reduce((sum, v) => sum + (v ?? 0), 0);
    update({ expenseBreakdown: next, monthlyExpenses: total });
  };

  // Pre-fill housing from mortgage payment if available
  const mortgagePayment = realEstate.properties?.[0]?.mortgage?.monthlyPayment;

  const handleToggleBreakdown = (on: boolean) => {
    setShowBreakdown(on);
    if (on && mortgagePayment && !bd.housing) {
      // Pre-fill housing with mortgage payment
      const next = { ...bd, housing: mortgagePayment } as ExpenseBreakdown;
      update({ expenseBreakdown: next });
    }
    if (!on) {
      // Clear breakdown, keep manual total
      update({ expenseBreakdown: undefined });
    }
  };

  const diffPct = expenses > 0 && breakdownTotal > 0
    ? Math.abs(breakdownTotal - expenses) / expenses
    : 0;

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

      {/* Expense breakdown toggle */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white">פירוט הוצאות</p>
          <p className="text-xs text-gray-400">רוצה לפרט לפי קטגוריות? זה עוזר לנו לתת תובנות מדויקות יותר</p>
        </div>
        <button
          type="button"
          onClick={() => handleToggleBreakdown(!showBreakdown)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${showBreakdown ? "bg-gold-400" : "bg-white/20"}`}
          style={{ background: showBreakdown ? "#D4A843" : undefined }}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition duration-200 ${showBreakdown ? "-translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {showBreakdown && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400 mb-1">כל השדות אופציונליים. הסכום מתעדכן אוטומטית.</p>
          {BREAKDOWN_FIELDS.map(({ key, label, hint }) => (
            <CurrencyField
              key={key}
              label={label}
              value={(bd[key] as number | undefined) || undefined}
              placeholder="0"
              hint={hint}
              onChange={(v) => updateBreakdown(key, v)}
            />
          ))}

          {breakdownTotal > 0 && (
            <div className="rounded-lg bg-white/10 px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-gray-300">סה״כ פירוט:</span>
              <span className="text-sm font-bold text-gold-400">₪{breakdownTotal.toLocaleString()}</span>
            </div>
          )}

          {diffPct > 0.2 && expenses > 0 && breakdownTotal > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              הפירוט מסתכם ב-₪{breakdownTotal.toLocaleString()} — הזנת ₪{expenses.toLocaleString()} כסך הכל.
              {" "}
              <button
                type="button"
                className="underline font-medium"
                onClick={() => update({ monthlyExpenses: breakdownTotal })}
              >
                עדכן לסכום הפירוט
              </button>
            </div>
          )}
        </div>
      )}

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
