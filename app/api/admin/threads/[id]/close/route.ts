import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { requireOperator } from "@/lib/auth/operator";
import { clerkSessionResolver } from "@/lib/auth/clerk";
import { adminClose } from "@/features/admin/service";

// POST /api/admin/threads/[id]/close — requireOperator → setStatus(closed)。
export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOperator(clerkSessionResolver);
  if (!auth.ok) {
    return NextResponse.json({ error: "権限がありません。" }, { status: auth.status });
  }
  const { id } = await params;
  const result = await adminClose(id, { threads: getRepos().threads });
  if (!result.ok) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
