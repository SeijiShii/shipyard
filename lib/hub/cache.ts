import type {
  StatusCacheRepo,
  ServiceStatusRow,
} from "@/lib/db/repositories/statusCache";
import { fetchHubStatus } from "./client";
import type { PublicStatusResponse } from "./contract";

// HUB status のキャッシュ層 — docs/_shared/hub-client/001_hub-client_SPEC.md
// Cron が refresh、画面/API は getCached（HUB を叩かない）。HUB ダウン時は前回値を保持（graceful）。

export interface CacheDeps {
  repo: StatusCacheRepo;
  fetchStatus?: () => Promise<PublicStatusResponse>;
  now?: Date;
}

export type RefreshResult =
  | { ok: true; updated: number }
  | { ok: false; kept: true };

// HUB を取得して service_status_cache に upsert。失敗時はキャッシュを更新しない（HUB-E1/E2）。
export async function refreshStatusCache(
  deps: CacheDeps,
): Promise<RefreshResult> {
  const fetchStatus = deps.fetchStatus ?? (() => fetchHubStatus());
  let data: PublicStatusResponse;
  try {
    data = await fetchStatus();
  } catch {
    return { ok: false, kept: true }; // 前回値維持（graceful、PII を出さない）
  }
  const fetchedAt = deps.now ?? new Date();
  await deps.repo.upsertMany(
    data.services.map((s) => ({
      slug: s.slug,
      name: s.name,
      url: s.url,
      status: s.status,
      since: s.since ?? null,
      lastCheckedAt: s.lastCheckedAt ? new Date(s.lastCheckedAt) : null,
      iconUrl: s.iconUrl ?? null, // service-icons revise (R1 明示列挙への追加、漏らすと DB 保存されない)
      fetchedAt,
    })),
  );
  return { ok: true, updated: data.services.length };
}

// キャッシュから一覧取得（HUB を叩かない）。
export async function getCachedStatus(deps: {
  repo: StatusCacheRepo;
}): Promise<ServiceStatusRow[]> {
  return deps.repo.listAll();
}
