import { NextResponse } from "next/server";
import { serviceInfoPayload, isAuthorizedHub } from "@/lib/hub/service-info";

// GET /api/hub/service-info — O48: service-hub が pull する shipyard 自身の service-info。
// HUB_SHARED_SECRET で認証（読み取り専用、公開ページとは分離）。
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthorizedHub(req.headers.get("authorization"), process.env.HUB_SHARED_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(serviceInfoPayload());
}
