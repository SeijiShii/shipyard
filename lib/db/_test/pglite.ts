import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../schema";
import type { DB } from "../client";

const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), "../migrations");

// repository テスト用の in-memory Postgres（pglite）。
// 生成済みの Drizzle migration（lib/db/migrations）をそのまま適用するため、
// スキーマと DDL の drift が起きない（no-key・Class A）。CRUD/制約/FK/IDOR を実 SQL で検証する。
export async function makeTestDb(): Promise<{ db: DB; close: () => Promise<void> }> {
  const client = new PGlite();
  const pg = drizzle(client, { schema });
  await migrate(pg, { migrationsFolder });
  return {
    db: pg as unknown as DB,
    close: async () => {
      await client.close();
    },
  };
}
