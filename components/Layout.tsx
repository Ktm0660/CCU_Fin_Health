import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import clsx from "clsx";

const tabs = [
  { href: "/", label: { en: "Home", es: "Inicio" } },
  { href: "/assessment", label: { en: "Assessment", es: "Evaluación" } },
  { href: "/resources", label: { en: "Tools & Resources", es: "Herramientas" } },
  { href: "/products", label: { en: "CU Products", es: "Productos CU" } }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocale] = useState(router.locale || "en");

  useEffect(() => {
    if (router.locale !== locale) {
      router.push(router.asPath, router.asPath, { locale });
    }
  }, [locale]); // eslint-disable-line

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 sticky top-0 z-20 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="h-9 w-9 rounded-xl bg-brand-500" />
            <span className="font-semibold text-ink-900">Connections Financial Health</span>
          </Link>
          <nav className="flex items-center gap-4">
            {tabs.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm no-underline",
                  router.pathname === t.href
                    ? "bg-brand-100 text-ink-900"
                    : "text-slate-700 hover:bg-brand-100"
                )}
              >
                {t.label[locale as "en" | "es"]}
              </Link>
            ))}
            <select
              aria-label="Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>

      <footer className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
          <p>
            No judgment. No pressure. Just tools to help you feel safer and stronger with money.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Connections Credit Union</p>
        </div>
      </footer>
    </div>
  );
}
