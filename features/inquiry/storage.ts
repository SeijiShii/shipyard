// 訪問者が自分のスレッドに戻れるよう token を localStorage に保存（メール不達時の保険、§5.2）。
const KEY = "shipyard.threads";

export function savedThreads(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export function saveThread(token: string): void {
  if (typeof window === "undefined") return;
  const cur = savedThreads();
  if (!cur.includes(token)) {
    window.localStorage.setItem(KEY, JSON.stringify([...cur, token]));
  }
}
