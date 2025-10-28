import { Term } from "@/data/jargon";

export default function TermCard({ t, locale }:{ t: Term; locale: "en"|"es" }) {
  const title = locale==="en" ? t.term_en : t.term_es;
  const def = locale==="en" ? t.def_en : t.def_es;
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full border bg-brand-50 flex items-center justify-center" aria-hidden>💬</div>
        <div className="flex-1">
          <p className="font-semibold text-ink-900">{title}</p>
          <p className="text-sm text-slate-700 mt-1">{def}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {t.tags.map((tag,i)=>(
              <span key={i} className="text-xs rounded-full border px-2 py-0.5 bg-white text-slate-600">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
