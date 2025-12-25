import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";

export default function Nav() {
  const router = useRouter();
  const [locale, setLocale] = useState<Lang>((router.locale as Lang) || "en");

  useEffect(() => {
    const detected = typeof window !== "undefined" ? getLangFromQueryOrStorage() : (router.locale as Lang) || "en";
    setLocale(detected);
  }, [router.locale]);

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-40 motion-safe:animate-fade-in">
      <div className="mx-auto max-w-3xl md:max-w-4xl px-4 py-2.5 flex items-center justify-between">
          <Link
            href={hrefWithLang("/", locale)}
            className="no-underline font-semibold text-ink-900 mr-2 shrink-0 hover:text-brand-500 transition"
          >
            Connections
          </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
            <Link href={hrefWithLang("/", locale)} className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.home")}</Link>
            <div className="flex items-center gap-2">
              <Link href={hrefWithLang("/assessment", locale)} className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.assessment")}</Link>
              <Link href={hrefWithLang("/assessment-v2", locale)} className="text-sm opacity-80 hover:opacity-100">
                {locale==="es" ? "Evaluación (Beta)" : "Assessment (Beta)"}
              </Link>
            </div>
            <Link href={hrefWithLang("/resources", locale)} className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.resources")}</Link>
            <Link href={hrefWithLang("/products", locale)} className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.products")}</Link>
            <Link href={hrefWithLang("/glossary", locale)} className="no-underline text-ink-900 hover:text-brand-500">{t(locale,"nav.glossary")}</Link>
          <LanguageToggle />
        </div>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </nav>
  );
}
