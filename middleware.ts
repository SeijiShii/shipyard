import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Phase 0 scaffold skeleton (spec-review R2)。
// 実認可 (Clerk + allowlist, requireOperator) は _shared/auth で実装予定
// (docs/_shared/auth/002_auth_PLAN.md)。現状は matcher 定義のみの pass-through。
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// 訪問者導線 (/, /contact, /t/*, /services, /legal) は対象外 (認証ゼロ維持、D004)。
// admin のみ保護対象 (実装は _shared/auth)。
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
