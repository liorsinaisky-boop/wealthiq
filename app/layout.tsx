import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://wealthiq.co.il";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "WealthIQ — הציון הפיננסי שלך",
    template: "%s | WealthIQ",
  },
  description: "בדוק את הבריאות הפיננסית שלך בחינם — פנסיה, נדל״ן, השקעות, חסכונות והלוואות במקום אחד. קבל ציון מ-0 עד 100 עם תובנות מותאמות אישית.",
  keywords: ["פנסיה", "השקעות", "ציון פיננסי", "תכנון פרישה", "ניהול כספים", "קרן פנסיה", "ביטוח מנהלים", "WealthIQ"],
  authors: [{ name: "WealthIQ" }],
  openGraph: {
    title: "WealthIQ — הציון הפיננסי שלך",
    description: "תענה על כמה שאלות, קבל ציון מ-0 עד 100 על הבריאות הפיננסית שלך",
    locale: "he_IL",
    type: "website",
    siteName: "WealthIQ",
    url: baseUrl,
    images: [
      {
        url: "/api/share?score=72&grade=B%2B",
        width: 1200,
        height: 630,
        alt: "WealthIQ — הציון הפיננסי שלך",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WealthIQ — הציון הפיננסי שלך",
    description: "תענה על כמה שאלות, קבל ציון מ-0 עד 100",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: baseUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WealthIQ",
  description: "כלי חינמי לבדיקת הבריאות הפיננסית שלך — פנסיה, נדל״ן, השקעות, חסכונות והלוואות",
  url: baseUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "he",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "ILS",
  },
  featureList: [
    "ציון פיננסי 0-100",
    "ניתוח פנסיה",
    "בדיקת דמי ניהול",
    "תכנון פרישה",
    "סימולטור מה-אם",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-dark-500 text-white font-heebo antialiased">
        {children}
      </body>
    </html>
  );
}
