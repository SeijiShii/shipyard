import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrivacyContent } from "./PrivacyContent";
import { TermsContent } from "./TermsContent";
import { metadata as privacyMeta } from "@/app/legal/privacy/page";
import { metadata as termsMeta } from "@/app/legal/terms/page";

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
