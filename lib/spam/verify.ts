import type { RateLimitRepo } from "@/lib/db/repositories/rateLimit";
import { checkRateLimit } from "./rate-limit";
import { isDisposable, emailDomain, type MxResolver } from "./email-checks";
import type { TurnstileVerifier } from "./turnstile";

// 不可視スパム対策の合議（5 段）— docs/_shared/spam/001_spam_SPEC.md §2
// 全段 pass で受理、いずれか fail で reject。理由はユーザーに詳細表示しない（汎用文言、U-P2）。

export type RejectReason =
  | "honeypot"
  | "timing"
  | "rate_limit"
  | "turnstile"
  | "turnstile_unavailable"
  | "disposable_email"
  | "no_mx";

export type VerifyResult = { ok: true } | { ok: false; reason: RejectReason };

// reject 時にユーザーへ見せる汎用文言（内部理由を漏らさない、bot にヒントを与えない）。
export const GENERIC_REJECT_MESSAGE =
  "送信できませんでした。お手数ですが、しばらくおいてからもう一度お試しください。";

export interface VerifyInput {
  turnstileToken: string;
  honeypot: string;
  formRenderedAt: number; // フォーム描画時刻（epoch ms）
  ip: string;
  email: string;
  body: string;
}

export interface VerifyDeps {
  repo: RateLimitRepo;
  turnstile: TurnstileVerifier;
  mxResolver: MxResolver;
  now?: Date;
  minFormMs?: number; // 送信タイミング trap（既定 2000ms）
  rateLimit?: number; // 窓内の上限（既定 5）
  windowMs?: number; // 固定窓（既定 10 分）
  // [論点-005]: Turnstile API 障害時。既定=true（fail-closed=安全側 reject、案A 推奨）。
  turnstileFailClosed?: boolean;
}

export async function verifySubmission(
  input: VerifyInput,
  deps: VerifyDeps,
): Promise<VerifyResult> {
  const now = deps.now ?? new Date();

  // 1. honeypot（隠しフィールドが空でない = bot、UX 無影響）
  if (input.honeypot.trim() !== "") return { ok: false, reason: "honeypot" };

  // 2. 送信タイミング trap（即時投稿 = bot）
  const minMs = deps.minFormMs ?? 2000;
  if (now.getTime() - input.formRenderedAt < minMs) return { ok: false, reason: "timing" };

  // 3. rate limit（hash(ip)+hash(email) で key 化、SEC-001）
  const rl = await checkRateLimit(deps.repo, {
    ip: input.ip,
    email: input.email,
    now,
    limit: deps.rateLimit ?? 5,
    windowMs: deps.windowMs ?? 10 * 60 * 1000,
  });
  if (!rl.ok) return { ok: false, reason: "rate_limit" };

  // 4. Turnstile（サーバー検証。API 障害は [論点-005] 既定で fail-closed reject）
  let turnstilePass: boolean;
  try {
    const r = await deps.turnstile.verify(input.turnstileToken, input.ip);
    turnstilePass = r.success;
  } catch {
    if (deps.turnstileFailClosed ?? true) return { ok: false, reason: "turnstile_unavailable" };
    turnstilePass = true; // fail-open 設定時のみ
  }
  if (!turnstilePass) return { ok: false, reason: "turnstile" };

  // 5. email チェック（使い捨てドメイン + MX）
  if (isDisposable(input.email)) return { ok: false, reason: "disposable_email" };
  let mxPass: boolean;
  try {
    mxPass = await deps.mxResolver(emailDomain(input.email) ?? "");
  } catch {
    mxPass = true; // SPAM-E2: MX タイムアウトは pass 寄り（honeypot/Turnstile が主防御）
  }
  if (!mxPass) return { ok: false, reason: "no_mx" };

  return { ok: true };
}

export { generateThreadToken } from "./token";
