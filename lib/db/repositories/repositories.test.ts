// @vitest-environment node
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import { sql } from "drizzle-orm";
import { makeTestDb } from "../_test/pglite";
import type { DB } from "../client";
import { createInquirerRepo } from "./inquirer";
import { createThreadRepo } from "./thread";
import { createMessageRepo } from "./message";
import { createRateLimitRepo } from "./rateLimit";
import { createStatusCacheRepo } from "./statusCache";
import { seedStatusCache, DEV_STATUS_SEED } from "../seed";

// docs/_shared/db/003_db_UNIT_TEST.md Phase 2: repository CRUD + 制約 + IDOR
// pglite は node 環境が必要（jsdom だと data ロードで r.arrayBuffer エラー）。
// migrate は重いので 1 度だけ実行し、各テスト前に TRUNCATE でデータ隔離する。

let db: DB;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ db, close } = await makeTestDb());
});
afterAll(async () => {
  await close();
});
beforeEach(async () => {
  await db.execute(
    sql`TRUNCATE TABLE messages, threads, inquirers, rate_limits, service_status_cache RESTART IDENTITY CASCADE`,
  );
});

async function seedInquirer(email = "a@example.com") {
  const { id } = await createInquirerRepo(db).upsertByEmail(email);
  return id;
}
async function seedThread(subject?: string) {
  const inquirerId = await seedInquirer();
  return createThreadRepo(db).create({ inquirerId, subject });
}

describe("inquirerRepo", () => {
  it("U-1: 新規 email で inquirer 作成 + id 返却", async () => {
    const repo = createInquirerRepo(db);
    const { id } = await repo.upsertByEmail("new@example.com");
    expect(id).toBeTruthy();
    expect((await repo.findById(id))?.email).toBe("new@example.com");
  });

  it("U-2: 既存 email は既存 id を返す（重複作成しない）", async () => {
    const repo = createInquirerRepo(db);
    const a = await repo.upsertByEmail("dup@example.com");
    const b = await repo.upsertByEmail("dup@example.com");
    expect(b.id).toBe(a.id);
  });

  it("findById: 存在しない id は null", async () => {
    const repo = createInquirerRepo(db);
    expect(
      await repo.findById("00000000-0000-0000-0000-000000000000"),
    ).toBeNull();
  });
});

describe("threadRepo", () => {
  it("U-3: create が token(base64url, 長さ≥22) を返す", async () => {
    const inquirerId = await seedInquirer();
    const { id, token } = await createThreadRepo(db).create({
      inquirerId,
      subject: "件名",
    });
    expect(id).toBeTruthy();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/); // base64url
    expect(token.length).toBeGreaterThanOrEqual(22); // 128-bit ≈ 22 chars
  });

  it("U-4: findByToken が該当 thread を返す（IDOR 経路, SEC-002）", async () => {
    const inquirerId = await seedInquirer();
    const repo = createThreadRepo(db);
    const { id, token } = await repo.create({ inquirerId });
    const found = await repo.findByToken(token);
    expect(found?.id).toBe(id);
    expect(found?.status).toBe("open");
  });

  it("U-E1: 存在しない token は null", async () => {
    expect(await createThreadRepo(db).findByToken("does-not-exist")).toBeNull();
  });

  it("U-B2: 既定 generator は毎回異なる token を生成", async () => {
    const inquirerId = await seedInquirer();
    const repo = createThreadRepo(db);
    const a = await repo.create({ inquirerId });
    const b = await repo.create({ inquirerId });
    expect(a.token).not.toBe(b.token);
  });

  it("U-E3: token 衝突はリトライ後に成功（最大3回）", async () => {
    const inquirerId = await seedInquirer();
    // 先に COLLIDE トークンの thread を占有
    await createThreadRepo(db, {
      generateToken: () => "COLLIDE_TOKEN_VALUE_0001",
    }).create({
      inquirerId,
    });
    const gen = vi
      .fn<() => string>()
      .mockReturnValueOnce("COLLIDE_TOKEN_VALUE_0001")
      .mockReturnValue("UNIQUE_TOKEN_VALUE_0002");
    const { token } = await createThreadRepo(db, { generateToken: gen }).create(
      { inquirerId },
    );
    expect(token).toBe("UNIQUE_TOKEN_VALUE_0002");
    expect(gen).toHaveBeenCalledTimes(2);
  });

  it("U-E3b: リトライ上限を超える衝突は throw", async () => {
    const inquirerId = await seedInquirer();
    await createThreadRepo(db, { generateToken: () => "ALWAYS_SAME" }).create({
      inquirerId,
    });
    const repo = createThreadRepo(db, { generateToken: () => "ALWAYS_SAME" });
    await expect(repo.create({ inquirerId })).rejects.toThrow(/リトライ上限/);
  });

  it("U-8: setStatus open→closed + touchActivity が last_activity_at を更新", async () => {
    const inquirerId = await seedInquirer();
    const repo = createThreadRepo(db);
    const { id, token } = await repo.create({ inquirerId });
    const before = (await repo.findByToken(token))!;
    await repo.setStatus(id, "closed");
    await new Promise((r) => setTimeout(r, 5));
    await repo.touchActivity(id);
    const after = (await repo.findByToken(token))!;
    expect(after.status).toBe("closed");
    expect(after.lastActivityAt.getTime()).toBeGreaterThanOrEqual(
      before.lastActivityAt.getTime(),
    );
  });

  it("U-E4: 不正な status は拒否", async () => {
    const inquirerId = await seedInquirer();
    const repo = createThreadRepo(db);
    const { id } = await repo.create({ inquirerId });
    await expect(repo.setStatus(id, "foo" as never)).rejects.toThrow();
  });

  it("listRecent: last_activity_at desc + U-B3 offset 範囲外は空配列", async () => {
    const inquirerId = await seedInquirer();
    const repo = createThreadRepo(db);
    const t1 = await repo.create({ inquirerId });
    await new Promise((r) => setTimeout(r, 5));
    const t2 = await repo.create({ inquirerId });
    await new Promise((r) => setTimeout(r, 5));
    await repo.touchActivity(t1.id); // t1 を最新に押し上げ
    const recent = await repo.listRecent(10, 0);
    expect(recent.map((t) => t.id)).toEqual([t1.id, t2.id]);
    expect(await repo.listRecent(10, 99)).toEqual([]);
  });
});

describe("messageRepo", () => {
  it("U-5: add / listByThread を時系列で取得", async () => {
    const { id: threadId } = await seedThread();
    const repo = createMessageRepo(db);
    const base = new Date("2026-05-27T00:00:00Z");
    await repo.add({
      threadId,
      sender: "visitor",
      body: "1",
      createdAt: new Date(base.getTime()),
    });
    await repo.add({
      threadId,
      sender: "operator",
      body: "2",
      createdAt: new Date(base.getTime() + 1000),
    });
    await repo.add({
      threadId,
      sender: "visitor",
      body: "3",
      createdAt: new Date(base.getTime() + 2000),
    });
    const list = await repo.listByThread(threadId);
    expect(list.map((m) => m.body)).toEqual(["1", "2", "3"]);
  });

  it("U-E2: 存在しない thread_id への add は FK 例外", async () => {
    const repo = createMessageRepo(db);
    await expect(
      repo.add({
        threadId: "00000000-0000-0000-0000-000000000000",
        sender: "visitor",
        body: "x",
      }),
    ).rejects.toThrow();
  });

  it("U-E4(sender): 不正な sender は拒否", async () => {
    const { id: threadId } = await seedThread();
    await expect(
      createMessageRepo(db).add({
        threadId,
        sender: "bot" as never,
        body: "x",
      }),
    ).rejects.toThrow();
  });

  it("U-B1: body は空文字 / Unicode・絵文字でも壊れない", async () => {
    const { id: threadId } = await seedThread();
    const repo = createMessageRepo(db);
    await repo.add({ threadId, sender: "visitor", body: "" });
    await repo.add({
      threadId,
      sender: "visitor",
      body: "日本語🚢 absàç <script>",
    });
    const bodies = (await repo.listByThread(threadId)).map((m) => m.body);
    expect(bodies).toContain("");
    expect(bodies).toContain("日本語🚢 absàç <script>");
  });
});

describe("rateLimitRepo", () => {
  it("U-6: 同 key/窓で hitAndCount が増加、別窓は独立", async () => {
    const repo = createRateLimitRepo(db);
    const win = new Date("2026-05-27T00:00:00Z");
    expect(await repo.hitAndCount("hash:abc", win)).toBe(1);
    expect(await repo.hitAndCount("hash:abc", win)).toBe(2);
    expect(await repo.hitAndCount("hash:abc", win)).toBe(3);
    const win2 = new Date("2026-05-27T01:00:00Z");
    expect(await repo.hitAndCount("hash:abc", win2)).toBe(1);
  });
});

describe("statusCacheRepo", () => {
  it("U-7: upsertMany が上書き + listAll で全件取得", async () => {
    const repo = createStatusCacheRepo(db);
    await repo.upsertMany([
      {
        slug: "svc-a",
        name: "Service A",
        url: "https://a",
        status: "up",
        since: "2026-01-01",
      },
      { slug: "svc-b", name: "Service B", url: "https://b", status: "unknown" },
    ]);
    expect(await repo.listAll()).toHaveLength(2);

    await repo.upsertMany([
      { slug: "svc-a", name: "Service A2", url: "https://a2", status: "down" },
    ]);
    const all = await repo.listAll();
    expect(all).toHaveLength(2); // 上書き（行は増えない）
    const a = all.find((r) => r.slug === "svc-a")!;
    expect(a.name).toBe("Service A2");
    expect(a.status).toBe("down");
  });

  it("U-E4(status): 不正な status は拒否", async () => {
    await expect(
      createStatusCacheRepo(db).upsertMany([
        { slug: "x", name: "X", url: "u", status: "weird" as never },
      ]),
    ).rejects.toThrow();
  });

  it("upsertMany([]) は no-op", async () => {
    const repo = createStatusCacheRepo(db);
    await repo.upsertMany([]);
    expect(await repo.listAll()).toEqual([]);
  });

  it("seedStatusCache: dev シードを投入できる（Phase 3）", async () => {
    const n = await seedStatusCache(db);
    expect(n).toBe(DEV_STATUS_SEED.length);
    const all = await createStatusCacheRepo(db).listAll();
    expect(all).toHaveLength(DEV_STATUS_SEED.length);
    expect(all.map((r) => r.slug).sort()).toEqual(
      DEV_STATUS_SEED.map((r) => r.slug).sort(),
    );
  });
});
