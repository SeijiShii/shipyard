import { sql } from "drizzle-orm";
import type { DB } from "../client";
import { rateLimits } from "../schema";

// rateLimitRepo — docs/_shared/db/001_db_SPEC.md §5.2 / §2.4
// key は IP/email のハッシュ（SEC-001: 平文を入れない）。(key, window_start) 固定窓カウンタ。

export function createRateLimitRepo(db: DB) {
  return {
    // 窓内のヒット数を 1 増やし、増加後の count を返す（atomic upsert）。
    async hitAndCount(key: string, windowStart: Date): Promise<number> {
      const rows = await db
        .insert(rateLimits)
        .values({ key, windowStart, count: 1 })
        .onConflictDoUpdate({
          target: [rateLimits.key, rateLimits.windowStart],
          set: { count: sql`${rateLimits.count} + 1` },
        })
        .returning({ count: rateLimits.count });
      return rows[0].count;
    },
  };
}

export type RateLimitRepo = ReturnType<typeof createRateLimitRepo>;
