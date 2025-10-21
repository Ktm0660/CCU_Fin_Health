import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers, guidance } from "@/data/assessment";
import Link from "next/link";

function Stat({ label, value, max }: { label:string; value:number; max:number }) {
  const pct = Math.round((value / Math.max(1,max)) * 100);
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-ink-900">{label}</h3>
        <span className="text-sm text-slate-600">{value} / {max} ({pct}%)</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Results() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const ans = useMemo(() => {
    try { return JSON.parse((router.query.a as string) || "{}"); }
    catch { return {}; }
  }, [router.query.a]);

  const s = scoreAnswers(ans);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {locale==="en" ? "Your Financial Health Scores" : "Tus puntajes de salud financiera"}
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Stat label="Habits" value={s.habits} max={s.maxHabits} />
        <Stat label="Confidence" value={s.confidence} max={s.maxConfidence} />
        <Stat label="Stability" value={s.stability} max={s.maxStability} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 border mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink-900">
            {locale==="en" ? "Overall Score" : "Puntaje total"}
          </h2>
          <span className="text-sm text-slate-700">{s.total} / {s.totalMax} ({Math.round((s.total/Math.max(1,s.totalMax))*100)}%)</span>
        </div>
        <p className="text-sm text-slate-700 mt-2">
          {locale==="en"
            ? "This number is a quick snapshot to guide next steps—not a judgment."
            : "Este número es una guía para los próximos pasos—no un juicio."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Dim title="Habits" body={guidance("habits", s.habits)} />
        <Dim title="Confidence" body={guidance("confidence", s.confidence)} />
        <Dim title="Stability" body={guidance("stability", s.stability)} />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        {locale==="en" ? "Helpful next steps" : "Próximos pasos útiles"}
      </h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>{locale==="en" ? "Create a mini emergency fund ($100–$300) with an automatic deposit." : "Crea un fondo de emergencia pequeño ($100–$300) con depósito automático."}</li>
        <li>{locale==="en" ? "Set bills to autopay minimums; pick one monthly pay-down day." : "Activa pagos automáticos mínimos; elige un día al mes para avanzar pagos."}</li>
        <li>{locale==="en" ? "Use a simple spending list that puts needs before wants." : "Usa una lista de gastos que ponga necesidades antes que gustos."}</li>
      </ul>

      <div className="mt-6 flex gap-3">
        <Link href="/resources" className="px-4 py-2 rounded-xl border no-underline">
          {locale==="en" ? "Tools & Resources" : "Herramientas y recursos"}
        </Link>
        <Link href="/products" className="px-4 py-2 rounded-xl bg-brand-500 text-white no-underline">
          {locale==="en" ? "Explore CU Products (Optional)" : "Explorar productos (Opcional)"}
        </Link>
      </div>
    </section>
  );
}

function Dim({title, body}:{title:string; body:string}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="text-sm mt-2">{body}</p>
    </div>
  );
}
