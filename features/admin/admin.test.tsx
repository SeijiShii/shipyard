import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { adminReplySchema } from "./replySchema";
import {
  adminReply,
  adminClose,
  type AdminReplyDeps,
  type AdminCloseDeps,
} from "./service";
import { ThreadList } from "./ThreadList";
import { requireOperator } from "@/lib/auth/operator";
import type { ThreadRepo, Thread } from "@/lib/db/repositories/thread";
import type { MessageRepo } from "@/lib/db/repositories/message";
import type { InquirerRepo } from "@/lib/db/repositories/inquirer";

// docs/admin/003 — service(reply/close) + ThreadList + schema + 認可（requireOperator）

const NOW = new Date("2026-05-27T12:00:00Z");
function makeThread(over: Partial<Thread> = {}): Thread {
  return {
    id: "th_1",
    inquirerId: "inq_1",
    token: "TOK",
    subject: "件名",
    status: "open",
    createdAt: NOW,
    lastActivityAt: NOW,
    ...over,
  } as Thread;
}

function replyDeps(thread: Thread | null, email = "user@example.com") {
  const threads = {
    findById: vi.fn(async () => thread),
    touchActivity: vi.fn(async () => {}),
  } as unknown as ThreadRepo;
  const messages = {
    add: vi.fn(async () => ({ id: "m" })),
  } as unknown as MessageRepo;
  const inquirers = {
    findById: vi.fn(async () =>
      email ? { id: "inq_1", email, createdAt: NOW } : null,
    ),
  } as unknown as InquirerRepo;
  const notifyReply = vi.fn(async () => ({ ok: true }));
  return {
    deps: { threads, messages, inquirers, notifyReply } as AdminReplyDeps,
    threads,
    messages,
    notifyReply,
  };
}

describe("adminReply (U-2, U-IR4, U-E4, U-E5)", () => {
  it("U-2: operator message 追加 + touchActivity + 返信通知 (body 含む)", async () => {
    const { deps, threads, messages, notifyReply } = replyDeps(makeThread());
    const res = await adminReply("th_1", "ご返信です", deps);
    expect(res).toEqual({ ok: true });
    expect(messages.add).toHaveBeenCalledWith({
      threadId: "th_1",
      sender: "operator",
      body: "ご返信です",
    });
    expect(threads.touchActivity).toHaveBeenCalledWith("th_1");
    // [論点-006] 案 c reconcile: notifyReply は (to, token, body) で呼ばれる
    expect(notifyReply).toHaveBeenCalledWith(
      "user@example.com",
      "TOK",
      "ご返信です",
    );
  });

  it("U-IR4: 返信通知に運用者返信 body を伝搬する ([論点-006] 案 c reconcile、SEC-001 訪問者本人宛 mail は対象外)", async () => {
    const { deps, notifyReply } = replyDeps(makeThread());
    await adminReply("th_1", "運用者の返信本文", deps);
    const args = JSON.stringify(
      (notifyReply as ReturnType<typeof vi.fn>).mock.calls,
    );
    // 旧 U-P1 (本文を渡さない) は本 revise で反転 → 本文 propagation を機械担保
    expect(args).toContain("運用者の返信本文");
  });

  it("U-E4: 存在しない thread → 404", async () => {
    const { deps, messages } = replyDeps(null);
    expect(await adminReply("nope", "x", deps)).toEqual({
      ok: false,
      status: 404,
    });
    expect(messages.add).not.toHaveBeenCalled();
  });

  it("U-E5: 通知 throw でも message 追加は成功（best-effort）", async () => {
    const { deps, notifyReply, messages } = replyDeps(makeThread());
    (notifyReply as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("resend down"),
    );
    expect(await adminReply("th_1", "x", deps)).toEqual({ ok: true });
    expect(messages.add).toHaveBeenCalled();
  });
});

describe("adminClose (U-3)", () => {
  it("U-3: setStatus(closed)", async () => {
    const threads = {
      findById: vi.fn(async () => makeThread()),
      setStatus: vi.fn(async () => {}),
    } as unknown as ThreadRepo;
    const res = await adminClose("th_1", { threads } as AdminCloseDeps);
    expect(res).toEqual({ ok: true });
    expect(threads.setStatus).toHaveBeenCalledWith("th_1", "closed");
  });

  it("存在しない thread → 404", async () => {
    const threads = {
      findById: vi.fn(async () => null),
      setStatus: vi.fn(),
    } as unknown as ThreadRepo;
    expect(await adminClose("nope", { threads } as AdminCloseDeps)).toEqual({
      ok: false,
      status: 404,
    });
  });
});

describe("replySchema (U-E3)", () => {
  it("空/超過 body は reject、正常は通す", () => {
    expect(adminReplySchema.safeParse({ body: "ok" }).success).toBe(true);
    expect(adminReplySchema.safeParse({ body: "" }).success).toBe(false);
    expect(adminReplySchema.safeParse({ body: "a".repeat(5001) }).success).toBe(
      false,
    );
  });
});

describe("認可ゲート（U-E1, U-E2 — requireOperator がルートの gate）", () => {
  it("未認証 → 401 / allowlist 外 → 403（route が auth.status を返す）", async () => {
    process.env.OPERATOR_EMAILS = "ops@example.com";
    expect(await requireOperator(async () => null)).toEqual({
      ok: false,
      status: 401,
    });
    expect(
      await requireOperator(async () => ({
        userId: "u",
        email: "x@example.com",
      })),
    ).toEqual({
      ok: false,
      status: 403,
    });
    expect(
      (
        await requireOperator(async () => ({
          userId: "u",
          email: "ops@example.com",
        }))
      ).ok,
    ).toBe(true);
  });
});

describe("ThreadList (U-1, U-B1)", () => {
  it("U-1: スレッドをリンク + 状態タグで表示（順序は渡された通り）", () => {
    render(
      <ThreadList
        threads={[
          {
            id: "a",
            subject: "新しい問い合わせ",
            status: "open",
            lastActivityAt: NOW,
          },
          {
            id: "b",
            subject: "完了済み",
            status: "closed",
            lastActivityAt: NOW,
          },
        ]}
      />,
    );
    expect(
      screen.getByRole("link", { name: /新しい問い合わせ/ }),
    ).toHaveAttribute("href", "/admin/threads/a");
    expect(screen.getByText("対応中")).toBeInTheDocument();
    expect(screen.getByText("完了")).toBeInTheDocument();
  });

  it("U-B1: 0 件は EmptyState", () => {
    render(<ThreadList threads={[]} />);
    expect(
      screen.getByText(/まだお問い合わせはありません/),
    ).toBeInTheDocument();
  });
});
