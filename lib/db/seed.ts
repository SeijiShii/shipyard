import { getDb } from "./client";
import { createStatusCacheRepo, type StatusCacheInput } from "./repositories";

// dev シード — docs/_shared/db/002_db_PLAN.md §2 Phase 3
// service_status_cache のモック行（HUB contract 未確定のため §8 の安全サブセットに整合）。
// 本番では _shared/hub-client が実データで上書きする。ローカル開発で service-status 画面を
// 動かすためのプレースホルダ。
export const DEV_STATUS_SEED: StatusCacheInput[] = [
  {
    slug: "example-a",
    name: "Example Service A",
    url: "https://a.example.com",
    status: "up",
    since: "2026-01-15",
  },
  {
    slug: "example-b",
    name: "Example Service B",
    url: "https://b.example.com",
    status: "up",
    since: "2026-03-01",
  },
  {
    slug: "example-c",
    name: "Example Service C",
    url: "https://c.example.com",
    status: "unknown",
  },
];

// db は DI（テストは pglite を渡す）。CLI 実行（実 DB への適用）は DATABASE_URL が必要で
// release 工程の責務（Class B）。本関数自体は no-key・Class A。
export async function seedStatusCache(db = getDb()): Promise<number> {
  await createStatusCacheRepo(db).upsertMany(DEV_STATUS_SEED);
  return DEV_STATUS_SEED.length;
}
