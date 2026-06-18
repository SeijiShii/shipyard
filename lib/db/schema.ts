import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  date,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

// _shared/db スキーマ — docs/_shared/db/001_db_SPEC.md §2
// SEC-001: email は PII（ログ非出力）/ SEC-002: thread.token は IDOR アクセスキー

export const inquirers = pgTable(
  "inquirers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(), // PII（SEC-001: ログ非出力）
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailIdx: index("idx_inquirers_email").on(t.email),
  }),
);

export const threads = pgTable(
  "threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    inquirerId: uuid("inquirer_id")
      .notNull()
      .references(() => inquirers.id),
    token: text("token").notNull(), // 128-bit, spam.generateThreadToken（SEC-002）
    subject: text("subject"),
    status: text("status").notNull().default("open"), // 'open' | 'closed'
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tokenIdx: uniqueIndex("idx_threads_token").on(t.token), // IDOR: token ルックアップ
    lastActivityIdx: index("idx_threads_last_activity").on(t.lastActivityAt),
  }),
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    sender: text("sender").notNull(), // 'visitor' | 'operator'
    body: text("body").notNull(), // 表示時プレーンテキスト（SEC-003）
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    threadIdx: index("idx_messages_thread").on(t.threadId, t.createdAt),
  }),
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").notNull(), // hash(ip)+hash(email)（SEC-001: 平文を入れない）
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.key, t.windowStart] }),
  }),
);

export const serviceStatusCache = pgTable("service_status_cache", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull(), // 'up' | 'down' | 'unknown'
  since: date("since"),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  iconUrl: text("icon_url"), // nullable, service-icons revise (Phase 5 MIGRATION)
  summary: text("summary"), // nullable, summary-projection [論点-010] (HUB 公開 status API 由来の短文)
  fetchedAt: timestamp("fetched_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ThreadStatus = "open" | "closed";
export type MessageSender = "visitor" | "operator";
export type ServiceStatusValue = "up" | "down" | "unknown";
