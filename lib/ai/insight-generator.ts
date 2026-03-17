import type { InsightsContext, Insight } from "@/lib/types";
import { INSIGHT_SYSTEM_PROMPT } from "./system-prompts";

export async function generateInsights(context: InsightsContext): Promise<Insight[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("No ANTHROPIC_API_KEY — returning fallback insights");
    return getFallbackInsights(context);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: INSIGHT_SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `Analyze this Israeli financial profile and generate insights in Hebrew:\n\n${JSON.stringify(context, null, 2)}`
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "[]";
    // Extract JSON from response (handle possible markdown wrapping)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return getFallbackInsights(context);
    
    const parsed = JSON.parse(jsonMatch[0]) as Array<Omit<Insight, "id">>;
    return parsed.map((item, i) => ({ ...item, id: `insight-${i}` }));
  } catch (err) {
    console.error("AI insight generation failed:", err);
    return getFallbackInsights(context);
  }
}

function getFallbackInsights(ctx: InsightsContext): Insight[] {
  const insights: Insight[] = [];

  if (ctx.emergencyFundMonths < 3) {
    insights.push({
      id: "ef-low", titleHe: "קרן החירום שלך דקה מדי",
      bodyHe: `יש לך כיסוי של ${ctx.emergencyFundMonths.toFixed(1)} חודשים בלבד. מומלץ לשאוף ל-${ctx.hasDependents ? "9" : "6"} חודשי הוצאות. שווה לבדוק אם אפשר להגדיל את החיסכון הנזיל בהדרגה.`,
      category: "savings", impact: "high", estimatedScoreImpact: "+5 to +10 points", icon: "🚨",
    });
  }

  if (ctx.debtToIncomeRatio > 0.35) {
    insights.push({
      id: "dti-high", titleHe: "עומס החוב שלך גבוה",
      bodyHe: `${(ctx.debtToIncomeRatio * 100).toFixed(0)}% מההכנסה שלך הולך לתשלומי חובות. מעל 35% נחשב גבוה ומגביל את היכולת לחסוך ולהשקיע. כדאי לשקול תעדוף סגירת הלוואות בריבית גבוהה.`,
      category: "debt", impact: "high", estimatedScoreImpact: "+5 to +15 points", icon: "⚠️",
    });
  }

  if (ctx.realEstateConcentration > 0.6) {
    insights.push({
      id: "re-heavy", titleHe: "ריכוז גבוה בנדל״ן",
      bodyHe: `${(ctx.realEstateConcentration * 100).toFixed(0)}% מהנכסים שלך בנדל״ן. זה אומר שרוב העושר שלך לא נזיל. שווה לבדוק אם יש מקום לגוון לנכסים נזילים יותר לאורך זמן.`,
      category: "cross_asset", impact: "medium", estimatedScoreImpact: "+3 to +7 points", icon: "🏠",
    });
  }

  if (ctx.pensionExpectedRatio < 0.7 && ctx.pensionExpectedRatio > 0) {
    insights.push({
      id: "pension-gap", titleHe: "פער בחיסכון הפנסיוני",
      bodyHe: `יתרת הפנסיה שלך עומדת על ${(ctx.pensionExpectedRatio * 100).toFixed(0)}% מהצפוי לגילך ולהכנסתך. הגדלת ההפקדות החודשיות, אפילו בסכום קטן, יכולה לצמצם את הפער משמעותית הודות לריבית דריבית.`,
      category: "pension", impact: "high", estimatedScoreImpact: "+5 to +12 points", icon: "📊",
    });
  }

  if (!ctx.hasDisabilityInsurance && ctx.hasDependents) {
    insights.push({
      id: "no-disability", titleHe: "אין ביטוח אובדן כושר עבודה",
      bodyHe: `עם ${ctx.hasDependents ? "ילדים" : "תלויים"}, העדר ביטוח אובדן כושר עבודה הוא סיכון משמעותי. אם לא תוכל/י לעבוד, המשפחה תצטרך להסתדר בלי ההכנסה הנוכחית. שווה לבדוק אם הכיסוי הפנסיוני כולל רכיב כזה.`,
      category: "insurance", impact: "high", estimatedScoreImpact: "+3 to +5 points", icon: "🛡️",
    });
  }

  if (ctx.savingsRate < 0.1) {
    insights.push({
      id: "low-savings", titleHe: "שיעור החיסכון נמוך",
      bodyHe: `אתה חוסך ${(ctx.savingsRate * 100).toFixed(0)}% מההכנסה נטו. כדאי לשאוף ל-20% לפחות. גם הגדלה של כמה מאות שקלים בחודש יכולה לעשות הבדל משמעותי לאורך שנים.`,
      category: "cash_flow", impact: "medium", estimatedScoreImpact: "+3 to +8 points", icon: "💰",
    });
  }

  return insights.length > 0 ? insights : [{
    id: "general", titleHe: "המצב הפיננסי שלך",
    bodyHe: `הציון שלך הוא ${ctx.totalScore}/100. שווה לעבור על הקטגוריות השונות ולראות איפה יש מקום לשיפור. כל שיפור קטן מצטבר לאורך זמן.`,
    category: "cross_asset", impact: "medium", estimatedScoreImpact: "varies", icon: "📈",
  }];
}
