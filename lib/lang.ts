export type Lang = "en" | "es";

export function getLangFromQueryOrStorage(): Lang {
  if (typeof window === "undefined") return "en";
  const url = new URL(window.location.href);
  const q = url.searchParams.get("lang");
  if (q === "en" || q === "es") {
    localStorage.setItem("lang", q);
    return q;
  }
  const s = localStorage.getItem("lang");
  return s === "es" ? "es" : "en";
}

export function setLang(lang: Lang) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lang", lang);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.location.assign(url.toString());
}
