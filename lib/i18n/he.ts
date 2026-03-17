export const he = {
  app: {
    name: "WealthIQ",
    tagline: "הציון הפיננסי שלך",
    description: "בדוק את הבריאות הפיננסית שלך בחינם — פנסיה, נדל״ן, השקעות, חסכונות והלוואות במקום אחד",
  },
  landing: {
    hero: "כמה בריא הכסף שלך?",
    subtitle: "תענה על כמה שאלות, קבל ציון מ-0 עד 100, ותבין בדיוק איפה אתה עומד",
    cta: "התחל בדיקה חינמית",
    stats: { users: "בדקו את הציון שלהם", avgScore: "ציון ממוצע", timeToComplete: "דקות למילוי" },
  },
  questionnaire: {
    sections: {
      profile: "הפרופיל שלך", income: "הכנסה ותעסוקה",
      pension: "פנסיה וחסכון ארוך טווח", real_estate: "נדל״ן",
      investments: "השקעות", savings: "חסכונות וקרן חירום",
      debt: "חובות והלוואות", insurance: "ביטוח והגנה",
      cash_flow: "תזרים חודשי",
    },
    next: "הבא", back: "חזרה", skip: "דלג", submit: "קבל את הציון שלי",
    progress: "שלב {{current}} מתוך {{total}}",
  },
  results: {
    title: "הציון הפיננסי שלך",
    score: "WealthIQ Score",
    percentile: "אתה בטופ {{pct}}% לגיל שלך",
    categories: {
      retirement_readiness: "מוכנות לפרישה",
      financial_stability: "יציבות פיננסית",
      wealth_growth: "צמיחת עושר",
      risk_management: "ניהול סיכונים",
      fee_efficiency: "יעילות עלויות",
      goal_alignment: "התאמה ליעדים",
    },
    insights: "תובנות מותאמות אישית",
    simulator: "סימולטור מה-אם",
    share: "שתף את הציון שלך",
    netWorth: "שווי נקי",
    assets: "נכסים", liabilities: "התחייבויות",
  },
  simulator: {
    title: "מה קורה אם...",
    scenarios: {
      increase_pension: "מגדיל הפקדות לפנסיה",
      change_retirement_age: "משנה גיל פרישה",
      reduce_fees: "מוריד דמי ניהול",
      pay_off_loan: "סוגר הלוואה",
      increase_savings: "מגדיל חיסכון חודשי",
    },
    current: "מצב נוכחי", projected: "אחרי שינוי",
  },
  disclaimer: "מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, או המלצה לפעולה כלשהי. לקבלת ייעוץ מותאם אישית, פנה/י ליועץ פנסיוני מורשה.",
  common: {
    currency: "₪", yes: "כן", no: "לא", notSure: "לא בטוח/ה",
    iDontKnow: "לא יודע/ת", monthlyAmount: "סכום חודשי",
  },
} as const;
