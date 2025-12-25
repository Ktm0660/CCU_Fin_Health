import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Link from "next/link";

import { scoreAnswers, bucketize5, bucketCopy, type Score, type AnswerMap, questionsBase } from "@/data/assessment";
import { recommend } from "@/data/recommendations";
import { getLangFromQueryOrStorage, hrefWithLang } from "@/lib/lang";
import { loadAnswers } from "@/lib/state";

function readAnswers(queryA: string | string[] | undefined): AnswerMap {
  if (typeof window !== "undefined") {
    if (typeof queryA === "string" && queryA.trim().startsWith("{")) {
      try {
        return JSON.parse(queryA);
      } catch {}
    }
    const ls = localStorage.getItem("lastAnswers");
    if (ls) {
      try {
        return JSON.parse(ls);
      } catch {}
    }
    const fallback = loadAnswers();
    if (fallback && typeof fallback === "object") {
      if ("answers" in (fallback as any)) {
        return ((fallback as any).answers ?? {}) as AnswerMap;
      }
      return fallback as AnswerMap;
    }
  }
  return {};
}

export default function Results() {
  const router = useRouter();
  const lang = (typeof window !== "undefined" ? getLangFromQueryOrStorage() : "en") as "en" | "es";
  const answers = useMemo(() => readAnswers(router.query.a), [router.query.a]);

  const s = useMemo<Score>(() => scoreAnswers(questionsBase, answers), [answers]);
  const bucketInfo = useMemo(() => bucketize5(s), [s]);
  const key = typeof bucketInfo === "string" ? bucketInfo : bucketInfo.key;
  const copy = (bucketCopy as any)[key]?.[lang] || {
    title: lang === "en" ? "Your profile" : "Tu perfil",
    summary: "",
    strengths: [],
    focus: [],
    tips: [],
  };

  const recs = useMemo(() => recommend(key as any), [key]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

    const retakeHref = hrefWithLang("/assessment", lang);

  return (
    <section>
      <div className="rounded-3xl bg-brand-50 border p-6 md:p-8 shadow mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-ink-900">
            {lang === "en" ? "Your Financial Profile" : "Tu perfil financiero"}
          </h1>
          <Link href={retakeHref} className="text-sm underline">
            {lang === "en" ? "Retake assessment" : "Repetir evaluación"}
          </Link>
        </div>

        <div className="mt-3">
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-white border">
            {lang === "en" ? "Profile" : "Perfil"}: {copy.title}
          </span>
        </div>

        {copy.summary && (
          <p className="mt-4 text-slate-800 text-base leading-relaxed">
            {copy.summary}
          </p>
        )}

        <div className="mt-5 grid md:grid-cols-3 gap-4">
          <Card title={lang === "en" ? "Where you’re strong" : "Fortalezas"}>
            <Bullets items={copy.strengths} />
          </Card>
          <Card title={lang === "en" ? "What to focus on" : "En qué enfocarte"}>
            <Bullets items={copy.focus} />
          </Card>
          <Card title={lang === "en" ? "Quick wins" : "Victorias rápidas"}>
            <Bullets items={copy.tips} />
          </Card>
        </div>
      </div>

      <div className="rounded-3xl bg-white border p-6 shadow">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
          {lang === "en" ? "Your action plan" : "Tu plan de acción"}
        </h2>
        <p className="mt-2 text-slate-700">
          {lang === "en"
            ? "Learn by doing. These short lessons and tools match your profile."
            : "Aprende haciendo. Estas lecciones y herramientas se ajustan a tu perfil."}
        </p>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {recs.map((r: any) => (
            <div key={r.slug || r.title_en || r.title} className="rounded-2xl border p-4 shadow-sm bg-slate-50">
              <h3 className="font-semibold text-ink-900">
                {lang === "en" ? (r.title_en || r.title) : (r.title_es || r.title)}
              </h3>
              {r.summary_en && (
                <p className="text-sm text-slate-700 mt-1">
                  {lang === "en" ? r.summary_en : (r.summary_es || r.summary_en)}
                </p>
              )}
                <div className="mt-2">
                  <Link href={hrefWithLang(r.href || "/tools", lang)} className="text-sm underline">
                    {lang === "en" ? "Open guide →" : "Abrir guía →"}
                  </Link>
                </div>
            </div>
          ))}
        </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Link href={hrefWithLang("/tools", lang)} className="px-4 py-2 rounded-xl border no-underline">
              {lang === "en" ? "Explore more tools" : "Explorar más herramientas"}
            </Link>
            <Link href={hrefWithLang("/glossary", lang)} className="px-4 py-2 rounded-xl bg-brand-500 text-white no-underline">
              {lang === "en" ? "Jargon Breakdown" : "Glosario sin jerga"}
            </Link>
          </div>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border p-4 shadow-sm">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <div className="mt-2 text-sm text-slate-800">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (!items || !items.length) return <p className="text-slate-600">—</p>;
  return (
    <ul className="list-disc ml-5 space-y-1">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}
