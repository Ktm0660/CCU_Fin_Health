"use client";

import { getLangFromQueryOrStorage, setLang, type Lang } from "@/lib/lang";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const lang: Lang = typeof window !== "undefined" ? getLangFromQueryOrStorage() : "en";
  const other: Lang = lang === "en" ? "es" : "en";
  return (
    <button
      onClick={() => setLang(other)}
      className={`px-3 py-1 rounded-xl border hover:bg-slate-50 ${className}`}
      aria-label="Toggle language"
    >
      {lang === "en" ? "Español" : "English"}
    </button>
  );
}
