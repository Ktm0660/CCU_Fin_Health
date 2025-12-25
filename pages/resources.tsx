import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { resources, Resource, Area, RType, rTitle } from "@/data/resources";
import ResourceCard from "@/components/ResourceCard";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

const AREAS: { key: Area|"all"; en: string; es: string }[] = [
  { key: "all", en: "All topics", es: "Todos los temas" },
  { key: "stability", en: "Stability", es: "Estabilidad" },
  { key: "habits", en: "Habits", es: "Hábitos" },
  { key: "confidence", en: "Confidence", es: "Confianza" },
  { key: "trust", en: "Trust & Access", es: "Confianza y acceso" },
];

const TYPES: { key: RType|"all"; en: string; es: string }[] = [
  { key: "all", en: "All types", es: "Todos los tipos" },
  { key: "explainer", en: "Explainers", es: "Explicadores" },
  { key: "tool", en: "Tools", es: "Herramientas" },
  { key: "download", en: "Downloads", es: "Descargas" },
  { key: "video", en: "Videos", es: "Videos" },
  { key: "product", en: "Products", es: "Productos" },
];

export default function ResourcesPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Lang>((router.query.lang === "es" ? "es" : (router.locale as Lang)) || "en");
  const [area, setArea] = useState<Area|"all">("all");
  const [type, setType] = useState<RType|"all">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    setLocale(getLangFromQueryOrStorage());
  }, [router.locale, router.query.lang]);

  const list = useMemo(() => {
    let base = resources.filter(r => r.locale === "both" || r.locale === locale);
    if (area !== "all") base = base.filter(r => r.area.includes(area));
    if (type !== "all") base = base.filter(r => r.type === type);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      base = base.filter(r =>
        rTitle(r, locale).toLowerCase().includes(needle) ||
        r.summary_en.toLowerCase().includes(needle) ||
        r.summary_es.toLowerCase().includes(needle) ||
        r.tags.join(" ").toLowerCase().includes(needle)
      );
    }
    base.sort((a,b)=> rTitle(a,locale).localeCompare(rTitle(b,locale)));
    return base;
  }, [area, type, q, locale]);

  const T = (en:string, es:string)=> locale==="en" ? en : es;

  return (
    <section className="py-6 motion-safe:animate-fade-in">
      <div className="max-w-3xl md:max-w-4xl mx-auto px-4">
        <h1 className="text-[28px] md:text-4xl leading-tight font-bold text-ink-900 mt-1 mb-1.5">
          {T("Tools & Resources", "Herramientas y recursos")}
        </h1>
        <p className="text-slate-700 mb-4 md:mb-6">
          {T(
            "Plain-language guides and tools. Filter by topic or type.",
            "Guías y herramientas en lenguaje simple. Filtra por tema o tipo."
          )}
        </p>

        {/* Filters */}
        <div className="bg-white rounded-2xl border shadow-soft p-3 md:p-5 mb-4 md:mb-6 sticky top-[56px] z-10 md:static md:top-auto backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="text-xs text-slate-600">{T("Topic","Tema")}</label>
              <div className="flex gap-2 overflow-x-auto md:flex-wrap pb-1 -mx-1 px-1 mt-1">
                {AREAS.map(a=>(
                  <button
                    key={a.key as string}
                    onClick={()=>setArea(a.key as Area|"all")}
                    className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition ${
                      area===a.key
                        ? "bg-brand-500 text-white border-brand-500 shadow-soft"
                        : "bg-white text-ink-900 hover:border-brand-300"
                    }`}
                  >
                    {T(a.en,a.es)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600">{T("Type","Tipo")}</label>
              <div className="flex gap-2 overflow-x-auto md:flex-wrap pb-1 -mx-1 px-1 mt-1">
                {TYPES.map(t=>(
                  <button
                    key={t.key as string}
                    onClick={()=>setType(t.key as RType|"all")}
                    className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition ${
                      type===t.key
                        ? "bg-ink-900 text-white border-ink-900 shadow-soft"
                        : "bg-white text-ink-900 hover:border-brand-300"
                    }`}
                  >
                    {T(t.en,t.es)}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:ml-auto">
              <label className="text-xs text-slate-600">{T("Search","Buscar")}</label>
              <input
                value={q}
                onChange={e=>setQ(e.target.value)}
                placeholder={T("Search resources…","Buscar recursos…")}
                className="mt-1 w-full md:w-64 px-3 py-2.5 rounded-xl border bg-white/90 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="grid md:grid-cols-3 gap-4">
          {list.map(r=> <ResourceCard key={r.id} r={r} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}
