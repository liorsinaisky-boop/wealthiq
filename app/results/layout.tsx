import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "התוצאות שלך",
  description: "הציון הפיננסי שלך עם תובנות מותאמות אישית מבוססות AI",
  robots: { index: false, follow: false },
  openGraph: {
    title: "קיבלתי את הציון הפיננסי שלי ב-WealthIQ!",
    description: "כמה בריא הכסף שלך? בדוק גם אתה — חינם ובלי הרשמה",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/api/share?score=72&grade=B%2B",
        width: 1200,
        height: 630,
        alt: "WealthIQ Score Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "הציון הפיננסי שלי ב-WealthIQ",
    description: "בדוק גם אתה — חינם ובלי הרשמה",
  },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
