import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { ConsultPitch } from "./ConsultPitch";
import { ValueSection } from "./ValueSection";
import {
  heroCopy,
  consultPitchCopy,
  valueSectionCopy,
  siteDescription,
  TONE_KEYWORDS,
  ANTI_PATTERN_KEYWORDS,
} from "./copy";
import { JsonLd } from "@/components/seo/JsonLd";
import { metadata } from "@/app/page";

// docs/landing/003 — Hero / ConsultPitch / metadata / JsonLd（稼働一覧埋込は StatusList で被覆）
// 003 + docs/landing/revise_messaging-shift_20260528_*/003_REVISE_UNIT_TEST.md (新規 U-T1〜T4)

describe("Hero (U-1)", () => {
  it("リード文 + CTA（href=/contact）", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/動いているサービス/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ご相談はこちら/ }),
    ).toHaveAttribute("href", "/contact");
  });
});

describe("ConsultPitch (U-2)", () => {
  it("コンサル文言 + CTA→/contact（煽らない）", () => {
    render(<ConsultPitch />);
    expect(screen.getByText(/AI 駆動開発のご相談/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /お問い合わせへ/ }),
    ).toHaveAttribute("href", "/contact");
  });
});

describe("ValueSection (U-B1)", () => {
  it("提供価値の見出し構造", () => {
    render(<ValueSection />);
    expect(screen.getByText("実際に動いている")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});

describe("page metadata (U-3)", () => {
  it("generateMetadata 相当が title/OGP を返す（seo 連携）", () => {
    expect(metadata.title).toBe("givers.work");
    expect(metadata.openGraph).toBeTruthy();
    expect((metadata.twitter as { card?: string })?.card).toBe(
      "summary_large_image",
    );
  });
});

describe("JsonLd（XSS 安全）", () => {
  it("</script> ブレイクアウトを防ぐため < をエスケープ", () => {
    const { container } = render(
      <JsonLd data={{ "@type": "WebSite", evil: "</script><x>" }} />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeTruthy();
    expect(script?.innerHTML).toContain("\\u003c");
    expect(script?.innerHTML).not.toContain("</script>");
  });
});

// docs/landing/revise_messaging-shift_20260528_*/003_REVISE_UNIT_TEST.md §1.1 / §4
// メッセージング転換 (lead-gen → 「共に考える相談相手」スタンス) を機械的に担保する。
// 文言は /flow:wording で書き換えても、スタンスキーワード (少なくとも 1 種類)・アンチパターン NG キーワード非存在 は恒久ガード。

function countKeywords(text: string, keywords: readonly string[]): number {
  return keywords.filter((kw) => text.includes(kw)).length;
}

describe("U-T1: Hero に共に考えるスタンスキーワードがある", () => {
  it("heroCopy.lead (or heading) に TONE_KEYWORDS のうち 1 つ以上を含む", () => {
    const fullText = `${heroCopy.heading} ${heroCopy.lead}`;
    expect(countKeywords(fullText, TONE_KEYWORDS)).toBeGreaterThanOrEqual(1);
  });
});

describe("U-T2: ConsultPitch + Hero 合算で 2 種以上のスタンスキーワード", () => {
  it("LP のどこかで必ずスタンスが読める保証 (合算 2 種類以上)", () => {
    const heroText = `${heroCopy.heading} ${heroCopy.lead}`;
    const pitchText = `${consultPitchCopy.heading} ${consultPitchCopy.body}`;
    const matched = new Set<string>();
    for (const kw of TONE_KEYWORDS) {
      if (heroText.includes(kw) || pitchText.includes(kw)) matched.add(kw);
    }
    expect(matched.size).toBeGreaterThanOrEqual(2);
  });
});

describe("U-T3: metadata description / OGP にスタンスキーワード", () => {
  it("siteDescription (DEFAULT_DESCRIPTION 経由) に TONE_KEYWORDS のうち 1 つ以上", () => {
    expect(
      countKeywords(siteDescription, TONE_KEYWORDS),
    ).toBeGreaterThanOrEqual(1);
  });
  it("page metadata.description にも反映されている", () => {
    const description =
      (metadata.description as string | undefined) ??
      (metadata.openGraph as { description?: string } | undefined)
        ?.description ??
      "";
    expect(countKeywords(description, TONE_KEYWORDS)).toBeGreaterThanOrEqual(1);
  });
});

describe("U-T4: アンチパターン NG キーワードが LP のどこにも含まれない", () => {
  it("Hero/ConsultPitch/Value/siteDescription 合算で ANTI_PATTERN_KEYWORDS が 0 件 (charter §2.2 遵守)", () => {
    const combined = [
      heroCopy.heading,
      heroCopy.lead,
      heroCopy.cta,
      consultPitchCopy.heading,
      consultPitchCopy.body,
      consultPitchCopy.cta,
      ...valueSectionCopy.flatMap((v) => [v.title, v.body]),
      siteDescription,
    ].join(" ");
    const hits = ANTI_PATTERN_KEYWORDS.filter((kw) => combined.includes(kw));
    expect(hits).toEqual([]);
  });
});
