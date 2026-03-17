export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency", currency: "ILS",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) return `₪${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₪${(amount / 1_000).toFixed(0)}K`;
  return formatCurrency(amount);
}

export function formatPercent(decimal: number, digits = 1): string {
  return `${(decimal * 100).toFixed(digits)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function scoreToGrade(score: number) {
  if (score >= 90) return { grade: "A+" as const, gradeHe: "מצוין", color: "#22C55E" };
  if (score >= 80) return { grade: "A" as const, gradeHe: "טוב מאוד", color: "#4ADE80" };
  if (score >= 70) return { grade: "B+" as const, gradeHe: "טוב", color: "#A3E635" };
  if (score >= 60) return { grade: "B" as const, gradeHe: "סביר-טוב", color: "#FACC15" };
  if (score >= 50) return { grade: "C" as const, gradeHe: "סביר", color: "#FB923C" };
  if (score >= 40) return { grade: "D" as const, gradeHe: "דורש שיפור", color: "#F87171" };
  return { grade: "F" as const, gradeHe: "דורש טיפול דחוף", color: "#EF4444" };
}
