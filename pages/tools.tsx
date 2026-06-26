import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

type Bill = { name: string; amount: number; due: string };
type Debt = { name: string; balance: number; minimum: number; apr: number };

export default function ToolsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [tool, setTool] = useState("bill-calendar");
  const T = (en: string, es: string) => lang === "es" ? es : en;
  useEffect(() => { setLang(getLangFromQueryOrStorage()); if (typeof router.query.tool === "string") setTool(router.query.tool); }, [router.query.tool, router.query.lang]);
  return <section className="py-6">
    <div className="rounded-3xl border bg-white p-5 shadow md:p-7">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Practical tools", "Herramientas prácticas")}</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink-900">{T("Use what helps right now", "Usa lo que ayuda ahora")}</h1>
      <p className="mt-3 text-slate-700">{T("These tools do not ask for account numbers, Social Security numbers, or login information.", "Estas herramientas no piden números de cuenta, Seguro Social ni inicio de sesión.")}</p>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {[ ["bill-calendar", T("Bill calendar", "Calendario")], ["debt-payoff", T("Debt planner", "Deuda")], ["emergency-buffer", T("Buffer planner", "Colchón")], ["credit-checklist", T("Credit checklist", "Crédito")], ["conversation-script", T("Script builder", "Frases")] ].map(([id, label]) => <button key={id} onClick={() => setTool(id)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm ${tool === id ? "bg-brand-500 text-white" : "bg-white"}`}>{label}</button>)}
      </div>
    </div>
    <div className="mt-5">{tool === "bill-calendar" ? <BillCalendar lang={lang} /> : tool === "debt-payoff" ? <DebtPlanner lang={lang} /> : tool === "emergency-buffer" ? <BufferPlanner lang={lang} /> : tool === "credit-checklist" ? <CreditChecklist lang={lang} /> : <ConversationScript lang={lang} />}</div>
  </section>;
}

function BillCalendar({ lang }: { lang: Lang }) {
  const T = (en: string, es: string) => lang === "es" ? es : en;
  const [payDate, setPayDate] = useState(""); const [payAmount, setPayAmount] = useState(0); const [bills, setBills] = useState<Bill[]>([{ name: "", amount: 0, due: "" }]);
  const beforePayday = bills.filter(b => b.due && (!payDate || b.due <= payDate)); const total = beforePayday.reduce((s,b)=>s+(Number(b.amount)||0),0);
  return <Tool title={T("Bill calendar / paycheck planner", "Calendario de cuentas / plan de pago")}>
    <div className="grid gap-3 md:grid-cols-2"><Input label={T("Next paycheck date", "Próximo pago")} value={payDate} onChange={v=>setPayDate(String(v))} type="date" /><Input label={T("Paycheck amount (optional)", "Cantidad del pago (opcional)")} value={payAmount} onChange={v=>setPayAmount(Number(v))} type="number" /></div>
    <Rows bills={bills} setBills={setBills} lang={lang} />
    <Output>{T("Before next payday, plan for:", "Antes del próximo pago, planifica:")} <strong>${total.toFixed(2)}</strong>{payAmount ? ` · ${T("Estimated left after these bills", "Estimado restante después")}: $${(payAmount-total).toFixed(2)}` : ""}</Output>
  </Tool>;
}
function DebtPlanner({ lang }: { lang: Lang }) {
  const T = (en: string, es: string) => lang === "es" ? es : en;
  const [debts, setDebts] = useState<Debt[]>([{ name: "", balance: 0, minimum: 0, apr: 0 }]);
  const snowball = [...debts].sort((a,b)=>a.balance-b.balance)[0]; const avalanche = [...debts].sort((a,b)=>b.apr-a.apr)[0];
  return <Tool title={T("Debt payoff planner", "Planificador de pago de deuda")}>
    {debts.map((d,i)=><div key={i} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-4"><Input label={T("Debt name", "Nombre")} value={d.name} onChange={v=>setDebts(p=>p.map((x,n)=>n===i?{...x,name:String(v)}:x))} /><Input label={T("Balance", "Saldo")} value={d.balance} onChange={v=>setDebts(p=>p.map((x,n)=>n===i?{...x,balance:Number(v)}:x))} type="number" /><Input label={T("Minimum", "Mínimo")} value={d.minimum} onChange={v=>setDebts(p=>p.map((x,n)=>n===i?{...x,minimum:Number(v)}:x))} type="number" /><Input label="APR" value={d.apr} onChange={v=>setDebts(p=>p.map((x,n)=>n===i?{...x,apr:Number(v)}:x))} type="number" /></div>)}
    <button onClick={()=>setDebts([...debts,{name:"",balance:0,minimum:0,apr:0}])} className="rounded-xl border px-3 py-2">{T("Add debt", "Agregar deuda")}</button>
    <Output>{T("Snowball starts with smallest balance:", "Bola de nieve empieza con saldo menor:")} <strong>{snowball?.name || T("add a debt", "agrega una deuda")}</strong><br />{T("Avalanche starts with highest APR:", "Avalancha empieza con APR más alto:")} <strong>{avalanche?.name || T("add APR", "agrega APR")}</strong></Output>
  </Tool>;
}
function BufferPlanner({ lang }: { lang: Lang }) { const T = (en:string,es:string)=>lang==="es"?es:en; const [goal,setGoal]=useState(100); const [checks,setChecks]=useState(4); return <Tool title={T("Emergency buffer planner", "Planificador de colchón") }><div className="grid gap-3 md:grid-cols-2"><Input label={T("Starter goal", "Meta inicial")} value={goal} onChange={v=>setGoal(Number(v))} type="number" /><Input label={T("Number of paychecks", "Número de pagos")} value={checks} onChange={v=>setChecks(Number(v))} type="number" /></div><div className="flex gap-2"><button onClick={()=>setGoal(100)} className="rounded-xl border px-3 py-2">$100</button><button onClick={()=>setGoal(300)} className="rounded-xl border px-3 py-2">$300</button></div><Output>{T("Save per paycheck:", "Ahorra por pago:")} <strong>${(goal/Math.max(1,checks)).toFixed(2)}</strong></Output></Tool>; }
function CreditChecklist({ lang }: { lang: Lang }) { const T=(en:string,es:string)=>lang==="es"?es:en; const items=[T("Use a trusted free credit report source.","Usa una fuente confiable para reporte gratis."),T("Checking your own report does not hurt your score.","Revisar tu propio reporte no afecta tu puntaje."),T("Look for names, addresses, accounts, missed payments, and collections you do not recognize.","Busca nombres, direcciones, cuentas, atrasos y colecciones que no reconoces."),T("Write down questions before disputing or making decisions.","Escribe preguntas antes de disputar o decidir.")]; return <Tool title={T("Credit report checklist", "Lista para reporte de crédito")}>{items.map(i=><label key={i} className="flex gap-3 rounded-2xl border p-3"><input type="checkbox" /> <span>{i}</span></label>)}</Tool>; }
function ConversationScript({ lang }: { lang: Lang }) { const T=(en:string,es:string)=>lang==="es"?es:en; const [topic,setTopic]=useState("bills"); const phrase=useMemo(()=>({ bills:T("Can you help me put these bills in order by what needs attention first?","¿Me ayudas a ordenar estas cuentas por lo que necesita atención primero?"), debt:T("Can you help me organize this debt list and choose a method that fits my cash flow?","¿Me ayudas a organizar esta lista de deudas y elegir un método que encaje con mi flujo?"), credit:T("Can you explain what this credit report item means in plain language?","¿Puedes explicar en palabras simples qué significa este elemento del reporte?"), saving:T("What small amount could I set aside without creating more stress?","¿Qué cantidad pequeña podría apartar sin crear más estrés?"), leaks:T("Can you help me spot one charge I can prevent next time?","¿Me ayudas a encontrar un cargo que pueda prevenir la próxima vez?"), business:T("Can you help me separate what belongs to the business from what I can use personally?","¿Me ayudas a separar lo del negocio de lo que puedo usar personalmente?"), general:T("I do not need a sales pitch. I need help understanding my next step in plain language.","No necesito una venta. Necesito entender mi próximo paso en palabras simples.") }[topic] || ""),[topic,lang]); return <Tool title={T("Conversation script builder", "Creador de frases") }><select value={topic} onChange={e=>setTopic(e.target.value)} className="rounded-xl border px-3 py-3"><option value="bills">{T("Bills","Cuentas")}</option><option value="debt">{T("Debt","Deuda")}</option><option value="credit">{T("Credit","Crédito")}</option><option value="saving">{T("Saving","Ahorro")}</option><option value="leaks">{T("Money leaks","Fugas")}</option><option value="business">{T("Business","Negocio")}</option><option value="general">{T("General","General")}</option></select><Output>“{phrase}”</Output></Tool>; }
function Tool({ title, children }: { title: string; children: React.ReactNode }) { return <div className="space-y-4 rounded-3xl border bg-white p-5 shadow md:p-7"><h2 className="text-2xl font-semibold text-ink-900">{title}</h2>{children}</div>; }
function Input({ label, value, onChange, type="text" }: { label: string; value: string|number; onChange: (v: string|number)=>void; type?: string }) { return <label className="grid gap-1 text-sm"><span className="font-medium text-slate-700">{label}</span><input value={value} type={type} onChange={e=>onChange(e.target.value)} className="rounded-xl border px-3 py-2" /></label>; }
function Output({ children }: { children: React.ReactNode }) { return <div className="rounded-2xl bg-brand-50 p-4 text-slate-800">{children}</div>; }
function Rows({ bills, setBills, lang }: { bills: Bill[]; setBills: (b: Bill[])=>void; lang: Lang }) { const T=(en:string,es:string)=>lang==="es"?es:en; return <div className="space-y-2">{bills.map((b,i)=><div key={i} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-3"><Input label={T("Bill", "Cuenta")} value={b.name} onChange={v=>setBills(bills.map((x,n)=>n===i?{...x,name:String(v)}:x))} /><Input label={T("Amount", "Cantidad")} value={b.amount} onChange={v=>setBills(bills.map((x,n)=>n===i?{...x,amount:Number(v)}:x))} type="number" /><Input label={T("Due date", "Fecha")} value={b.due} onChange={v=>setBills(bills.map((x,n)=>n===i?{...x,due:String(v)}:x))} type="date" /></div>)}<button onClick={()=>setBills([...bills,{name:"",amount:0,due:""}])} className="rounded-xl border px-3 py-2">{T("Add bill", "Agregar cuenta")}</button></div>; }
