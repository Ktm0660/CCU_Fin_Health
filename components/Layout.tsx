import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { t } from "@/lib/i18n";

const tabs = (locale: "en"|"es") => ([
  { href: "/", label: t(locale, "navHome") },
  { href: "/assessment", label: t(locale, "navAssessment") },
  { href: "/resources", label: t(locale, "navResources") },
  { href: "/products", label: t(locale, "navProducts") }
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocale] = useState((router.locale as "en"|"es") || "en");

  useEffect(() => {
    if (router.locale !== locale) router.push(router.asPath, router.asPath, { locale });
  }, [locale]); // eslint-disable-line

  const nav = tabs(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/95 sticky top-0 z-20 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="h-9 w-9 rounded-xl bg-brand-500" />
            <span className="font-semibold text-ink-900">{t(locale, "appName")}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {nav.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm no-underline",
                  router.pathname === it.href
                    ? "bg-brand-100 text-ink-900"
                    : "text-slate-700 hover:bg-brand-100"
                )}
              >
                {it.label}
              </Link>
            ))}
            <select
              aria-label="Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value="en">{t(locale, "langEnglish")}</option>
              <option value="es">{t(locale, "langSpanish")}</option>
            </select>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden sticky bottom-0 z-20 bg-white border-t">
        <div className="max-w-6xl mx-auto grid grid-cols-4">
          {nav.map((it) => {
            const active = router.pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={clsx(
                  "flex flex-col items-center justify-center py-2 no-underline text-xs",
                  active ? "text-brand-700" : "text-slate-600"
                )}
              >
                <span className={clsx(
                  "px-2 py-1 rounded-md",
                  active ? "bg-brand-100" : ""
                )}>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
          <p>{t(locale, "footerLine")}</p>
          <p className="mt-2">© {new Date().getFullYear()} Connections Credit Union</p>
        </div>
      </footer>
    </div>
  );
}
