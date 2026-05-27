import { Resend } from "resend";

// メール送信の injectable interface — docs/_shared/email/002_email_PLAN.md（O35）。
// send.ts は Mailer に依存（テストは mock を注入し実キー不要で CI green）。

export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface Mailer {
  send(msg: EmailMessage): Promise<{ id: string }>;
}

// 実 Resend を Mailer に適合させるアダプタ（runtime のみ。RESEND_API_KEY 必須）。
export function resendMailer(apiKey: string | undefined = process.env.RESEND_API_KEY): Mailer {
  const resend = new Resend(apiKey);
  return {
    async send(msg) {
      const { data, error } = await resend.emails.send({
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      if (error) throw new Error(error.message ?? "resend send failed");
      return { id: data?.id ?? "" };
    },
  };
}
