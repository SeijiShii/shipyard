import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrivacyContent } from "./PrivacyContent";
import { TermsContent } from "./TermsContent";
import { CommerceContent } from "./CommerceContent";
import { Footer } from "@/components/layout/Footer";
import { metadata as privacyMeta } from "@/app/legal/privacy/page";
import { metadata as termsMeta } from "@/app/legal/terms/page";
import { metadata as commerceMeta } from "@/app/legal/commerce/page";

// docs/legal/003 — privacy/terms 内容整合 + metadata（index 可）

describe("PrivacyContent (U-1, U-C1, U-C2)", () => {
  it("U-1: 必須見出しを含む", () => {
    render(<PrivacyContent />);
    expect(screen.getByText("取得する情報")).toBeInTheDocument();
    expect(screen.getByText("利用目的")).toBeInTheDocument();
    expect(screen.getByText("保管期間")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /開示・訂正・削除/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Cookie を使いません/ }),
    ).toBeInTheDocument();
  });

  it("U-C1: 外部 AI 送信なし + cookieless が §6 と一致", () => {
    const { container } = render(<PrivacyContent />);
    const text = container.textContent ?? "";
    expect(text).toContain("外部の AI サービスへ送信することはありません");
    expect(text).toContain("cookieless");
  });

  it("U-C2: 取得項目はメール + 本文のみ（過剰項目を書いていない）", () => {
    const { container } = render(<PrivacyContent />);
    const text = container.textContent ?? "";
    expect(text).toContain("メールアドレス");
    expect(text).toContain("お問い合わせ本文");
    // 過剰な取得項目を謳っていない（取得しないと明記）
    expect(text).toContain("これら以外の個人情報");
  });
});

describe("TermsContent (U-2)", () => {
  it("必須見出し（禁止行為/免責/準拠法）を含む", () => {
    render(<TermsContent />);
    expect(screen.getByText("禁止行為")).toBeInTheDocument();
    expect(screen.getByText("免責")).toBeInTheDocument();
    expect(screen.getByText("準拠法")).toBeInTheDocument();
  });
});

describe("metadata (U-3)", () => {
  it("両ページが title/description を持ち index 可（noindex でない）", () => {
    expect(privacyMeta.title).toBe("プライバシーポリシー — shipyard");
    expect(privacyMeta.description).toBeTruthy();
    expect(privacyMeta.robots).toBeUndefined(); // index 可
    expect(termsMeta.title).toBe("利用規約 — shipyard");
    expect(termsMeta.robots).toBeUndefined();
  });
});

describe("CommerceContent (U-CM1, U-CM2, U-CM3, U-CM5)", () => {
  it("U-CM1: 特商法の法定見出しを含む", () => {
    render(<CommerceContent />);
    expect(screen.getByText("販売事業者")).toBeInTheDocument();
    expect(screen.getByText("代表者")).toBeInTheDocument();
    expect(screen.getByText("所在地")).toBeInTheDocument();
    expect(screen.getByText("お支払い方法")).toBeInTheDocument();
    expect(screen.getByText("提供時期")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /キャンセル・返金/ }),
    ).toBeInTheDocument();
  });

  it("U-CM2: 事業者情報（QUADii / 四伊清司 / メール）を含む", () => {
    const { container } = render(<CommerceContent />);
    const text = container.textContent ?? "";
    expect(text).toContain("QUADii");
    expect(text).toContain("四伊清司");
    expect(text).toContain("quadii.shii@gmail.com");
  });

  it("U-CM3: 業態（作者応援寄付 + 追加オプション、クラファンでない）を明示", () => {
    const { container } = render(<CommerceContent />);
    const text = container.textContent ?? "";
    expect(text).toContain("作者応援寄付");
    expect(text).toContain("追加オプション");
    expect(text).toContain("クラウドファンディングではありません");
  });

  it("U-CM5: 単発のみ — 定期課金/サブスク/解約 条項を含まない（旧 GIVErS 条項の混入防止）", () => {
    const { container } = render(<CommerceContent />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("定期");
    expect(text).not.toContain("継続課金");
    expect(text).not.toContain("サブスク");
    expect(text).not.toContain("解約");
  });
});

describe("commerce metadata (U-CM4)", () => {
  it("title/description を持ち index 可（noindex でない）", () => {
    expect(commerceMeta.title).toBe("特定商取引法に基づく表記 — shipyard");
    expect(commerceMeta.description).toBeTruthy();
    expect(commerceMeta.robots).toBeUndefined(); // index 可（審査担当が到達可能）
  });
});

describe("Footer (U-FT1, U-FT2, U-FT3)", () => {
  it("U-FT1: 特定商取引法に基づく表記リンク（/legal/commerce）を含む", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: "特定商取引法に基づく表記",
    });
    expect(link).toHaveAttribute("href", "/legal/commerce");
  });

  it("U-FT2: 'powered by givers.work' を含む", () => {
    const { container } = render(<Footer />);
    expect(container.textContent ?? "").toContain("powered by givers.work");
  });

  it("U-FT3: 既存リンク（プライバシー / 利用規約）が維持されている", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "プライバシー" })).toHaveAttribute(
      "href",
      "/legal/privacy",
    );
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute(
      "href",
      "/legal/terms",
    );
  });
});
