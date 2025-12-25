"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LanguageToggle from "@/components/LanguageToggle";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";
import { t } from "@/lib/i18n";

export default function Footer() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getLangFromQueryOrStorage());
  }, []);

  return (
    <footer className="border-t bg-white mt-8 motion-safe:animate-fade-in">
      <div className="mx-auto max-w-3xl md:max-w-4xl px-4 py-6 text-sm text-slate-700 grid md:grid-cols-3 gap-5">
        <div>
          <p className="font-semibold text-ink-900">Connections</p>
          <p className="mt-1">
            {lang === "en"
              ? "Serving rural Idaho with judgment-free guidance."
              : "Sirviendo a Idaho rural con orientación sin juicios."}
          </p>
          <div className="mt-3">
            <LanguageToggle />
          </div>
        </div>
        <div>
          <p className="font-semibold text-ink-900">{t(lang, "nav.explore")}</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link className="no-underline" href={hrefWithLang("/assessment", lang)}>
                {t(lang, "nav.assessment")}
              </Link>
            </li>
            <li>
              <Link className="no-underline" href={hrefWithLang("/resources", lang)}>
                {t(lang, "nav.resources")}
              </Link>
            </li>
            <li>
              <Link className="no-underline" href={hrefWithLang("/glossary", lang)}>
                {t(lang, "nav.glossary")}
              </Link>
            </li>
            <li>
              <Link className="no-underline" href={hrefWithLang("/products", lang)}>
                {t(lang, "nav.products")}
              </Link>
            </li>
            <li>
              <Link className="no-underline" href={hrefWithLang("/results", lang)}>
                {t(lang, "nav.results")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-900">{t(lang, "nav.getHelp")}</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link className="no-underline" href={hrefWithLang("/plan", lang)}>
                {t(lang, "nav.plan")}
              </Link>
            </li>
            <li>
              <Link className="no-underline" href={hrefWithLang("/resources#counseling", lang)}>
                {t(lang, "nav.counseling")}
              </Link>
            </li>
            <li>
              <Link className="no-underline" href={hrefWithLang("/resources#mobile", lang)}>
                {t(lang, "nav.mobileUnit")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-3 text-xs text-center text-slate-500">
        © {new Date().getFullYear()} Connections Credit Union
      </div>
    </footer>
  );
}
