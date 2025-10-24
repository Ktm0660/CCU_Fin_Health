import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function Nav() {
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="no-underline font-semibold text-ink-900 mr-3 shrink-0"
        >
          Connections
        </Link>

        {/* link row; allow horizontal scroll on tiny screens so items never overlap brand */}
        <div className="flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap">
          <Link href="/" className="no-underline text-ink-900 hover:underline">
            {t(locale, "nav.home")}
          </Link>
          <Link href="/assessment" className="no-underline text-ink-900 hover:underline">
            {t(locale, "nav.assessment")}
          </Link>
          <Link href="/resources" className="no-underline text-ink-900 hover:underline">
            {t(locale, "nav.resources")}
          </Link>
          <Link href="/products" className="no-underline text-ink-900 hover:underline">
            {t(locale, "nav.products")}
          </Link>
          <LanguageToggle className="shrink-0" />
        </div>
      </div>
    </nav>
  );
}
