import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { requireOperator } from "@/lib/auth/operator";
import { clerkSessionResolver } from "@/lib/auth/clerk";
import { resendMailer } from "@/lib/email/client";
import { sendReplyNotification } from "@/lib/email/send";
import { adminReplySchema } from "@/features/admin/replySchema";
import { adminReply } from "@/features/admin/service";

// POST /api/admin/threads/[id]/reply — requireOperator → message(operator) + 通知。
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Clerk + allowlist 二重防御（middleware + handler、SEC-002、A-E1/A-E2）
  const auth = await requireOperator(clerkSessionResolver);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "権限がありません。" },
      { status: auth.status },
    );
  }
  const { id } = await params;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "不正なリクエストです。" },
      { status: 400 },
    );
  }
  const parsed = adminReplySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容をご確認ください。" },
      { status: 400 },
    ); // A-E3
  }
  const repos = getRepos();
  const mailer = resendMailer();
  const result = await adminReply(id, parsed.data.body, {
    threads: repos.threads,
    messages: repos.messages,
    inquirers: repos.inquirers,
    notifyReply: (to, token, body) =>
      sendReplyNotification({ mailer }, { to, token, body }),
  });
  if (!result.ok) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 }); // A-E4
  }
  return NextResponse.json({ ok: true });
}
