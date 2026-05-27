import { ClerkProvider } from "@clerk/nextjs";
import { requireOperator } from "@/lib/auth/operator";
import { clerkSessionResolver } from "@/lib/auth/clerk";

// admin ガード — docs/admin/001 §6.1（Clerk + allowlist 二重、SEC-002）。
// 未認証は middleware が Clerk サインインへ（A-E1）。ここでは allowlist 外を弾く（A-E2、詳細非開示）。
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireOperator(clerkSessionResolver);
  if (!auth.ok) {
    return (
      <ClerkProvider>
        <main className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="text-xl font-semibold text-ink">権限がありません</h1>
          <p className="mt-2 text-ink-muted">このページにアクセスする権限がありません。</p>
        </main>
      </ClerkProvider>
    );
  }
  return <ClerkProvider>{children}</ClerkProvider>;
}
