import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
          {
            slug: "a",
            name: "稼働アプリ",
            url: "https://a.example.com",
            status: "up",
            since: "2026-05-01",
          },
          {
            slug: "b",
            name: "停止アプリ",
            url: "https://b.example.com",
            status: "down",
          },
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
    render(
      <StatusList
        now={NOW}
        services={[{ slug: "x", name: "謎アプリ", status: "???" }]}
      />,
    );
    expect(screen.getByText("確認中")).toBeInTheDocument();
  });
});

// service-icons revise (D20260528-039、Phase 2 UI)
describe("StatusCard ServiceIcon (U-IC2〜U-IC10)", () => {
  it("U-IC2: iconUrl あり → <img src> が DOM に存在 (装飾画像 alt='')", () => {
    const { container } = render(
      <StatusList
        now={NOW}
        services={[
          {
            slug: "hana-memo",
            name: "花メモ",
            url: "https://hana-memo.givers.work/",
            status: "up",
            iconUrl: "https://hana-memo.givers.work/favicon.svg",
          },
        ]}
      />,
    );
    const img = container.querySelector(
      'img[src="https://hana-memo.givers.work/favicon.svg"]',
    );
    expect(img).not.toBeNull();
    // R4: 装飾画像 alt="" + role="presentation"
    expect(img?.getAttribute("alt")).toBe("");
    expect(img?.getAttribute("role")).toBe("presentation");
    expect(img?.getAttribute("loading")).toBe("lazy");
  });

  it("U-IC3: iconUrl 不在 → イニシャル 1 文字 fallback (Array.from で grapheme)", () => {
    const { container } = render(
      <StatusList
        now={NOW}
        services={[
          {
            slug: "a",
            name: "花メモ",
            url: "https://a",
            status: "up",
          },
        ]}
      />,
    );
    // <img> なし
    expect(container.querySelector("img")).toBeNull();
    // イニシャル "花" が表示される
    expect(screen.getByText("花")).toBeInTheDocument();
  });

  it("U-IC4: onError 発火 → React state でフォールバックに切り替え", () => {
    const { container } = render(
      <StatusList
        now={NOW}
        services={[
          {
            slug: "x",
            name: "壊れた",
            url: "https://x",
            status: "up",
            iconUrl: "https://example.com/404.png",
          },
        ]}
      />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    fireEvent.error(img!);
    // フォールバック切替後は <img> 消える + イニシャル "壊" 表示
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("壊")).toBeInTheDocument();
  });

  it("U-IC9: name 空 + iconUrl 不在 → '?' fallback (defensive)", () => {
    render(
      <StatusList
        now={NOW}
        services={[{ slug: "x", name: "", status: "up", url: "https://x" }]}
      />,
    );
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("U-IC10: emoji name + iconUrl 不在 → 絵文字 1 文字 (grapheme cluster)", () => {
    render(
      <StatusList
        now={NOW}
        services={[
          {
            slug: "x",
            name: "🌸花メモ",
            url: "https://x",
            status: "up",
          },
        ]}
      />,
    );
    // Array.from で先頭 grapheme = "🌸"
    expect(screen.getByText("🌸")).toBeInTheDocument();
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
  // fix C20260618-001: toPublicStatus が summary を公開出力に含める (API 層脱落の回帰防止)
  it("U-SUM-pub: summary ありの row は公開出力に summary を含む (fix C20260618-001)", () => {
    const rows = [
      {
        slug: "time-budget",
        name: "時間の家計簿",
        url: "https://time-budget.givers.work",
        status: "up",
        since: null,
        lastCheckedAt: null,
        iconUrl: null,
        summary: "やったことと時間と気分を記録して振り返るアプリ。",
        fetchedAt: new Date("2026-06-18T00:00:00Z"),
      },
    ] as unknown as ServiceStatusRow[];
    const pub = toPublicStatus(rows);
    expect(pub[0].summary).toBe("やったことと時間と気分を記録して振り返るアプリ。");
  });

  it("安全サブセットのみ返す（内部/余剰フィールドを含まない、iconUrl は公開対象）", () => {
    const rows = [
      {
        slug: "a",
        name: "A",
        url: "https://a",
        status: "up",
        since: "2026-01-01",
        lastCheckedAt: null,
        iconUrl: null,
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
      iconUrl: null,
      summary: null,
      fetchedAt: "2026-05-27T00:00:00.000Z",
    });
    expect(pub[0]).not.toHaveProperty("internalCost");
    expect(pub[0]).not.toHaveProperty("lastCheckedAt");
  });

  // service-icons revise (D20260528-039): iconUrl 公開
  it("U-IC5-pub: iconUrl ありの row は公開出力に含む (service-icons revise)", () => {
    const rows = [
      {
        slug: "hana-memo",
        name: "花メモ",
        url: "https://hana-memo.givers.work/",
        status: "up",
        since: null,
        lastCheckedAt: null,
        iconUrl: "https://hana-memo.givers.work/favicon.svg",
        fetchedAt: new Date("2026-05-28T00:00:00Z"),
      },
    ] as unknown as ServiceStatusRow[];
    const pub = toPublicStatus(rows);
    expect(pub[0].iconUrl).toBe("https://hana-memo.givers.work/favicon.svg");
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
