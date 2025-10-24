import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";

export default function Footer() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-700 grid md:grid-cols-3 gap-6">
        <div>
          <p className="font-semibold text-ink-900">Connections</p>
          <p className="mt-1">
            {locale==="en"
              ? "Serving rural Idaho with judgment-free guidance."
              : "Sirviendo a Idaho rural con orientación sin juicios."}
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink-900">{t(locale,"nav.explore")}</p>
          <ul className="mt-2 space-y-1">
            <li><Link className="no-underline" href="/assessment">{t(locale,"nav.assessment")}</Link></li>
            <li><Link className="no-underline" href="/resources">{t(locale,"nav.resources")}</Link></li>
            <li><Link className="no-underline" href="/products">{t(locale,"nav.products")}</Link></li>
            <li><Link className="no-underline" href="/results">{t(locale,"nav.results")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-900">{t(locale,"nav.getHelp")}</p>
          <ul className="mt-2 space-y-1">
            <li><Link className="no-underline" href="/plan">{t(locale,"nav.plan")}</Link></li>
            <li><Link className="no-underline" href="/resources#counseling">{t(locale,"nav.counseling")}</Link></li>
            <li><Link className="no-underline" href="/resources#mobile">{t(locale,"nav.mobileUnit")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-3 text-xs text-center text-slate-500">
        © {new Date().getFullYear()} Connections Credit Union
      </div>
    </footer>
  );
}
