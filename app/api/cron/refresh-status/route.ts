import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { refreshStatusCache } from "@/lib/hub/cache";
import { fetchHubStatus } from "@/lib/hub/client";
import { isAuthorizedCron } from "@/lib/service-status/api";

// GET /api/cron/refresh-status — Vercel Cron が HUB から取得しキャッシュ更新（CRON_SECRET 保護）。
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthorizedCron(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 }); // S-E2
  }
  // 失敗時は hub-client が前回値を保持（graceful）。cron 自体は実行成功として 200 を返す。
  const result = await refreshStatusCache({
    repo: getRepos().statusCache,
    fetchStatus: () => fetchHubStatus(),
  });
  return NextResponse.json(result);
}
