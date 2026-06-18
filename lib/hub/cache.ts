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
      summary: s.summary ?? null, // summary-projection [論点-010] (R1 明示列挙、漏らすと DB 保存されない)
      fetchedAt,
    })),
  );
  return { ok: true, updated: data.services.length };
}

// キャッシュから一覧取得（HUB を叩かない）。cron backstop 経路が利用。
export async function getCachedStatus(deps: {
  repo: StatusCacheRepo;
}): Promise<ServiceStatusRow[]> {
  return deps.repo.listAll();
}

// read-through refresh — docs/service-status/revise_C20260608-001 §7.1 UC-S5'
// 最終同期日時（= 最新 fetchedAt）が TTL 超なら訪問者リクエスト時に HUB を再取得。
// Vercel cron（日次・Hobby 制約）非依存で鮮度を担保。失敗時は前回値（graceful、S-E1）。
const DEFAULT_TTL_SEC = 3600; // 1 時間（[論点-001] 解決: ユーザー指示）
const THROTTLE_MS = 60_000; // HUB-down 時の連続 fetch 抑制（warm instance 単位、ベストエフォート）

export interface ReadThroughThrottle {
  lastAttemptAtMs: number;
}
// module-level の既定 throttle（serverless warm instance 単位）。テストは deps.throttle で分離。
const moduleThrottle: ReadThroughThrottle = { lastAttemptAtMs: 0 };

export interface ReadThroughDeps {
  repo: StatusCacheRepo;
  fetchStatus?: () => Promise<PublicStatusResponse>;
  now?: Date;
  ttlSec?: number;
  throttle?: ReadThroughThrottle;
}

function newestFetchedAtMs(rows: ServiceStatusRow[]): number | null {
  let max: number | null = null;
  for (const r of rows) {
    if (!r.fetchedAt) continue;
    const t =
      r.fetchedAt instanceof Date
        ? r.fetchedAt.getTime()
        : new Date(r.fetchedAt).getTime();
    if (!Number.isNaN(t) && (max === null || t > max)) max = t;
  }
  return max;
}

export async function getStatusReadThrough(
  deps: ReadThroughDeps,
): Promise<ServiceStatusRow[]> {
  const now = deps.now ?? new Date();
  const ttlSec =
    deps.ttlSec ??
    (Number(process.env.STATUS_REFRESH_TTL_SEC) || DEFAULT_TTL_SEC);
  const throttle = deps.throttle ?? moduleThrottle;

  let rows = await deps.repo.listAll();
  const newest = newestFetchedAtMs(rows);
  const isStale = newest === null || now.getTime() - newest >= ttlSec * 1000;
  const throttled = now.getTime() - throttle.lastAttemptAtMs < THROTTLE_MS;

  if (isStale && !throttled) {
    throttle.lastAttemptAtMs = now.getTime();
    const result = await refreshStatusCache({
      repo: deps.repo,
      fetchStatus: deps.fetchStatus,
      now,
    });
    if (result.ok) {
      rows = await deps.repo.listAll(); // refresh 成功時のみ再取得。失敗は前回値（graceful）
    }
  }
  return rows;
}
