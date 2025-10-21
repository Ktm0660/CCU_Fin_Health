import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers, guidance } from "@/data/assessment";
import HealthRadar from "@/components/Radar";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function Results() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const ans = useMemo(() => {
    try { return JSON.parse((router.query.a as string) || "{}"); }
    catch { return {}; }
  }, [router.query.a]);

  const s = scoreAnswers(ans);
  const data = [
    { subject: t(locale,"habits"), value: s.habits },
    { subject: t(locale,"confidence"), value: s.confidence },
    { subject: t(locale,"stability"), value: s.stability }
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">{t(locale,"scoreTitle")}</h1>
      <HealthRadar data={data} />
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Dim title={t(locale,"habits")} body={guidance("habits", s.habits)} />
        <Dim title={t(locale,"confidence")} body={guidance("confidence", s.confidence)} />
        <Dim title={t(locale,"stability")} body={guidance("stability", s.stability)} />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">{t(locale,"nextSteps")}</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Create a mini emergency fund ($100-$300) using an automatic rule.</li>
        <li>Set bills to autopay minimums; add a “pay-down” day monthly.</li>
        <li>Use a cash-friendly spending list (needs first, wants later).</li>
      </ul>

      <div className="mt-6 flex gap-3">
        <Link href="/resources" className="px-4 py-2 rounded-xl border no-underline">Tools & Resources</Link>
        <Link href="/products" className="px-4 py-2 rounded-xl bg-brand-500 text-white no-underline">Explore CU Products (Optional)</Link>
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
