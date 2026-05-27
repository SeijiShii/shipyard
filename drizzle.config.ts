import type { Config } from "drizzle-kit";

// _shared/db: schema は lib/db/schema.ts に実装予定 (docs/_shared/db/002_db_PLAN.md)
export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
