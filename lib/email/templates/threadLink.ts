import { escapeHtml } from "../util";

// スレッドリンクメール — design SoT トーン（誠実・控えめ）。
// 本文はリンクのみ。問い合わせ本文は載せない（SEC-001、U-P1）。
export function threadLinkEmail({ url, isNew }: { url: string; isNew: boolean }) {
  const subject = isNew
    ? "お問い合わせを受け付けました"
    : "お問い合わせのスレッド";
  const lead = isNew
    ? "お問い合わせありがとうございます。下のリンクから、いつでもやり取りに戻れます。"
    : "お問い合わせのスレッドはこちらです。いつでも戻れます。";
  const safeUrl = escapeHtml(url);
  const html = `<div style="font-family:sans-serif;color:#1E2722;line-height:1.7">
  <p>${lead}</p>
  <p><a href="${safeUrl}" style="color:#0E7C72">やり取りを開く</a></p>
  <p style="color:#5C625D;font-size:13px">このリンクはあなた専用です。共有しないでください。</p>
</div>`;
  const text = `${lead}\n\n${url}\n\nこのリンクはあなた専用です。共有しないでください。\n`;
  return { subject, html, text };
}
