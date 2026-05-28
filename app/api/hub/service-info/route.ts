import { NextResponse } from "next/server";
import { serviceInfoPayload, isAuthorizedHub } from "@/lib/hub/service-info";

// GET /api/hub/service-info — O48 v2 (favicon-projection): service-hub が pull する shipyard 自身の service-info。
// HUB_SERVICE_INFO_SECRET で認証（全サービス共通 1 本、公開ページとは分離）。
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (
    !isAuthorizedHub(
      req.headers.get("authorization"),
      process.env.HUB_SERVICE_INFO_SECRET,
    )
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    serviceInfoPayload(
      undefined,
      process.env.npm_package_version,
      process.env.SITE_URL,
    ),
  );
}
