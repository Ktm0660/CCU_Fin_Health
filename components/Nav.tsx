import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import MobileMenu from "@/components/MobileMenu";

export default function Nav() {
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="no-underline font-semibold text-ink-900 mr-2 shrink-0">
          Connections
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/" className="no-underline text-ink-900 hover:underline">{t(locale,"nav.home")}</Link>
          <Link href="/assessment" className="no-underline text-ink-900 hover:underline">{t(locale,"nav.assessment")}</Link>
          <Link href="/resources" className="no-underline text-ink-900 hover:underline">{t(locale,"nav.resources")}</Link>
          <Link href="/products" className="no-underline text-ink-900 hover:underline">{t(locale,"nav.products")}</Link>
          <LanguageToggle />
        </div>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </nav>
  );
}
