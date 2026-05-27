import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { ConsultPitch } from "./ConsultPitch";
import { ValueSection } from "./ValueSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { metadata } from "@/app/page";

// docs/landing/003 — Hero / ConsultPitch / metadata / JsonLd（稼働一覧埋込は StatusList で被覆）

describe("Hero (U-1)", () => {
  it("リード文 + CTA（href=/contact）", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/動いているサービス/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ご相談はこちら/ })).toHaveAttribute("href", "/contact");
  });
});

describe("ConsultPitch (U-2)", () => {
  it("コンサル文言 + CTA→/contact（煽らない）", () => {
    render(<ConsultPitch />);
    expect(screen.getByText(/AI 駆動開発のご相談/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /お問い合わせへ/ })).toHaveAttribute("href", "/contact");
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
    expect(metadata.title).toBe("shipyard");
    expect(metadata.openGraph).toBeTruthy();
    expect((metadata.twitter as { card?: string })?.card).toBe("summary_large_image");
  });
});

describe("JsonLd（XSS 安全）", () => {
  it("</script> ブレイクアウトを防ぐため < をエスケープ", () => {
    const { container } = render(<JsonLd data={{ "@type": "WebSite", evil: "</script><x>" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    expect(script?.innerHTML).toContain("\\u003c");
    expect(script?.innerHTML).not.toContain("</script>");
  });
});
