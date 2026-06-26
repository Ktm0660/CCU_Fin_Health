import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { educationResources, pick, type PathwayId } from "@/data/guide";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

const categories = Array.from(new Map(educationResources.map(r => [r.category.en, r.category])).values());

export default function ResourcesPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const T = (en: string, es: string) => lang === "es" ? es : en;

  useEffect(() => setLang(getLangFromQueryOrStorage()), [router.query.lang]);

  const list = useMemo(() => educationResources.filter(r => {
    const hay = `${pick(r.title, lang)} ${pick(r.summary, lang)} ${pick(r.category, lang)} ${r.relatedTerms.join(" ")}`.toLowerCase();
    return (category === "all" || r.category.en === category) && (!query.trim() || hay.includes(query.toLowerCase()));
  }), [category, query, lang]);

  return (
    <section className="py-6">
      <div className="rounded-3xl border bg-white p-5 shadow md:p-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Learning library", "Biblioteca de aprendizaje")}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">{T("Short guides for the job you need to do", "Guías cortas para lo que necesitas hacer")}</h1>
        <p className="mt-3 text-slate-700">{T("No long lessons unless you want them. Start with what matters right now.", "Sin lecciones largas a menos que las quieras. Empieza con lo que importa ahora.")}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <input value={query} onChange={e => setQuery(e.target.value)} className="rounded-xl border px-3 py-3" placeholder={T("Search guides or terms…", "Buscar guías o términos…")} />
          <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border px-3 py-3">
            <option value="all">{T("All categories", "Todas las categorías")}</option>
            {categories.map(c => <option key={c.en} value={c.en}>{pick(c, lang)}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map(r => <article id={r.id} key={r.id} className="scroll-mt-24 rounded-3xl border bg-white p-5 shadow-soft">
          <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full border bg-brand-50 px-2 py-1 text-brand-700">{r.format}</span><span className="rounded-full border bg-slate-50 px-2 py-1">{pick(r.estimatedTime, lang)}</span></div>
          <h2 className="mt-3 text-xl font-semibold text-ink-900">{pick(r.title, lang)}</h2>
          <p className="mt-2 text-slate-700">{pick(r.summary, lang)}</p>
          <div className="mt-4 grid gap-3 text-sm">
            <Info label={T("What this means", "Qué significa")} body={pick(r.whatYouWillLearn[0], lang)} />
            <Info label={T("When this matters", "Cuándo importa")} body={pick(r.whatYouWillLearn[1], lang)} />
            <Info label={T("What to do now", "Qué hacer ahora")} body={pick(r.actionStep, lang)} />
            <Info label={T("Common mistake to avoid", "Error común a evitar")} body={T("Trying to solve everything at once instead of choosing one next step.", "Intentar resolver todo de una vez en vez de elegir un próximo paso.")} />
            <Info label={T("Question to ask", "Pregunta para usar")} body={T("Can you explain what matters most for my next step?", "¿Puedes explicar qué importa más para mi próximo paso?")} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{r.relatedTerms.map(t => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div>
          {r.format === "video" && <p className="mt-3 text-sm text-slate-600">{T("Video resource to be added.", "Recurso de video por agregar.")}</p>}
        </article>)}
      </div>
    </section>
  );
}
function Info({ label, body }: { label: string; body: string }) { return <div><h3 className="font-semibold text-ink-900">{label}</h3><p className="text-slate-700">{body}</p></div>; }
