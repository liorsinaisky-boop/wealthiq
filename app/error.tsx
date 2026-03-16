"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[WealthIQ Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold">משהו השתבש</h1>
        <p className="text-slate-400">
          אירעה שגיאה בלתי צפויה. הנתונים שלך לא נשמרו בשום מקום.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-gold">
            נסה שוב
          </button>
          <Link href="/" className="btn-outline">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
