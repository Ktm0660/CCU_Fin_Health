"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LanguageToggle from "@/components/LanguageToggle";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";
import { t } from "@/lib/i18n";

export default function SiteHeader() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getLangFromQueryOrStorage());
  }, []);

  const appName = t(lang, "appName");

  const links = [
    { href: "/", label: t(lang, "nav.home") },
    { href: "/assessment", label: t(lang, "nav.assessment") },
    { href: "/resources", label: t(lang, "nav.resources") },
    { href: "/glossary", label: t(lang, "nav.glossary") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
        <Link href={hrefWithLang("/", lang)} className="text-slate-900 font-semibold">
          {appName}
        </Link>
        <nav className="flex items-center gap-3">
          {links.map(link => (
            <Link key={link.href} href={hrefWithLang(link.href, lang)} className="text-sm text-slate-700 hover:underline">
              {link.label}
            </Link>
          ))}
          <LanguageToggle className="ml-2" />
        </nav>
      </div>
    </header>
  );
}
