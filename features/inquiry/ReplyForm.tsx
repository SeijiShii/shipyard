"use client";
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// スレッドへの追記フォーム — docs/inquiry/001 UC-I2（token 経由 reply API）。
export function ReplyForm({ token }: { token: string }) {
  const [error, setError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/inquiry/${token}/reply`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: fd.get("body") }),
      });
      if (!res.ok) {
        setError("送信できませんでした。もう一度お試しください。");
        setSending(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("送信できませんでした。もう一度お試しください。");
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
      <Textarea name="body" required rows={4} aria-label="返信内容" />
      {error && (
        <p role="alert" className="text-sm text-status-down">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={sending}>
        送信する
      </Button>
    </form>
  );
}
