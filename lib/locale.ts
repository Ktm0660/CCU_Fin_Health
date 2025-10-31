export type Locale = 'en' | 'es';

/** Derive locale from Next.js router or path fallback */
export function detectLocale(pathname: string, routerLocale?: string): Locale {
  const loc = (routerLocale || '').split('-')[0];
  if (loc === 'es') return 'es';
  if (pathname.startsWith('/es')) return 'es';
  return 'en';
}

/** Tiny i18n helper */
export function t(en: string, es: string, locale: Locale) {
  return locale === 'es' ? es : en;
}

/** Opportunistic option translator (non-invasive).
 * If the assessment options are already localized, this returns the original text.
 * Otherwise, it maps common English strings into Spanish.
 */
const OPTION_MAP: Record<string, string> = {
  // keep keys lowercase, trimmed
  'i know the basics.': 'Conozco lo básico.',
  "i’ve heard of it but not sure how it works.": "He oído del tema, pero no estoy seguro de cómo funciona.",
  "i've heard of it but not sure how it works.": "He oído del tema, pero no estoy seguro de cómo funciona.",
  "i don’t know my score or what impacts it.": "No conozco mi puntaje ni qué lo afecta.",
  "i don't know my score or what impacts it.": "No conozco mi puntaje ni qué lo afecta.",
  'very well—i monitor it regularly.': 'Muy bien—lo reviso con regularidad.',
  'very well—i monitor it regularly': 'Muy bien—lo reviso con regularidad',
  'i try to stay mindful.': 'Intento ser consciente al gastar.',
  'i often spend without realizing how much.': 'A veces gasto sin darme cuenta de cuánto.',
  'i buy what seems needed.': 'Compro lo que parece necesario.',
  'i budget before i go.': 'Hago un presupuesto antes de comprar.',
};
export function translateOptionLabel(label: string, locale: Locale) {
  if (locale === 'en') return label;
  const key = (label || '').toLowerCase().trim();
  return OPTION_MAP[key] ?? label;
}
