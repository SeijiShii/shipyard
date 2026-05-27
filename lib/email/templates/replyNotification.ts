import { escapeHtml } from "../util";

// 返信通知メール — リンクのみ。本文プレビューは含めない（SEC-001、U-2/U-P1）。
export function replyNotificationEmail({ url }: { url: string }) {
  const subject = "返信が届きました";
  const lead = "お問い合わせに返信が届きました。下のリンクから内容をご確認ください。";
  const safeUrl = escapeHtml(url);
  const html = `<div style="font-family:sans-serif;color:#1E2722;line-height:1.7">
  <p>${lead}</p>
  <p><a href="${safeUrl}" style="color:#0E7C72">返信を読む</a></p>
</div>`;
  const text = `${lead}\n\n${url}\n`;
  return { subject, html, text };
}
