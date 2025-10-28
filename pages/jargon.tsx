import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { terms, Term } from "@/data/jargon";
import TermCard from "@/components/TermCard";

export default function JargonPage() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const base = [...terms];
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      return base.filter(t =>
        t.term_en.toLowerCase().includes(needle) ||
        t.term_es.toLowerCase().includes(needle) ||
        t.def_en.toLowerCase().includes(needle) ||
        t.def_es.toLowerCase().includes(needle) ||
        t.tags.join(" ").toLowerCase().includes(needle)
      );
    }
    return base;
  }, [q]);

  const T = (en:string, es:string)=> locale==="en" ? en : es;

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {T("Jargon Breakdown", "Traducción de jerga")}
      </h1>
      <p className="text-sm text-slate-700 mb-4">
        {T("We translate financial terms into plain language—so decisions feel clear.",
           "Traducimos términos financieros a lenguaje simple—para decidir con claridad.")}
      </p>

      <div className="bg-white rounded-2xl border p-3 mb-4">
        <label className="text-xs text-slate-600">{T("Search terms","Buscar términos")}</label>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder={T("e.g., APR, overdraft, ITIN…","ej.: APR, sobregiro, ITIN…")}
          className="mt-1 w-full md:w-96 px-3 py-2 rounded-lg border"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map(t => <TermCard key={t.id} t={t} locale={locale} />)}
      </div>
    </section>
  );
}
