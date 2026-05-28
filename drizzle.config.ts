import type { Config } from "drizzle-kit";

// _shared/db: schema は lib/db/schema.ts に実装予定 (docs/_shared/db/002_db_PLAN.md)
// env load: CLI ツール経由実行 (drizzle-kit など) は scripts/with-env.sh 経由で起動 (CF-20260528-015)
// package.json scripts: "db:migrate": "bash scripts/with-env.sh drizzle-kit migrate"

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
