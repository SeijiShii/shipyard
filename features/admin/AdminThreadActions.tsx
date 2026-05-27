"use client";
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 運用者の返信 + クローズ操作 — docs/admin/001 UC-A2/A3。
export function AdminThreadActions({ threadId, status }: { threadId: string; status: string }) {
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function onReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/threads/${threadId}/reply`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: fd.get("body") }),
      });
      if (!res.ok) {
        setError("送信できませんでした。");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("送信できませんでした。");
      setBusy(false);
    }
  }

  async function onClose() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/threads/${threadId}/close`, { method: "POST" });
      if (!res.ok) {
        setError("クローズできませんでした。");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("クローズできませんでした。");
      setBusy(false);
    }
  }

  if (status === "closed") {
    return <p className="mt-6 text-sm text-ink-muted">このお問い合わせは完了しています。</p>;
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <form onSubmit={onReply} className="flex flex-col gap-3">
        <Textarea name="body" required rows={4} aria-label="返信内容" />
        {error && (
          <p role="alert" className="text-sm text-status-down">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={busy}>
            返信する
          </Button>
          <Button type="button" variant="secondary" disabled={busy} onClick={onClose}>
            完了にする
          </Button>
        </div>
      </form>
    </div>
  );
}
