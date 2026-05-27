import { describe, it, expect, vi } from "vitest";
import { loadStatusSafe } from "./load";
import type { StatusCacheRepo, ServiceStatusRow } from "@/lib/db/repositories/statusCache";

// L-E1 / S-E1: DB 不可でも例外を投げず空配列（→ EmptyState で graceful）

describe("loadStatusSafe", () => {
  it("正常時は listAll の結果を返す", async () => {
    const rows = [{ slug: "a" }] as ServiceStatusRow[];
    const repo = { listAll: vi.fn(async () => rows) } as unknown as StatusCacheRepo;
    expect(await loadStatusSafe(() => repo)).toBe(rows);
  });

  it("listAll が throw（DB 接続断）→ 空配列", async () => {
    const repo = {
      listAll: vi.fn(async () => {
        throw new Error("connection refused");
      }),
    } as unknown as StatusCacheRepo;
    expect(await loadStatusSafe(() => repo)).toEqual([]);
  });

  it("getRepo() 自体が throw（DATABASE_URL 未設定）→ 空配列", async () => {
    expect(
      await loadStatusSafe(() => {
        throw new Error("DATABASE_URL is not set");
      }),
    ).toEqual([]);
  });
});
