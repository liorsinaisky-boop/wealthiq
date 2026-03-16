"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Results Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="text-6xl">📊</div>
        <h1 className="text-2xl font-bold">שגיאה בחישוב הציון</h1>
        <p className="text-slate-400">
          לא הצלחנו לחשב את הציון שלך. נסה למלא את הטופס מחדש.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/check" className="btn-gold">
            חזרה לטופס
          </Link>
          <button onClick={reset} className="btn-outline">
            נסה שוב
          </button>
        </div>
      </div>
    </main>
  );
}
