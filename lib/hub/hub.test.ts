import { describe, it, expect, vi } from "vitest";
import {
  serviceStatusSchema,
  publicStatusResponseSchema,
  type PublicStatusResponse,
} from "./contract";
import { MOCK_HUB_STATUS } from "./mock";
import { fetchHubStatus } from "./client";
import { refreshStatusCache, getCachedStatus } from "./cache";
import type {
  StatusCacheRepo,
  StatusCacheInput,
} from "@/lib/db/repositories/statusCache";

// docs/_shared/hub-client/003_hub-client_UNIT_TEST.md — contract / client / cache（実 HUB 不要 mock）

function okResponse(data: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  } as unknown as Response;
}
function errResponse(status: number): Response {
  return { ok: false, status, json: async () => ({}) } as unknown as Response;
}
function mockRepo(rows: Awaited<ReturnType<StatusCacheRepo["listAll"]>> = []) {
  const upsertMany = vi.fn(async (_rows: StatusCacheInput[]) => {});
  const listAll = vi.fn(async () => rows);
  return {
    repo: { upsertMany, listAll } as unknown as StatusCacheRepo,
    upsertMany,
    listAll,
  };
}

describe("contract (U-1, U-E3, U-E4, U-B1, U-B2)", () => {
  it("U-1: 正しい PublicStatusResponse をパース", () => {
    const parsed = publicStatusResponseSchema.parse(MOCK_HUB_STATUS);
    expect(parsed.services).toHaveLength(2);
  });

  it("U-E3: 余剰フィールド（内部指標）は strip", () => {
    const parsed = serviceStatusSchema.parse({
      slug: "x",
      name: "X",
      url: "https://x",
      status: "up",
      cost: 1234, // 内部指標 → 破棄されるべき
      churn: 0.5,
    });
    expect(parsed).not.toHaveProperty("cost");
    expect(parsed).not.toHaveProperty("churn");
  });

  it("U-E4: status 不正値は reject", () => {
    expect(() =>
      serviceStatusSchema.parse({
        slug: "x",
        name: "X",
        url: "u",
        status: "weird",
      }),
    ).toThrow();
  });

  it("U-B1: services 空配列は正常", () => {
    const parsed = publicStatusResponseSchema.parse({
      generated_at: "t",
      services: [],
    });
    expect(parsed.services).toEqual([]);
  });

  it("U-B2: since/lastCheckedAt 欠落は optional として許容", () => {
    const parsed = serviceStatusSchema.parse({
      slug: "x",
      name: "X",
      url: "u",
      status: "up",
    });
    expect(parsed.since).toBeUndefined();
  });

  // CF-20260528-016: 実 service-hub MVP contract 対応 (2026-05-28 実検証)
  it("U-C1: 実 service-hub 形 (直接 Service[]) を accept + services key に wrap", () => {
    const realHubResponse = [
      {
        slug: "hana-memo",
        name: "花メモ",
        url: "https://hana-memo.givers.work/",
        status: "up",
        lastCheckedAt: "2026-05-28T05:07:31.725Z",
      },
    ];
    const parsed = publicStatusResponseSchema.parse(realHubResponse);
    expect(parsed.services).toHaveLength(1);
    expect(parsed.services[0].slug).toBe("hana-memo");
    expect(parsed.services[0].lastCheckedAt).toBe("2026-05-28T05:07:31.725Z");
    expect(parsed.generated_at).toBeTruthy(); // transform で擬似生成
  });

  it("U-C2: camelCase lastCheckedAt が保持される (snake_case ではない)", () => {
    const parsed = serviceStatusSchema.parse({
      slug: "x",
      name: "X",
      url: "https://x",
      status: "up",
      lastCheckedAt: "2026-05-28T00:00:00Z",
    });
    expect(parsed.lastCheckedAt).toBe("2026-05-28T00:00:00Z");
    expect(parsed).not.toHaveProperty("last_checked_at");
  });

  // service-icons revise (D20260528-039、R3 + R7): iconUrl optional + graceful catch
  it("U-IC1: iconUrl ありの parse 成功 + URL 保持", () => {
    const parsed = serviceStatusSchema.parse({
      slug: "hana-memo",
      name: "花メモ",
      url: "https://hana-memo.givers.work/",
      status: "up",
      iconUrl: "https://hana-memo.givers.work/favicon.svg",
    });
    expect(parsed.iconUrl).toBe("https://hana-memo.givers.work/favicon.svg");
  });

  it("U-IC7: 無効 iconUrl は undefined に降格、service エントリは保持 (R3 graceful)", () => {
    const parsed = serviceStatusSchema.parse({
      slug: "x",
      name: "X",
      url: "https://x",
      status: "up",
      iconUrl: "not-a-url",
    });
    expect(parsed.iconUrl).toBeUndefined();
    expect(parsed.slug).toBe("x"); // service エントリは strip されない
  });

  it("U-IC8: 空文字 iconUrl も undefined 降格 (R3)", () => {
    const parsed = serviceStatusSchema.parse({
      slug: "x",
      name: "X",
      url: "https://x",
      status: "up",
      iconUrl: "",
    });
    expect(parsed.iconUrl).toBeUndefined();
  });
});

describe("fetchHubStatus (U-2, U-E1)", () => {
  it("U-2: mock fetch で services を返す", async () => {
    const fetcher = vi.fn(async () => okResponse(MOCK_HUB_STATUS));
    const res = await fetchHubStatus({
      fetcher,
      url: "https://hub.test/status",
    });
    expect(res.services[0].slug).toBe("example-a");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("内部指標が来ても strip して返す", async () => {
    const dirty = {
      generated_at: "t",
      services: [
        { slug: "a", name: "A", url: "u", status: "up", secretCost: 9 },
      ],
    };
    const res = await fetchHubStatus({
      fetcher: vi.fn(async () => okResponse(dirty)),
      url: "https://hub.test",
    });
    expect(res.services[0]).not.toHaveProperty("secretCost");
  });

  it("U-E1: HUB 5xx は例外", async () => {
    await expect(
      fetchHubStatus({
        fetcher: vi.fn(async () => errResponse(503)),
        url: "https://hub.test",
      }),
    ).rejects.toThrow();
  });

  it("URL 未設定は例外", async () => {
    await expect(fetchHubStatus({ fetcher: vi.fn(), url: "" })).rejects.toThrow(
      /HUB_STATUS_URL/,
    );
  });
});

describe("refreshStatusCache (U-3, U-E2) / getCachedStatus (U-4)", () => {
  it("U-3: 成功時 upsertMany を fetched_at 付きで呼ぶ", async () => {
    const { repo, upsertMany } = mockRepo();
    const now = new Date("2026-05-27T12:00:00Z");
    const res = await refreshStatusCache({
      repo,
      fetchStatus: async () => MOCK_HUB_STATUS,
      now,
    });
    expect(res).toEqual({ ok: true, updated: 2 });
    expect(upsertMany).toHaveBeenCalledTimes(1);
    const rows = upsertMany.mock.calls[0][0];
    expect(rows[0]).toMatchObject({ slug: "example-a", fetchedAt: now });
  });

  // service-icons revise (D20260528-039、R7): U-3 拡張 — iconUrl propagation 機械担保
  it("U-3-icon: iconUrl 含む hub response で upsertMany 引数に iconUrl が伝搬する (R1)", async () => {
    const { repo, upsertMany } = mockRepo();
    const res = await refreshStatusCache({
      repo,
      fetchStatus: async () => ({
        generated_at: "2026-05-28T00:00:00Z",
        services: [
          {
            slug: "hana-memo",
            name: "花メモ",
            url: "https://hana-memo.givers.work/",
            status: "up" as const,
            iconUrl: "https://hana-memo.givers.work/favicon.svg",
          },
        ],
      }),
    });
    expect(res).toEqual({ ok: true, updated: 1 });
    const rows = upsertMany.mock.calls[0][0];
    expect(rows[0].iconUrl).toBe("https://hana-memo.givers.work/favicon.svg");
  });

  it("U-3-icon-null: iconUrl 不在の hub response で upsertMany 引数 iconUrl=null", async () => {
    const { repo, upsertMany } = mockRepo();
    await refreshStatusCache({
      repo,
      fetchStatus: async () => MOCK_HUB_STATUS, // mock は iconUrl 持たない
    });
    const rows = upsertMany.mock.calls[0][0];
    expect(rows[0].iconUrl).toBeNull();
  });

  it("U-E2: fetch 失敗時はキャッシュを更新しない（前回値維持）", async () => {
    const { repo, upsertMany } = mockRepo();
    const res = await refreshStatusCache({
      repo,
      fetchStatus: async () => {
        throw new Error("HUB down");
      },
    });
    expect(res).toEqual({ ok: false, kept: true });
    expect(upsertMany).not.toHaveBeenCalled();
  });

  it("U-4: getCachedStatus は listAll を返す", async () => {
    const rows = [{ slug: "a" }] as Awaited<
      ReturnType<StatusCacheRepo["listAll"]>
    >;
    const { repo, listAll } = mockRepo(rows);
    expect(await getCachedStatus({ repo })).toBe(rows);
    expect(listAll).toHaveBeenCalledTimes(1);
  });
});
