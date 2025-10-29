import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";

export default function Nav() {
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-40 motion-safe:animate-fade-in">
      <div className="mx-auto max-w-3xl md:max-w-4xl px-4 py-2.5 flex items-center justify-between">
        <Link
          href="/"
          className="no-underline font-semibold text-ink-900 mr-2 shrink-0 hover:text-brand-500 transition"
        >
          Connections
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/" className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.home")}</Link>
          <div className="flex items-center gap-2">
            <Link href="/assessment" className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.assessment")}</Link>
            <Link href="/assessment-v2" className="text-sm opacity-80 hover:opacity-100">
              {locale==="es" ? "Evaluación (Beta)" : "Assessment (Beta)"}
            </Link>
          </div>
          <Link href="/resources" className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.resources")}</Link>
          <Link href="/products" className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.products")}</Link>
          <Link href="/glossary" className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.glossary")}</Link>
          <LanguageToggle />
        </div>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </nav>
  );
}
