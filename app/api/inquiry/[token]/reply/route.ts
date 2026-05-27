import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { replySchema } from "@/features/inquiry/schema";
import { addReply } from "@/features/inquiry/service";

// POST /api/inquiry/[token]/reply — token 検証（IDOR）→ 追記。
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }
  const parsed = replySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });
  }
  const repos = getRepos();
  const result = await addReply(token, parsed.data.body, {
    threads: repos.threads,
    messages: repos.messages,
  });
  if (!result.ok) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 }); // I-E3/IDOR
  }
  return NextResponse.json({ ok: true });
}
