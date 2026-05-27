import type { ServiceStatusValue } from "@/lib/db/schema";

// status → 一般向けラベル + 状態色（design SoT §6 ボイス / §2 状態色）。
// 技術用語を出さない（O38）。色 + 形 + ラベルの三重で識別（色覚配慮）。

export type DisplayStatus = ServiceStatusValue; // 'up' | 'down' | 'unknown'

export const STATUS_LABEL: Record<DisplayStatus, string> = {
  up: "動いています",
  down: "止まっているかも",
  unknown: "確認中",
};

// 状態ドットの背景色クラス（tailwind theme → CSS 変数）。
export const STATUS_DOT_CLASS: Record<DisplayStatus, string> = {
  up: "bg-status-up",
  down: "bg-status-down",
  unknown: "bg-status-unknown",
};

// 未知の status は 'unknown' にフォールバック（UI-E1 / U-E1）。
export function normalizeStatus(s: string | null | undefined): DisplayStatus {
  return s === "up" || s === "down" || s === "unknown" ? s : "unknown";
}

// since（'YYYY-MM-DD'）からの稼働日数。now は注入可能（テスト再現性、UNIT_TEST §2）。
export function daysSince(
  since: string | null | undefined,
  now: Date = new Date(),
): number | null {
  if (!since) return null;
  const start = new Date(`${since}T00:00:00Z`).getTime();
  if (Number.isNaN(start)) return null;
  return Math.max(0, Math.floor((now.getTime() - start) / 86_400_000));
}
