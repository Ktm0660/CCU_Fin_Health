/** Tiny local progress helper (no login, private to device). */
const PREFIX = "ccu_lesson_";

export function markDone(id: string) {
  try { localStorage.setItem(PREFIX + id, "1"); } catch {}
}
export function isDone(id: string) {
  try { return localStorage.getItem(PREFIX + id) === "1"; } catch { return false; }
}
export function doneCount(): number {
  try {
    let c = 0;
    Object.keys(localStorage).forEach(k => { if (k.startsWith(PREFIX)) c++; });
    return c;
  } catch { return 0; }
}
