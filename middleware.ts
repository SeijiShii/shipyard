import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 運用者認証 — docs/_shared/auth/001_auth_SPEC.md §2
// admin のみ保護。訪問者導線（/, /contact, /t/*, /services, /legal）は matcher に含めず
// 認証ゼロを維持（D004）。allowlist の二重防御は requireOperator（lib/auth/operator.ts）。
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect(); // 未認証は Clerk サインインへ（AUTH-E1）
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
