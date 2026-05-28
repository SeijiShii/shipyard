import { escapeHtml } from "../util";

// 返信通知メール — 運用者返信本文を含める ([論点-006] 案 c reconcile、D20260528_017_revise_inquiry_mail-include-reply)。
// 訪問者本人宛 mail = 新規情報 outbound = SEC-001 (PII ログ漏洩防止) 対象外。
// 訪問者の問い合わせ本文 / 過去履歴は含めない (Resend log への漏洩面最小化)。
// SEC-003 (XSS) は escapeHtml(body) で防御 (本 PJ 内 trusted user 入力だが defense-in-depth)。
export function replyNotificationEmail({
  url,
  body,
}: {
  url: string;
  body: string;
}) {
  const subject = "返信が届きました";
  const lead = "お問い合わせに返信が届きました。";
  const safeUrl = escapeHtml(url);
  const safeBody = escapeHtml(body);
  const noReplyNotice =
    "このメールへの返信は受け付けていません。続きはサイトの返信フォームからお願いします。";
  const html = `<div style="font-family:sans-serif;color:#1E2722;line-height:1.7">
  <p>${lead}</p>
  <pre style="white-space:pre-wrap;font-family:inherit;margin:1em 0;padding:1em;background:#f3f1ec;border-radius:4px">${safeBody}</pre>
  <p><a href="${safeUrl}" style="color:#0E7C72">サイトで会話の続きを見る（任意）</a></p>
  <p style="color:#6b7a72;font-size:0.9em">${noReplyNotice}</p>
</div>`;
  const text = `${lead}\n\n${body}\n\n${url}\n\n${noReplyNotice}\n`;
  return { subject, html, text };
}
