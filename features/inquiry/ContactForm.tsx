"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProgressFeedback } from "@/components/ui/ProgressFeedback";
import { saveThread } from "./storage";

// 問い合わせフォーム — docs/inquiry/001 UC-I1
// 不可視スパム: honeypot(company) + formRenderedAt + Turnstile widget。送信中は段階文言（O45）。
export const SUBMIT_STAGES = [
  "送信内容を確認しています",
  "スレッドを用意しています",
  "完了しました",
];

const GENERIC_ERROR =
  "送信できませんでした。お手数ですが、しばらくおいてからもう一度お試しください。";

export function ContactForm() {
  const [stage, setStage] = React.useState(-1);
  const [error, setError] = React.useState<string | null>(null);
  const [threadUrl, setThreadUrl] = React.useState<string | null>(null);
  const renderedAt = React.useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setStage(0);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          body: fd.get("body"),
          subject: fd.get("subject") || undefined,
          honeypot: fd.get("company") ?? "",
          formRenderedAt: renderedAt.current,
          turnstileToken: fd.get("cf-turnstile-response") ?? "",
        }),
      });
      setStage(1);
      if (!res.ok) {
        setError(GENERIC_ERROR);
        setStage(-1);
        return;
      }
      const data = (await res.json()) as { token: string };
      saveThread(data.token);
      setThreadUrl(`/t/${data.token}`);
      setStage(2);
    } catch {
      setError(GENERIC_ERROR);
      setStage(-1);
    }
  }

  if (threadUrl) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-ink">送信しました。このページからやり取りを続けられます。</p>
        <a href={threadUrl} className="text-primary hover:text-primary-hover">
          やり取りを開く
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* honeypot: 視覚的に隠す。bot が埋めると reject（UX 無影響） */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">メールアドレス</span>
        <Input type="email" name="email" required autoComplete="email" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">件名（任意）</span>
        <Input type="text" name="subject" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">お問い合わせ内容</span>
        <Textarea name="body" required rows={6} />
      </label>
      {/* Turnstile widget（本番は CF スクリプトが cf-turnstile-response を埋める） */}
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />
      <input type="hidden" name="cf-turnstile-response" />
      {error && (
        <p role="alert" className="text-sm text-status-down">
          {error}
        </p>
      )}
      {stage >= 0 && stage < SUBMIT_STAGES.length && (
        <ProgressFeedback stages={SUBMIT_STAGES} current={stage} />
      )}
      <Button type="submit" variant="primary">
        送信する
      </Button>
    </form>
  );
}
