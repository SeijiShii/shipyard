import { escapeHtml } from "../util";

// 運用者宛の新着通知 — admin リンクのみ。問い合わせ本文・メアドは載せない（SEC-001、U-3/U-P1）。
export function newInquiryEmail({ adminUrl }: { adminUrl: string }) {
  const subject = "新しいお問い合わせがあります";
  const lead = "新しいお問い合わせが届きました。管理画面から確認してください。";
  const safeUrl = escapeHtml(adminUrl);
  const html = `<div style="font-family:sans-serif;color:#1E2722;line-height:1.7">
  <p>${lead}</p>
  <p><a href="${safeUrl}" style="color:#0E7C72">管理画面を開く</a></p>
</div>`;
  const text = `${lead}\n\n${adminUrl}\n`;
  return { subject, html, text };
}
