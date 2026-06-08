import { describe, it, expect } from "vitest";
import { newestFetchedAt, formatSyncedAt } from "./syncedAt";

// docs/service-status/revise_C20260608-001 §003 SA-1/2/3

describe("newestFetchedAt (SA-1, SA-3)", () => {
  it("SA-1: fetchedAt 最大値を返す", () => {
    const t1 = new Date("2026-06-08T00:00:00Z");
    const t2 = new Date("2026-06-08T05:00:00Z"); // max
    const t3 = new Date("2026-06-08T03:00:00Z");
    const got = newestFetchedAt([
      { fetchedAt: t1 },
      { fetchedAt: t2 },
      { fetchedAt: t3 },
    ]);
    expect(got?.getTime()).toBe(t2.getTime());
  });

  it("SA-1b: ISO 文字列でも最大値を返す", () => {
    const got = newestFetchedAt([
      { fetchedAt: "2026-06-08T00:00:00Z" },
      { fetchedAt: "2026-06-08T09:00:00Z" },
    ]);
    expect(got?.toISOString()).toBe("2026-06-08T09:00:00.000Z");
  });

  it("SA-3: 0 件は null", () => {
    expect(newestFetchedAt([])).toBeNull();
  });

  it("SA-3b: 全て null/無効は null", () => {
    expect(
      newestFetchedAt([{ fetchedAt: null }, { fetchedAt: undefined }]),
    ).toBeNull();
  });
});

describe("formatSyncedAt (SA-2)", () => {
  it("SA-2: 「{日時}現在」形式（JST、時は非ゼロ詰め・分 2 桁）", () => {
    // 2026-06-08 08:30 JST = 2026-06-07T23:30:00Z
    const d = new Date("2026-06-07T23:30:00Z");
    expect(formatSyncedAt(d)).toBe("2026年6月8日 8:30 現在");
  });

  it("SA-2b: 分の 0 詰め（09 分 → 09）", () => {
    const d = new Date("2026-06-07T23:09:00Z"); // JST 8:09
    expect(formatSyncedAt(d)).toBe("2026年6月8日 8:09 現在");
  });

  it("SA-2c: null は null（表示なし）", () => {
    expect(formatSyncedAt(null)).toBeNull();
  });
});
