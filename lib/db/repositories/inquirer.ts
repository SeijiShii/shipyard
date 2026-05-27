import { eq } from "drizzle-orm";
import type { DB } from "../client";
import { inquirers } from "../schema";

// inquirerRepo — docs/_shared/db/001_db_SPEC.md §5.2
// email は PII（SEC-001: ログ非出力）。アカウントではなくメアド単位の問い合わせ者。

export type Inquirer = typeof inquirers.$inferSelect;

export function createInquirerRepo(db: DB) {
  return {
    // 同一メアドの再問い合わせは既存 inquirer に紐付ける（重複作成しない）。
    // email に UNIQUE は張らない設計のため select → 無ければ insert。
    async upsertByEmail(email: string): Promise<{ id: string }> {
      const existing = await db
        .select({ id: inquirers.id })
        .from(inquirers)
        .where(eq(inquirers.email, email))
        .limit(1);
      if (existing.length > 0) return { id: existing[0].id };
      const inserted = await db
        .insert(inquirers)
        .values({ email })
        .returning({ id: inquirers.id });
      return { id: inserted[0].id };
    },

    async findById(id: string): Promise<Inquirer | null> {
      const rows = await db.select().from(inquirers).where(eq(inquirers.id, id)).limit(1);
      return rows[0] ?? null;
    },
  };
}

export type InquirerRepo = ReturnType<typeof createInquirerRepo>;
