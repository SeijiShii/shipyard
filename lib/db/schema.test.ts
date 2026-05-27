import { describe, it, expect } from "vitest";
import { getTableConfig } from "drizzle-orm/pg-core";
import {
  inquirers,
  threads,
  messages,
  rateLimits,
  serviceStatusCache,
} from "./schema";

// docs/_shared/db/003_db_UNIT_TEST.md Phase 1: スキーマ形 / enum default / token UNIQUE index

describe("_shared/db schema", () => {
  it("inquirers has email (PII) + created_at", () => {
    const cols = getTableConfig(inquirers).columns.map((c) => c.name);
    expect(cols).toEqual(expect.arrayContaining(["id", "email", "created_at"]));
  });

  it("threads has token + status default 'open' + inquirer_id", () => {
    const cfg = getTableConfig(threads);
    const cols = cfg.columns.map((c) => c.name);
    expect(cols).toEqual(
      expect.arrayContaining(["id", "inquirer_id", "token", "status", "last_activity_at"]),
    );
    const status = cfg.columns.find((c) => c.name === "status");
    expect(status?.default).toBe("open");
  });

  it("threads.token has a UNIQUE index (IDOR アクセスキー, SEC-002)", () => {
    const cfg = getTableConfig(threads);
    const tokenUnique = cfg.indexes.find(
      (i) => i.config.unique && i.config.columns.some((c: any) => c.name === "token"),
    );
    expect(tokenUnique).toBeDefined();
  });

  it("messages cascades on thread delete + has sender/body", () => {
    const cfg = getTableConfig(messages);
    const cols = cfg.columns.map((c) => c.name);
    expect(cols).toEqual(expect.arrayContaining(["thread_id", "sender", "body", "created_at"]));
  });

  it("rate_limits has composite PK (key, window_start)", () => {
    const cfg = getTableConfig(rateLimits);
    const pk = cfg.primaryKeys[0];
    const pkCols = pk.columns.map((c) => c.name);
    expect(pkCols).toEqual(expect.arrayContaining(["key", "window_start"]));
  });

  it("service_status_cache keyed by slug + has status/since/fetched_at", () => {
    const cols = getTableConfig(serviceStatusCache).columns.map((c) => c.name);
    expect(cols).toEqual(
      expect.arrayContaining(["slug", "name", "url", "status", "since", "fetched_at"]),
    );
  });
});
