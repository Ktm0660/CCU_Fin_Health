import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  bucketCopy,
  bucketize5,
  normalize0to100,
  questionsBase,
  scoreAnswers,
  type AnswerMap,
  type BucketKey5,
  type Pillar,
} from "@/data/assessment";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";
import { loadAnswers } from "@/lib/state";

type PillarMetric = {
  raw: number;
  max: number;
  pct: number;
  bucket: BucketKey5;
};

type PillarCopy = {
  title: string;
  summary: string;
};

const LS_KEYS = ["assessmentV2Answers", "lastAnswers"];

function safeParse(obj: string | null): AnswerMap | undefined {
  if (!obj) return undefined;
  try {
    const parsed = JSON.parse(obj);
    if (parsed && typeof parsed === "object") return parsed as AnswerMap;
  } catch {}
  return undefined;
}

function readAnswers(queryA: string | string[] | undefined): AnswerMap {
  if (typeof window === "undefined") return {};

  if (typeof queryA === "string" && queryA.trim().startsWith("{")) {
    try {
      return JSON.parse(queryA) as AnswerMap;
    } catch {}
  }

  for (const key of LS_KEYS) {
    const parsed = safeParse(localStorage.getItem(key));
    if (parsed) return parsed;
  }

  const last = loadAnswers();
  if (last && typeof last === "object") {
    if ("answers" in (last as any)) return ((last as any).answers ?? {}) as AnswerMap;
    return last as AnswerMap;
  }

  return {};
}

export default function ResultsV2() {
  const router = useRouter();
  const lang = (typeof window !== "undefined" ? getLangFromQueryOrStorage() : "en") as Lang;
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    setAnswers(readAnswers(router.query.a));
  }, [router.query.a]);

  const hasAnswers = Object.keys(answers || {}).length > 0;

  const metrics = useMemo(() => {
    if (!hasAnswers) return {} as Record<Pillar, PillarMetric>;
    const score = scoreAnswers(questionsBase, answers);
    const pillars = Object.keys(score.byPillar) as Pillar[];
    return pillars.reduce((acc, pillar) => {
      const raw = score.byPillar[pillar] ?? 0;
      const max = score.maxByPillar[pillar] ?? 0;
      const pct = normalize0to100(raw, Math.max(1, max));
      const bucket = bucketize5(max > 0 ? raw / max : 0) as BucketKey5;
      acc[pillar] = { raw, max, pct, bucket };
      return acc;
    }, {} as Record<Pillar, PillarMetric>);
  }, [answers, hasAnswers]);

  const copies = useMemo(() => {
    const result: Partial<Record<Pillar, PillarCopy>> = {};
    (Object.keys(metrics) as Pillar[]).forEach(p => {
      const bucket = metrics[p]?.bucket;
      if (bucket) {
        const c = bucketCopy[bucket]?.[lang];
        if (c) result[p] = { title: c.title, summary: c.summary };
      }
    });
    return result;
  }, [lang, metrics]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const retakeHref = hrefWithLang("/assessment", lang);
  const toolsHref = hrefWithLang("/tools", lang);
  const homeHref = hrefWithLang("/", lang);

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">
          {lang === "en" ? "Your snapshot" : "Tu panorama"}
        </h1>
        <p className="text-slate-700 mt-2">
          {lang === "en"
            ? "Here’s a quick read on your money picture. This isn’t a judgment—just a map for next steps."
            : "Un vistazo rápido a tu situación financiera. No es un juicio, sino una guía para los próximos pasos."}
        </p>

        {!hasAnswers && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-amber-900 font-medium">
              {lang === "en"
                ? "We couldn't find your assessment answers."
                : "No pudimos encontrar tus respuestas de la evaluación."}
            </p>
            <p className="text-slate-800 mt-1">
              {lang === "en"
                ? "Please retake the assessment to see your results."
                : "Vuelve a tomar la evaluación para ver tus resultados."}
            </p>
            <div className="mt-3">
              <Link href={retakeHref} className="underline">
                {lang === "en" ? "Retake assessment" : "Repetir evaluación"}
              </Link>
            </div>
          </div>
        )}

        {hasAnswers && (
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {(Object.keys(metrics) as Pillar[]).map((pillar) => {
              const metric = metrics[pillar];
              const copy = copies[pillar];
              const label = pillar.charAt(0).toUpperCase() + pillar.slice(1);
              return (
                <div key={pillar} className="rounded-xl border p-4 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <b className="capitalize">{label}</b>
                    <span className="text-sm text-slate-600">
                      {metric.raw} / {metric.max}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${Math.min(100, metric.pct)}%`, background: "#006a4e" }}
                    />
                  </div>
                  <div className="mt-3 text-sm text-slate-800">
                    <div className="font-semibold text-slate-900">
                      {copy?.title || (lang === "en" ? "Keep going" : "Sigue avanzando")}
                    </div>
                    <p className="mt-1 leading-relaxed">
                      {copy?.summary ||
                        (lang === "en"
                          ? "Your answers help us tailor next steps for this area."
                          : "Tus respuestas nos ayudan a personalizar los próximos pasos en esta área.")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href={toolsHref} className="px-4 py-2 rounded-xl border">
            {lang === "en" ? "Tools & resources" : "Herramientas y recursos"}
          </Link>
          <Link href={homeHref} className="px-4 py-2 rounded-xl text-white" style={{ background: "#006a4e" }}>
            {lang === "en" ? "Home" : "Inicio"}
          </Link>
          <Link href={retakeHref} className="px-4 py-2 rounded-xl underline">
            {lang === "en" ? "Retake assessment" : "Repetir evaluación"}
          </Link>
        </div>
      </div>
    </section>
  );
}
