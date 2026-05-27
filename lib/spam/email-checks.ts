import { resolveMx } from "node:dns/promises";
import { DISPOSABLE_DOMAINS } from "./disposable-domains";

// メールの使い捨てドメイン判定 + MX 確認（MX は injectable）— docs/_shared/spam/001_spam_SPEC.md §2.5

// domain → MX レコードが存在するか
export type MxResolver = (domain: string) => Promise<boolean>;

export function emailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return domain || null;
}

export function isDisposable(email: string): boolean {
  const domain = emailDomain(email);
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

// 実 MX resolver（runtime）。テストは mock を注入。
export const defaultMxResolver: MxResolver = async (domain) => {
  if (!domain) return false;
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
};
