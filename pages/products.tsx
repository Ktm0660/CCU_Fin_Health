export default function Products() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-ink-900">Connections CU Products (Optional)</h1>
      <p className="text-sm text-slate-700">
        These are here only if they help you. No pressure, ever. Transparent fees, bilingual support.
      </p>
      <ul className="grid md:grid-cols-2 gap-4">
        <li className="bg-white rounded-2xl shadow p-4 border">
          <h3 className="font-semibold text-ink-900">Fresh Start Checking</h3>
          <p className="text-sm">Low-fee account with guardrails to help build positive history.</p>
        </li>
        <li className="bg-white rounded-2xl shadow p-4 border">
          <h3 className="font-semibold text-ink-900">Small-Dollar Bridge Loan</h3>
          <p className="text-sm">Fast, transparent alternative to payday loans. No surprises.</p>
        </li>
        <li className="bg-white rounded-2xl shadow p-4 border">
          <h3 className="font-semibold text-ink-900">ITIN Auto/Signature Lending</h3>
          <p className="text-sm">Purpose-built lending with fair rates and friendly support.</p>
        </li>
        <li className="bg-white rounded-2xl shadow p-4 border">
          <h3 className="font-semibold text-ink-900">12-Month Savings Builder</h3>
          <p className="text-sm">Automated deposits; unlocks bonus when 10+ on-time months.</p>
        </li>
      </ul>
    </section>
  );
}
