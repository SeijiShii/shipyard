import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusList } from "./StatusList";
import { uptimeDays } from "@/lib/service-status/uptime";
import { toPublicStatus, isAuthorizedCron } from "@/lib/service-status/api";
import type { ServiceStatusRow } from "@/lib/db/repositories/statusCache";

// docs/service-status/003 — StatusList / uptime / api（hub-client/repo は別途テスト済）

const NOW = new Date("2026-05-27T12:00:00Z");

describe("StatusList (U-1, U-E1, U-E4)", () => {
  it("U-1: up/down/unknown を StatusCard + リンクで表示", () => {
    render(
      <StatusList
        now={NOW}
        services={[
          { slug: "a", name: "稼働アプリ", url: "https://a.example.com", status: "up", since: "2026-05-01" },
          { slug: "b", name: "停止アプリ", url: "https://b.example.com", status: "down" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /稼働アプリ/ })).toHaveAttribute(
      "href",
      "https://a.example.com",
    );
    expect(screen.getByText("動いています")).toBeInTheDocument();
    expect(screen.getByText("止まっているかも")).toBeInTheDocument();
    expect(screen.getByText("稼働26日")).toBeInTheDocument();
  });

  it("U-E1: 0 件は EmptyState（技術詳細なし）", () => {
    render(<StatusList services={[]} />);
    expect(screen.getByText(/準備中/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument(); // line-art
  });

  it("U-E4: 不明 status は確認中にフォールバック", () => {
    render(<StatusList now={NOW} services={[{ slug: "x", name: "謎アプリ", status: "???" }]} />);
    expect(screen.getByText("確認中")).toBeInTheDocument();
  });
});

describe("uptimeDays (U-2, U-B2)", () => {
  it("since から日数、今日=0、未来=0 クランプ", () => {
    expect(uptimeDays("2026-05-01", NOW)).toBe(26);
    expect(uptimeDays("2026-05-27", NOW)).toBe(0);
    expect(uptimeDays("2026-12-31", NOW)).toBe(0); // 未来 → クランプ
    expect(uptimeDays(null, NOW)).toBeNull();
  });
});

describe("toPublicStatus (U-3, U-B1)", () => {
  it("安全サブセットのみ返す（内部/余剰フィールドを含まない）", () => {
    const rows = [
      {
        slug: "a",
        name: "A",
        url: "https://a",
        status: "up",
        since: "2026-01-01",
        lastCheckedAt: null,
        fetchedAt: new Date("2026-05-27T00:00:00Z"),
        internalCost: 999, // 内部指標（来ても出さない）
      },
    ] as unknown as ServiceStatusRow[];
    const pub = toPublicStatus(rows);
    expect(pub[0]).toEqual({
      slug: "a",
      name: "A",
      url: "https://a",
      status: "up",
      since: "2026-01-01",
      fetchedAt: "2026-05-27T00:00:00.000Z",
    });
    expect(pub[0]).not.toHaveProperty("internalCost");
    expect(pub[0]).not.toHaveProperty("lastCheckedAt");
  });
});

describe("isAuthorizedCron (U-4, U-E2)", () => {
  it("正しい CRON_SECRET → true", () => {
    expect(isAuthorizedCron("Bearer s3cr3t", "s3cr3t")).toBe(true);
  });
  it("不一致/欠落 → false", () => {
    expect(isAuthorizedCron("Bearer wrong", "s3cr3t")).toBe(false);
    expect(isAuthorizedCron(null, "s3cr3t")).toBe(false);
    expect(isAuthorizedCron("Bearer x", undefined)).toBe(false); // secret 未設定は拒否
  });
});
