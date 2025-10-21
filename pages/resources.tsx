export default function Resources() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-ink-900">Tools & Resources</h1>
      <Card title="Starter Budget (Printable)" href="https://www.consumerfinance.gov/consumer-tools/budgeting/" />
      <Card title="Emergency Fund Planner" href="https://www.consumer.gov/" />
      <Card title="Credit Report Access" href="https://www.annualcreditreport.com" />
      <Card title="Debt Snowball vs Avalanche explainer" href="https://www.investopedia.com/debt-snowball-vs-debt-avalanche-4800074" />
      <p className="text-sm text-slate-600">
        These are neutral, education-first links. We’ll add more local and bilingual resources later.
      </p>
    </section>
  );
}
function Card({title, href}:{title:string; href:string}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="block bg-white rounded-2xl shadow p-4 border no-underline">
      <span className="font-medium text-ink-900">{title}</span>
    </a>
  );
}
