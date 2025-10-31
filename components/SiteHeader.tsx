import Link from 'next/link';
import { useRouter } from 'next/router';
import { detectLocale, t, type Locale } from '@/lib/locale';

function switchPath(path: string, to: Locale) {
  // normalize: /, /en/..., /es/...
  if (to === 'en') {
    return path.replace(/^\/es(\/|$)/, '/en$1').replace(/^\/$/, '/en');
  }
  return path.replace(/^\/en(\/|$)/, '/es$1').replace(/^\/$/, '/es');
}

export default function SiteHeader() {
  const router = useRouter();
  const locale = detectLocale(router.asPath, router.locale);
  const other = locale === 'en' ? 'es' : 'en';
  const hereOther = switchPath(router.asPath || '/', other as Locale);
  const hereHome = locale === 'en' ? '/en' : '/es';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
        <Link href={hereHome} className="text-slate-900 font-semibold">
          CCU Financial Health
        </Link>
        <nav className="flex items-center gap-3">
          <Link href={hereHome} className="text-sm text-slate-700 hover:underline">
            {t('Home', 'Inicio', locale)}
          </Link>
          <Link href={`${hereHome}/plan`} className="text-sm text-slate-700 hover:underline">
            {t('Snapshot', 'Panorama', locale)}
          </Link>
          <Link href={hereOther} className="ml-3 rounded-full border px-3 py-1 text-sm">
            {locale === 'en' ? 'Español' : 'English'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
