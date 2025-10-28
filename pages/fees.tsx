import { useRouter } from "next/router";

type Fee = { code: string; name_en: string; name_es: string; amount: string; when_en: string; when_es: string; notes_en?: string; notes_es?: string; };

const FEES: Fee[] = [
  { code: "NSF", name_en: "NSF / Overdraft", name_es: "Fondos insuficientes / Sobregiro", amount: "$XX.XX (example)", when_en: "When a payment exceeds your balance.", when_es: "Cuando un pago supera tu saldo.", notes_en: "Ask us about low-cost options and alerts.", notes_es: "Consúltanos opciones de bajo costo y alertas." },
  { code: "WIRE-OUT", name_en: "Outgoing Wire", name_es: "Transferencia saliente", amount: "$XX.XX", when_en: "Sending money domestically.", when_es: "Enviar dinero nacional." },
  { code: "CARD-REPLACE", name_en: "Card replacement", name_es: "Reposición de tarjeta", amount: "$X.XX", when_en: "Replacing a lost or damaged card.", when_es: "Reemplazo por pérdida o daño." },
  // TODO: fill with your actual fee schedule
];

export default function FeesPage() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const T = (en:string, es:string)=> locale==="en" ? en : es;

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {T("Transparent Fees", "Comisiones transparentes")}
      </h1>
      <p className="text-sm text-slate-700 mb-4">
        {T("No surprises. Here’s what fees are, when they apply, and how to avoid them.",
           "Sin sorpresas. Qué son las comisiones, cuándo aplican y cómo evitarlas.")}
      </p>

      <div className="overflow-auto bg-white rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">{T("Name","Nombre")}</th>
              <th className="text-left px-4 py-3">{T("Amount","Monto")}</th>
              <th className="text-left px-4 py-3">{T("When it applies","Cuándo aplica")}</th>
              <th className="text-left px-4 py-3">{T("Notes","Notas")}</th>
            </tr>
          </thead>
          <tbody>
            {FEES.map((f,i)=>(
              <tr key={i} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{f.code}</td>
                <td className="px-4 py-3">{locale==="en" ? f.name_en : f.name_es}</td>
                <td className="px-4 py-3">{f.amount}</td>
                <td className="px-4 py-3">{locale==="en" ? f.when_en : f.when_es}</td>
                <td className="px-4 py-3">{locale==="en" ? (f.notes_en ?? "") : (f.notes_es ?? "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600 mt-3">
        {T("We try to reduce fees where possible and offer ways to avoid them (alerts, autopay, counseling).",
           "Buscamos reducir comisiones y ofrecer formas de evitarlas (alertas, pagos automáticos, asesoría).")}
      </p>
    </section>
  );
}
