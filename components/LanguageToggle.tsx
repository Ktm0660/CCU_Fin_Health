import Link from "next/link";
import { useRouter } from "next/router";

export default function LanguageToggle({ className="" }: { className?: string }) {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const nextLocale = locale === "en" ? "es" : "en";
  return (
    <Link
      href={router.asPath}
      locale={nextLocale}
      className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-1.5 text-sm no-underline ${className}`}
      aria-label={locale==="en" ? "Switch to Spanish" : "Cambiar a inglés"}
    >
      {nextLocale === "es" ? "Español" : "English"}
    </Link>
  );
}
