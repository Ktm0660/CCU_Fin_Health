import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";

export default function Home() {
  const { locale } = useRouter();
  const L = (k:string)=>t((locale as any)||"en", k);

  return (
    <section>
      <div className="bg-gradient-to-br from-brand-100 to-white rounded-3xl p-6 md:p-10 mb-6 md:mb-8 border">
        <h1 className="text-2xl md:text-4xl font-semibold text-ink-900">{L("heroTitle")}</h1>
        <p className="mt-3 max-w-2xl text-slate-800">{L("heroBody")}</p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Link href="/assessment" className="px-5 py-3 rounded-xl bg-brand-500 text-white no-underline text-center">
            {L("getStarted")}
          </Link>
          <Link href="/resources" className="px-5 py-3 rounded-xl border no-underline text-center">
            {L("learnMore")}
          </Link>
        </div>
      </div>

      <h2 className="text-lg md:text-xl font-semibold text-ink-900 mb-3">{L("homeWhatYouGet")}</h2>
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card title={L("homeWhy1T")} body={L("homeWhy1B")} />
        <Card title={L("homeWhy2T")} body={L("homeWhy2B")} />
        <Card title={L("homeWhy3T")} body={L("homeWhy3B")} />
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border">
        <h3 className="font-semibold text-ink-900">{L("homeHowTitle")}</h3>
        <ol className="mt-3 list-decimal ml-6 space-y-1 text-slate-800">
          <li>{L("homeHow1")}</li>
          <li>{L("homeHow2")}</li>
          <li>{L("homeHow3")}</li>
        </ol>
        <div className="mt-4">
          <Link href="/assessment" className="px-5 py-3 rounded-xl bg-brand-500 text-white no-underline">
            {L("getStarted")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Card({title, body}:{title:string; body:string}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{body}</p>
    </div>
  );
}
