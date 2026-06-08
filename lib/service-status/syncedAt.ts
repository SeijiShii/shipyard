// 最終同期日時の算出 + 表示整形 — docs/service-status/revise_C20260608-001 §7.2.1
// 稼働一覧の fetchedAt 最大値を「{日時}現在」形式（JST）で表示する純関数。

export interface HasFetchedAt {
  fetchedAt: string | Date | null | undefined;
}

// 最終同期日時 = items の fetchedAt 最大値。0 件 / 全て無効なら null。
export function newestFetchedAt(items: readonly HasFetchedAt[]): Date | null {
  let max: number | null = null;
  for (const it of items) {
    if (it.fetchedAt == null) continue;
    const t =
      it.fetchedAt instanceof Date
        ? it.fetchedAt.getTime()
        : new Date(it.fetchedAt).getTime();
    if (!Number.isNaN(t) && (max === null || t > max)) max = t;
  }
  return max === null ? null : new Date(max);
}

// 「2026年6月8日 8:30 現在」形式（JST 表記、時は非ゼロ詰め・分は 2 桁）。null は表示なし。
export function formatSyncedAt(
  date: Date | null,
  timeZone = "Asia/Tokyo",
): string | null {
  if (!date) return null;
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  // hour は hour12:false でも環境により "24" になり得るため正規化
  const hour = String(Number(get("hour")) % 24);
  return `${get("year")}年${get("month")}月${get("day")}日 ${hour}:${get("minute")} 現在`;
}
