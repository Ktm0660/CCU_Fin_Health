const KEY = "ccu_answers_v1";

export type AnyMap = Record<string, any>;

export function saveAnswers(obj: AnyMap) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {}
}

export function loadAnswers(): AnyMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function clearAnswers() {
  try { localStorage.removeItem(KEY); } catch {}
}
