import Link from "next/link";
import { hrefWithLang } from "@/lib/lang";

export default function Products() {
  return (
    <section className="py-6">
      <div className="rounded-3xl border bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-ink-900">Financial tools and learning</h1>
        <p className="mt-2 text-slate-700">This experience now focuses on practical next steps, tools, learning, and plain-language terms.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={hrefWithLang("/tools", "en")} className="rounded-xl bg-brand-500 px-4 py-2 text-center font-semibold text-white no-underline">Open tools</Link>
          <Link href={hrefWithLang("/resources", "en")} className="rounded-xl border px-4 py-2 text-center font-semibold no-underline">Open learning library</Link>
        </div>
      </div>
    </section>
  );
}
