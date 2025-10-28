import { Resource, rTitle, rSummary } from "@/data/resources";

export default function ResourceCard({ r, locale }:{ r: Resource; locale: "en"|"es" }) {
  const badge = (type: Resource["type"]) =>
    type === "tool" ? "bg-sky-50 text-sky-700 border-sky-200" :
    type === "explainer" ? "bg-amber-50 text-amber-700 border-amber-200" :
    type === "download" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    type === "video" ? "bg-violet-50 text-violet-700 border-violet-200" :
    "bg-brand-50 text-brand-700 border-brand-200";

  return (
    <div className="bg-white border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full border bg-brand-50 flex items-center justify-center text-sm" aria-hidden>🧩</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs leading-none ${badge(r.type)}`}>
              {r.type}
            </span>
            {r.tags.slice(0,3).map((t,i)=>(
              <span key={i} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-white text-slate-600 leading-none">{t}</span>
            ))}
          </div>
          <p className="text-lg font-semibold text-ink-900 leading-snug">{rTitle(r, locale)}</p>
          <p className="text-sm text-slate-700 mt-1">{rSummary(r, locale)}</p>
          <div className="mt-3">
            <a
              href={r.href}
              className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm no-underline text-ink-900 hover:bg-slate-50"
              target={r.href.startsWith("http") ? "_blank" : "_self"}
              rel="noreferrer"
            >
              {locale==="en" ? "Open" : "Abrir"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
