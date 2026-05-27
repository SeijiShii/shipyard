import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { getCachedStatus } from "@/lib/hub/cache";
import { toPublicStatus } from "@/lib/service-status/api";

// GET /api/services — キャッシュ済 status を安全サブセットで配信（HUB を叩かない）。
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getCachedStatus({ repo: getRepos().statusCache });
  return NextResponse.json({ services: toPublicStatus(rows) });
}
