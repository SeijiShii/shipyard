import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { STATUS_LABEL, normalizeStatus, daysSince } from "@/lib/ui/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status/StatusBadge";
import { StatusCard } from "@/components/status/StatusCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InfoButton } from "@/components/ui/InfoButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressFeedback } from "@/components/ui/ProgressFeedback";

// docs/_shared/ui/003_ui_UNIT_TEST.md — role/text 起点（class 名に過度依存しない）

describe("status map (lib/ui/status)", () => {
  it("ラベルは一般向け（O38、技術用語なし）", () => {
    expect(STATUS_LABEL.up).toBe("動いています");
    expect(STATUS_LABEL.down).toBe("止まっているかも");
    expect(STATUS_LABEL.unknown).toBe("確認中");
  });

  it("未知 status は unknown フォールバック（分岐 100%）", () => {
    expect(normalizeStatus("up")).toBe("up");
    expect(normalizeStatus("down")).toBe("down");
    expect(normalizeStatus("unknown")).toBe("unknown");
    expect(normalizeStatus("weird")).toBe("unknown");
    expect(normalizeStatus(null)).toBe("unknown");
    expect(normalizeStatus(undefined)).toBe("unknown");
  });

  it("daysSince は since からの日数（now 注入で再現性）", () => {
    const now = new Date("2026-05-27T12:00:00Z");
    expect(daysSince("2026-05-01", now)).toBe(26);
    expect(daysSince(null, now)).toBeNull();
    expect(daysSince("not-a-date", now)).toBeNull();
  });
});

describe("Button (U-1, U-B3)", () => {
  it("role=button + children 表示 + onClick 発火", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>送信</Button>);
    const btn = screen.getByRole("button", { name: "送信" });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("variant ごとに描画される", () => {
    render(
      <>
        <Button variant="primary">P</Button>
        <Button variant="secondary">S</Button>
        <Button variant="ghost">G</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "P" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "G" })).toBeInTheDocument();
  });

  it("U-B3: disabled で aria-disabled + クリック無効", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        無効
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "無効" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Input / Textarea (U-4)", () => {
  it("入力が反映される + focus ring クラス", () => {
    render(<Input aria-label="お名前" placeholder="お名前" />);
    const input = screen.getByLabelText("お名前") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "山田" } });
    expect(input.value).toBe("山田");
    expect(input.className).toMatch(/focus-visible:ring/);
  });

  it("Textarea も入力反映", () => {
    render(<Textarea aria-label="本文" />);
    const ta = screen.getByLabelText("本文") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "問い合わせ本文" } });
    expect(ta.value).toBe("問い合わせ本文");
  });
});

describe("StatusBadge (U-3, U-E1, U-B2)", () => {
  it("U-3: status ごとの plain ラベル", () => {
    const { rerender } = render(<StatusBadge status="up" />);
    expect(screen.getByText("動いています")).toBeInTheDocument();
    rerender(<StatusBadge status="down" />);
    expect(screen.getByText("止まっているかも")).toBeInTheDocument();
    rerender(<StatusBadge status="unknown" />);
    expect(screen.getByText("確認中")).toBeInTheDocument();
  });

  it("U-E1: 未知 status は確認中にフォールバック", () => {
    render(<StatusBadge status="garbage" />);
    expect(screen.getByText("確認中")).toBeInTheDocument();
  });

  it("U-B2: ラベル単独で識別できる（色のみに依存しない）", () => {
    render(<StatusBadge status="up" />);
    // テキストノードが存在 = 色覚に依存せず識別可能
    expect(screen.getByText("動いています")).toBeVisible();
  });
});

describe("StatusCard (U-2, U-E2)", () => {
  const now = new Date("2026-05-27T12:00:00Z");

  it("U-2: name + 稼働日数表示 + url リンク（href 正しい）", () => {
    render(
      <StatusCard
        service={{
          slug: "a",
          name: "メモアプリ",
          url: "https://memo.example.com",
          status: "up",
          since: "2026-05-01",
        }}
        now={now}
      />,
    );
    const link = screen.getByRole("link", { name: /メモアプリ/ });
    expect(link).toHaveAttribute("href", "https://memo.example.com");
    expect(screen.getByText("メモアプリ")).toBeInTheDocument();
    expect(screen.getByText("稼働26日")).toBeInTheDocument();
  });

  it("U-E2: url 欠落時はリンク化しない（非クリック）", () => {
    render(
      <StatusCard
        service={{
          slug: "b",
          name: "停止中アプリ",
          status: "down",
          since: null,
        }}
        now={now}
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("停止中アプリ")).toBeInTheDocument();
  });
});

describe("Header (U-5) / Footer", () => {
  it("U-5: ワードマーク + お問い合わせ（about リンクなし）", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "shipyard" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "お問い合わせ" })).toHaveAttribute(
      "href",
      "/contact",
    );
    // 「これは何？」(/about) リンクは削除済み（LP 自体が説明 = O41 充足、revise_remove-about-link_20260529）
    expect(screen.queryByRole("link", { name: "これは何？" })).toBeNull();
    expect(
      screen
        .queryAllByRole("link")
        .some((a) => a.getAttribute("href") === "/about"),
    ).toBe(false);
  });

  it("Footer: 法務リンク + 控えめなメイカー文脈", () => {
    render(<Footer year={2026} />);
    expect(screen.getByRole("link", { name: "プライバシー" })).toHaveAttribute(
      "href",
      "/legal/privacy",
    );
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute(
      "href",
      "/legal/terms",
    );
    expect(screen.getByText(/週1ペース/)).toBeInTheDocument();
  });
});

describe("InfoButton (O41)", () => {
  it("クリックでモーダル開閉", () => {
    render(<InfoButton>このサイトの説明です。</InfoButton>);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "これは何？" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("このサイトの説明です。")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("EmptyState (U-7)", () => {
  it("line-art（svg role=img）+ 文言", () => {
    render(<EmptyState message="まだ問い合わせはありません" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("まだ問い合わせはありません")).toBeInTheDocument();
  });
});

describe("ProgressFeedback (U-6)", () => {
  const stages = [
    "送信内容を確認しています",
    "スレッドを用意しています",
    "完了しました",
  ];

  it("current に連動した段階文言（嘘進捗でない）", () => {
    const { rerender } = render(
      <ProgressFeedback stages={stages} current={0} />,
    );
    expect(screen.getByText("送信内容を確認しています")).toBeInTheDocument();
    rerender(<ProgressFeedback stages={stages} current={1} />);
    expect(screen.getByText("スレッドを用意しています")).toBeInTheDocument();
  });

  it("current が範囲外でも安全（最後にクランプ）", () => {
    render(<ProgressFeedback stages={stages} current={99} />);
    expect(screen.getByText("完了しました")).toBeInTheDocument();
  });

  it("role=status で aria-live", () => {
    render(<ProgressFeedback stages={stages} current={0} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});
