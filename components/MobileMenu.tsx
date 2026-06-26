import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [locale, setLocale] = useState<Lang>((router.locale as Lang) || "en");

  useEffect(() => {
    const detected = typeof window !== "undefined" ? getLangFromQueryOrStorage() : (router.locale as Lang) || "en";
    setLocale(detected);
  }, [router.locale]);

  return (
    <>
      <button
        aria-label="Open menu"
        className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border bg-white"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Menu</span>
        <div className="space-y-[3px]">
          <span className="block h-[2px] w-6 bg-ink-900"></span>
          <span className="block h-[2px] w-6 bg-ink-900"></span>
          <span className="block h-[2px] w-6 bg-ink-900"></span>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-[360px] bg-white shadow-xl border-l p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink-900">Connections</span>
              <button
                aria-label="Close menu"
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border bg-white"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

              <nav className="mt-4 flex-1">
                <ul className="space-y-2 text-base">
                <li><Link className="no-underline block px-2 py-2 rounded-lg hover:bg-brand-50" href={hrefWithLang("/", locale)}>{t(locale,"nav.home")}</Link></li>
                <li><Link className="no-underline block px-2 py-2 rounded-lg hover:bg-brand-50" href={hrefWithLang("/assessment", locale)}>{locale==="es" ? "Revisión" : "Check-in"}</Link></li>
                <li><Link className="no-underline block px-2 py-2 rounded-lg hover:bg-brand-50" href={hrefWithLang("/resources", locale)}>{t(locale,"nav.resources")}</Link></li>
                <li><Link className="no-underline block px-2 py-2 rounded-lg hover:bg-brand-50" href={hrefWithLang("/glossary", locale)}>{t(locale,"nav.glossary")}</Link></li>
                <li><Link className="no-underline block px-2 py-2 rounded-lg hover:bg-brand-50" href={hrefWithLang("/tools", locale)}>{locale==="es" ? "Herramientas" : "Tools"}</Link></li>
                <li><Link className="no-underline block px-2 py-2 rounded-lg hover:bg-brand-50" href={hrefWithLang("/results", locale)}>{locale==="es" ? "Plan guardado" : "Saved plan"}</Link></li>
                </ul>
              </nav>

            <div className="pt-3 border-t">
              <LanguageToggle className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
