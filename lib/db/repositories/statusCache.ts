import { sql } from "drizzle-orm";
import type { DB } from "../client";
import { serviceStatusCache, type ServiceStatusValue } from "../schema";

// statusCacheRepo — docs/_shared/db/001_db_SPEC.md §5.2 / §2.5
// HUB status の取得結果キャッシュ。slug を PK に upsert（最新で上書き）。

export type ServiceStatusRow = typeof serviceStatusCache.$inferSelect;

export type StatusCacheInput = {
  slug: string;
  name: string;
  url: string;
  status: ServiceStatusValue;
  since?: string | null; // date 列（'YYYY-MM-DD'）
  lastCheckedAt?: Date | null;
  iconUrl?: string | null; // service-icons revise (R2 型拡張)
  fetchedAt?: Date;
};

const STATUS_VALUES: ServiceStatusValue[] = ["up", "down", "unknown"];

export function createStatusCacheRepo(db: DB) {
  return {
    async upsertMany(rows: StatusCacheInput[]): Promise<void> {
      if (rows.length === 0) return;
      for (const r of rows) {
        if (!STATUS_VALUES.includes(r.status)) {
          throw new Error(`invalid service status: ${String(r.status)}`);
        }
      }
      const now = new Date();
      const values = rows.map((r) => ({
        slug: r.slug,
        name: r.name,
        url: r.url,
        status: r.status,
        since: r.since ?? null,
        lastCheckedAt: r.lastCheckedAt ?? null,
        iconUrl: r.iconUrl ?? null, // service-icons revise (R1 明示列挙への追加)
        fetchedAt: r.fetchedAt ?? now,
      }));
      await db
        .insert(serviceStatusCache)
        .values(values)
        .onConflictDoUpdate({
          target: serviceStatusCache.slug,
          set: {
            name: sql`excluded.name`,
            url: sql`excluded.url`,
            status: sql`excluded.status`,
            since: sql`excluded.since`,
            lastCheckedAt: sql`excluded.last_checked_at`,
            iconUrl: sql`excluded.icon_url`, // service-icons revise (R1)
            fetchedAt: sql`excluded.fetched_at`,
          },
        });
    },

    async listAll(): Promise<ServiceStatusRow[]> {
      return db.select().from(serviceStatusCache);
    },
  };
}

export type StatusCacheRepo = ReturnType<typeof createStatusCacheRepo>;
