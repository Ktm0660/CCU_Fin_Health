import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { glossaryTerms } from "@/data/guide";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

export default function Glossary() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [query, setQuery] = useState("");
  const T = (en: string, es: string) => lang === "es" ? es : en;
  useEffect(() => setLang(getLangFromQueryOrStorage()), [router.query.lang]);
  const list = useMemo(() => glossaryTerms.filter(t => `${t.term} ${t.spanishTerm} ${t.plainEnglish}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => a.term.localeCompare(b.term)), [query]);
  return <section className="py-6">
    <div className="rounded-3xl border bg-white p-5 shadow md:p-7">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Financial terms translator", "Traductor de términos financieros")}</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink-900">{T("Plain-language money terms", "Términos de dinero en lenguaje claro")}</h1>
      <p className="mt-3 text-slate-700">{T("For anyone who wants financial words explained without jargon.", "Para cualquier persona que quiere palabras financieras sin jerga.")}</p>
      <input value={query} onChange={e => setQuery(e.target.value)} className="mt-5 w-full rounded-xl border px-3 py-3" placeholder={T("Search a term…", "Buscar un término…")} />
    </div>
    <div className="mt-5 grid gap-4">
      {list.map(term => <article id={term.id} key={term.id} className="scroll-mt-24 rounded-3xl border bg-white p-5 shadow-soft">
        <h2 className="text-2xl font-semibold text-ink-900">{lang === "es" ? term.spanishTerm : term.term}</h2>
        <p className="mt-2 text-lg text-slate-800">{lang === "es" ? term.spanishPlainLanguageExplanation : term.plainEnglish}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Info label={T("Why it matters", "Por qué importa")} body={term.whyItMatters} />
          <Info label={T("Example", "Ejemplo")} body={term.example} />
          <Info label={T("Watch out for", "Ten cuidado con")} body={term.watchOutFor} />
          <Info label={T("Question to ask", "Pregunta para hacer")} body={term.questionToAsk} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{term.relatedTerms.map(t => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div>
      </article>)}
    </div>
  </section>;
}
function Info({ label, body }: { label: string; body: string }) { return <div><h3 className="font-semibold text-ink-900">{label}</h3><p className="text-slate-700">{body}</p></div>; }
