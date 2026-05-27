import { createHash } from "crypto";
import type { RateLimitRepo } from "@/lib/db/repositories/rateLimit";

// レート制限ラッパ — docs/_shared/spam/001_spam_SPEC.md §2.3
// ip/email は平文保存せずハッシュで key 化（SEC-001、U-P1）。固定窓カウンタ。

function sha(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 32);
}

export function rateLimitKey(ip: string, email: string): string {
  return `${sha(ip)}:${sha(email.trim().toLowerCase())}`;
}

// 固定窓の開始時刻（windowMs で量子化）。
export function windowStart(now: Date, windowMs: number): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

export interface RateLimitInput {
  ip: string;
  email: string;
  now: Date;
  limit: number;
  windowMs: number;
}

export async function checkRateLimit(
  repo: RateLimitRepo,
  input: RateLimitInput,
): Promise<{ ok: boolean; count: number }> {
  const key = rateLimitKey(input.ip, input.email);
  const count = await repo.hitAndCount(key, windowStart(input.now, input.windowMs));
  return { ok: count <= input.limit, count };
}
