"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Check Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold">שגיאה בטופס</h1>
        <p className="text-slate-400">
          לא הצלחנו לטעון את הטופס. הנתונים שלך לא אבדו.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-gold">
            נסה שוב
          </button>
          <Link href="/" className="btn-outline">
            דף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
