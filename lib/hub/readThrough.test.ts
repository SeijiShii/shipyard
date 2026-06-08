import { describe, it, expect, vi } from "vitest";
import { getStatusReadThrough, type ReadThroughThrottle } from "./cache";
import type {
  StatusCacheRepo,
  ServiceStatusRow,
  StatusCacheInput,
} from "@/lib/db/repositories/statusCache";
import type { PublicStatusResponse } from "./contract";

// docs/service-status/revise_C20260608-001 §003 RT-1..RT-8（read-through refresh）

const NOW = new Date("2026-06-08T00:00:00Z");
const FRESH = new Date("2026-06-07T23:30:00Z"); // now - 30min（TTL 1h 内）
const STALE = new Date("2026-06-07T22:00:00Z"); // now - 2h（TTL 1h 超）

function row(slug: string, fetchedAt: Date | null): ServiceStatusRow {
  return {
    slug,
    name: slug,
    url: `https://${slug}.test`,
    status: "up",
    since: null,
    lastCheckedAt: null,
    iconUrl: null,
    fetchedAt,
  } as unknown as ServiceStatusRow;
}

// upsert で listAll の戻りが置き換わる stateful mock（refresh 後の再取得を再現）
function statefulRepo(initial: ServiceStatusRow[]) {
  let rows = initial;
  const upsertMany = vi.fn(async (input: StatusCacheInput[]) => {
    rows = input.map((r) => row(r.slug, r.fetchedAt ?? NOW));
  });
  const listAll = vi.fn(async () => rows);
  return { repo: { upsertMany, listAll } as unknown as StatusCacheRepo, upsertMany, listAll };
}

function hubResponse(slugs: string[]): PublicStatusResponse {
  return {
    generated_at: NOW.toISOString(),
    services: slugs.map((s) => ({
      slug: s,
      name: s,
      url: `https://${s}.test`,
      status: "up" as const,
    })),
  };
}

function freshThrottle(): ReadThroughThrottle {
  return { lastAttemptAtMs: 0 };
}

describe("getStatusReadThrough", () => {
  it("RT-1: fresh（TTL 内）は HUB を叩かず cache を返す", async () => {
    const { repo } = statefulRepo([row("a", FRESH), row("b", FRESH)]);
    const fetchStatus = vi.fn(async () => hubResponse(["a", "b", "c"]));
    const out = await getStatusReadThrough({
      repo,
      fetchStatus,
      now: NOW,
      ttlSec: 3600,
      throttle: freshThrottle(),
    });
    expect(fetchStatus).not.toHaveBeenCalled();
    expect(out).toHaveLength(2);
  });

  it("RT-2: stale（TTL 超）は refresh して最新を返す（naze-bako 出現相当）", async () => {
    const { repo } = statefulRepo([row("a", STALE), row("b", STALE)]);
    const fetchStatus = vi.fn(async () => hubResponse(["a", "b", "c"]));
    const out = await getStatusReadThrough({
      repo,
      fetchStatus,
      now: NOW,
      ttlSec: 3600,
      throttle: freshThrottle(),
    });
    expect(fetchStatus).toHaveBeenCalledTimes(1);
    expect(out).toHaveLength(3);
  });

  it("RT-3: cache 空は refresh する", async () => {
    const { repo } = statefulRepo([]);
    const fetchStatus = vi.fn(async () => hubResponse(["a"]));
    const out = await getStatusReadThrough({
      repo,
      fetchStatus,
      now: NOW,
      ttlSec: 3600,
      throttle: freshThrottle(),
    });
    expect(fetchStatus).toHaveBeenCalledTimes(1);
    expect(out).toHaveLength(1);
  });

  it("RT-4: ttlSec が短ければ短い stale 判定（env 相当）", async () => {
    const recent = new Date(NOW.getTime() - 2 * 60 * 1000); // now-2min
    const { repo } = statefulRepo([row("a", recent)]);
    const fetchStatus = vi.fn(async () => hubResponse(["a", "b"]));
    const out = await getStatusReadThrough({
      repo,
      fetchStatus,
      now: NOW,
      ttlSec: 60, // 1 分 → 2 分前は stale
      throttle: freshThrottle(),
    });
    expect(fetchStatus).toHaveBeenCalledTimes(1);
    expect(out).toHaveLength(2);
  });

  it("RT-5: refresh 中の HUB fetch 失敗は前回値を返す（graceful、例外を投げない）", async () => {
    const { repo } = statefulRepo([row("a", STALE), row("b", STALE)]);
    const fetchStatus = vi.fn(async () => {
      throw new Error("HUB down");
    });
    const out = await getStatusReadThrough({
      repo,
      fetchStatus,
      now: NOW,
      ttlSec: 3600,
      throttle: freshThrottle(),
    });
    expect(out).toHaveLength(2); // 前回値維持
  });

  it("RT-7: fetchedAt = now - TTL ちょうどは stale（>= で refresh）", async () => {
    const exactly = new Date(NOW.getTime() - 3600 * 1000);
    const { repo } = statefulRepo([row("a", exactly)]);
    const fetchStatus = vi.fn(async () => hubResponse(["a", "b"]));
    await getStatusReadThrough({
      repo,
      fetchStatus,
      now: NOW,
      ttlSec: 3600,
      throttle: freshThrottle(),
    });
    expect(fetchStatus).toHaveBeenCalledTimes(1);
  });

  it("RT-8: throttle 窓内の連続呼び出しは 2 回目に fetch しない", async () => {
    const { repo } = statefulRepo([row("a", STALE)]);
    const throttle = freshThrottle();
    const fetchStatus = vi.fn(async () => {
      throw new Error("HUB down"); // 失敗で fetchedAt は進まない
    });
    await getStatusReadThrough({ repo, fetchStatus, now: NOW, ttlSec: 3600, throttle });
    await getStatusReadThrough({ repo, fetchStatus, now: NOW, ttlSec: 3600, throttle });
    expect(fetchStatus).toHaveBeenCalledTimes(1); // 2 回目は throttle で抑制
  });
});
