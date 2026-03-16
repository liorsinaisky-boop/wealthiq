import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "דף לא נמצא",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative space-y-6 max-w-md">
        <div className="text-8xl font-black text-gold-400">404</div>

        <h1 className="text-3xl font-bold">הדף לא נמצא</h1>

        <p className="text-slate-400 text-lg leading-relaxed">
          הדף שחיפשת לא קיים או הוסר.
          <br />
          בוא נחזור למסלול הנכון.
        </p>

        <div className="flex gap-3 justify-center pt-2">
          <Link href="/" className="btn-gold">
            חזרה לדף הבית
          </Link>
          <Link href="/check" className="btn-outline">
            התחל בדיקה
          </Link>
        </div>

        <p className="text-xs text-slate-600 pt-4">
          מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני.
        </p>
      </div>
    </main>
  );
}
