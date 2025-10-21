import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";

export default function Home() {
  const { locale } = useRouter();
  const L = (k:string)=>t((locale as any)||"en", k);

  return (
    <section>
      <div className="bg-gradient-to-br from-brand-100 to-white rounded-3xl p-8 md:p-12 mb-8 border">
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900">{L("heroTitle")}</h1>
        <p className="mt-3 max-w-2xl">{L("heroBody")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/assessment" className="px-5 py-3 rounded-xl bg-brand-500 text-white no-underline hover:bg-brand-600">
            {L("getStarted")}
          </Link>
          <Link href="/resources" className="px-5 py-3 rounded-xl border no-underline">
            {L("learnMore")}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="No pressure" body="Use the tools even if you never open an account."/>
        <Card title="Clear & transparent" body="Plain-language guidance and fees explained."/>
        <Card title="Bilingual help" body="Switch languages any time. We’ll meet you where you are."/>
      </div>
    </section>
  );
}

function Card({title, body}:{title:string; body:string}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{body}</p>
    </div>
  );
}
