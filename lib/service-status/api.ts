import type { ServiceStatusRow } from "@/lib/db/repositories/statusCache";

// service-status の API 純ロジック — docs/service-status/001 §2
// 表示/配信は安全サブセットのみ（内部指標を出さない、§1.2、U-B1）。

export interface PublicServiceView {
  slug: string;
  name: string;
  url: string;
  status: string;
  since: string | null;
  iconUrl: string | null; // service-icons revise (公開安全、LP 表示)
  fetchedAt: string;
}

// DB 行 → 公開用に明示的にフィールドを選択（余剰/内部フィールドが来ても出力に含めない）。
export function toPublicStatus(rows: ServiceStatusRow[]): PublicServiceView[] {
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    url: r.url,
    status: r.status,
    since: r.since ?? null,
    iconUrl: r.iconUrl ?? null, // service-icons revise
    fetchedAt:
      r.fetchedAt instanceof Date
        ? r.fetchedAt.toISOString()
        : String(r.fetchedAt),
  }));
}

// Vercel Cron の認可（CRON_SECRET、外部からの手動叩き防止、S-E2/U-E2）。
export function isAuthorizedCron(
  authHeader: string | null,
  secret: string | undefined,
): boolean {
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}
