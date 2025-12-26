export type Lang = "en" | "es";

export type LangSource = "query" | "storage" | "default";

export function getLangWithSource(): { lang: Lang; source: LangSource } {
  if (typeof window === "undefined") return { lang: "en", source: "default" };
  const url = new URL(window.location.href);
  const q = url.searchParams.get("lang");
  if (q === "en" || q === "es") {
    localStorage.setItem("lang", q);
    return { lang: q, source: "query" };
  }
  const s = localStorage.getItem("lang");
  if (s === "es" || s === "en") return { lang: s as Lang, source: "storage" };
  return { lang: "en", source: "default" };
}

export function hrefWithLang(href: string, lang: Lang) {
  if (!href) return href;
  const lower = href.toLowerCase();
  const isExternal = lower.startsWith("http") || lower.startsWith("mailto:") || lower.startsWith("tel:");
  if (isExternal) return href;

  const [path, hash] = href.split("#");
  const sep = path.includes("?") ? "&" : "?";
  const withLang = `${path}${path.includes("lang=") ? "" : `${sep}lang=${lang}`}`;
  return hash ? `${withLang}#${hash}` : withLang;
}

export function getLangFromQueryOrStorage(): Lang {
  return getLangWithSource().lang;
}

export function setLang(lang: Lang) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lang", lang);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.location.assign(url.toString());
}
