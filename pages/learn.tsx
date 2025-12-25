import { useRouter } from "next/router";
import { lessons, Area, lessonTitle } from "@/data/lessons";
import LessonCard from "@/components/LessonCard";
import { useEffect, useMemo, useState } from "react";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

const AREAS: { key: Area; en: string; es: string }[] = [
  { key: "habits", en: "Habits", es: "Hábitos" },
  { key: "confidence", en: "Confidence", es: "Confianza" },
  { key: "stability", en: "Stability", es: "Estabilidad" },
];

export default function Learn() {
  const router = useRouter();
  const [locale, setLocale] = useState<Lang>((router.query.lang === "es" ? "es" : (router.locale as Lang)) || "en");
  const [filter, setFilter] = useState<Area | "all">("all");

  useEffect(() => {
    setLocale(getLangFromQueryOrStorage());
  }, [router.locale, router.query.lang]);

  const list = useMemo(() => {
    const base = [...lessons];
    base.sort((a, b) => lessonTitle(a, locale).localeCompare(lessonTitle(b, locale)));
    return filter === "all" ? base : base.filter(l => l.area === filter);
  }, [filter, locale]);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {locale==="en" ? "Short lessons" : "Lecciones cortas"}
      </h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg border ${filter==="all" ? "bg-brand-500 text-white" : ""}`}
        >
          {locale==="en" ? "All" : "Todas"}
        </button>
        {AREAS.map(a => (
          <button
            key={a.key}
            onClick={() => setFilter(a.key)}
            className={`px-3 py-1.5 rounded-lg border ${filter===a.key ? "bg-brand-500 text-white" : ""}`}
          >
            {locale==="en" ? a.en : a.es}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {list.map(lsn => (
          <LessonCard key={lsn.id} lesson={lsn} locale={locale} />
        ))}
      </div>
    </section>
  );
}
