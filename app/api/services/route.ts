import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { getStatusReadThrough } from "@/lib/hub/cache";
import { toPublicStatus } from "@/lib/service-status/api";
import { newestFetchedAt } from "@/lib/service-status/syncedAt";
import type { ServiceStatusRow } from "@/lib/db/repositories/statusCache";

// GET /api/services — キャッシュ済 status を安全サブセットで配信。
//   revise_C20260608-001: read-through（最終同期日時が TTL 超なら HUB 再取得）+ syncedAt 付与。
export const dynamic = "force-dynamic";

export async function GET() {
  let rows: ServiceStatusRow[];
  try {
    rows = await getStatusReadThrough({ repo: getRepos().statusCache });
  } catch {
    rows = []; // DB/HUB 不可でも graceful（技術詳細を出さない、SEC-001）
  }
  const synced = newestFetchedAt(rows);
  return NextResponse.json({
    services: toPublicStatus(rows),
    syncedAt: synced ? synced.toISOString() : null,
  });
}
