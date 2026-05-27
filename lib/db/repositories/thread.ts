import { desc, eq } from "drizzle-orm";
import type { DB } from "../client";
import { threads, type ThreadStatus } from "../schema";
import { generateThreadToken } from "../token";

// threadRepo — docs/_shared/db/001_db_SPEC.md §5.2
// SEC-002 IDOR: visitor 経路は findByToken のみ。連番でない token がアクセスキー。

export type Thread = typeof threads.$inferSelect;

const THREAD_STATUSES: ThreadStatus[] = ["open", "closed"];
const MAX_TOKEN_RETRIES = 3;

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  return (
    e?.code === "23505" ||
    /duplicate key|unique constraint|idx_threads_token/i.test(e?.message ?? "")
  );
}

// generateToken は injectable（テストで衝突を強制でき、_shared/spam 実装後はそちらに差し替え可）。
export function createThreadRepo(db: DB, opts: { generateToken?: () => string } = {}) {
  const generateToken = opts.generateToken ?? generateThreadToken;

  return {
    async create(input: {
      inquirerId: string;
      subject?: string | null;
    }): Promise<{ id: string; token: string }> {
      let lastErr: unknown;
      for (let attempt = 0; attempt < MAX_TOKEN_RETRIES; attempt++) {
        const token = generateToken();
        try {
          const inserted = await db
            .insert(threads)
            .values({ inquirerId: input.inquirerId, subject: input.subject ?? null, token })
            .returning({ id: threads.id, token: threads.token });
          return { id: inserted[0].id, token: inserted[0].token };
        } catch (err) {
          if (isUniqueViolation(err)) {
            lastErr = err; // token 衝突 → 再生成してリトライ（最大 3 回）
            continue;
          }
          throw err;
        }
      }
      throw new Error("threadRepo.create: token のリトライ上限に達しました", { cause: lastErr });
    },

    // SEC-002 IDOR: visitor がスレッドに到達できる唯一の経路。
    async findByToken(token: string): Promise<Thread | null> {
      const rows = await db.select().from(threads).where(eq(threads.token, token)).limit(1);
      return rows[0] ?? null;
    },

    async listRecent(limit = 50, offset = 0): Promise<Thread[]> {
      return db
        .select()
        .from(threads)
        .orderBy(desc(threads.lastActivityAt))
        .limit(limit)
        .offset(offset);
    },

    async setStatus(id: string, status: ThreadStatus): Promise<void> {
      if (!THREAD_STATUSES.includes(status)) {
        throw new Error(`invalid thread status: ${String(status)}`);
      }
      await db.update(threads).set({ status }).where(eq(threads.id, id));
    },

    async touchActivity(id: string): Promise<void> {
      await db.update(threads).set({ lastActivityAt: new Date() }).where(eq(threads.id, id));
    },
  };
}

export type ThreadRepo = ReturnType<typeof createThreadRepo>;
