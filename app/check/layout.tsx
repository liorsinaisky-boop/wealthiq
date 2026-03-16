import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "בדיקה פיננסית",
  description: "ענה על 9 שאלות קצרות וקבל ניתוח פיננסי מפורט — פנסיה, השקעות, חסכונות ועוד",
  robots: { index: false, follow: false },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
