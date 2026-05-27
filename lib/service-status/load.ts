import { getCachedStatus } from "@/lib/hub/cache";
import type { StatusCacheRepo, ServiceStatusRow } from "@/lib/db/repositories/statusCache";

// 稼働一覧の graceful 取得 — docs/landing/001 L-E1 / service-status/001 S-E1
// DB 接続不可（DATABASE_URL 未設定/接続断）でも例外を投げず空配列を返す → 画面は EmptyState で
// graceful（技術詳細を出さない、SEC-001）。getRepo() 自体の throw（getDb 失敗）も捕捉する。
export async function loadStatusSafe(getRepo: () => StatusCacheRepo): Promise<ServiceStatusRow[]> {
  try {
    return await getCachedStatus({ repo: getRepo() });
  } catch {
    return [];
  }
}
