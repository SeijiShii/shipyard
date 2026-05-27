import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db/repositories";
import { verifySubmission } from "@/lib/spam/verify";
import { cloudflareTurnstile } from "@/lib/spam/turnstile";
import { defaultMxResolver } from "@/lib/spam/email-checks";
import { resendMailer } from "@/lib/email/client";
import { sendThreadLink, sendNewInquiryNotification } from "@/lib/email/send";
import { inquirySchema } from "@/features/inquiry/schema";
import { createInquiry } from "@/features/inquiry/service";

// POST /api/inquiry — Zod 検証 → spam 5 段 → DB 作成 → 通知（best-effort）。
export const dynamic = "force-dynamic";

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(json); // SEC-003 入力検証（I-E2）
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容をご確認ください。", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const raw = json as Record<string, unknown>;
  const repos = getRepos();
  const mailer = resendMailer();

  const result = await createInquiry(
    {
      email: parsed.data.email,
      body: parsed.data.body,
      subject: parsed.data.subject,
      honeypot: String(raw.honeypot ?? ""),
      formRenderedAt: Number(raw.formRenderedAt ?? 0),
      turnstileToken: String(raw.turnstileToken ?? ""),
      ip: clientIp(req),
    },
    {
      verify: (args) =>
        verifySubmission(args, {
          repo: repos.rateLimits,
          turnstile: cloudflareTurnstile(),
          mxResolver: defaultMxResolver,
        }),
      inquirers: repos.inquirers,
      threads: repos.threads,
      messages: repos.messages,
      notifyThreadLink: (to, token) => sendThreadLink({ mailer }, { to, token, isNew: true }),
      notifyOperator: (threadId) => sendNewInquiryNotification({ mailer }, { threadId }),
    },
  );

  if (!result.ok) {
    // 汎用文言、理由非開示（I-E1、bot にヒントを与えない）
    return NextResponse.json(
      { error: "送信できませんでした。しばらくおいてからお試しください。" },
      { status: result.status },
    );
  }
  return NextResponse.json({ token: result.token });
}
