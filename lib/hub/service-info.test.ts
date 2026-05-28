import { describe, it, expect } from "vitest";
import { serviceInfoPayload, isAuthorizedHub } from "./service-info";

// O48 v2 (favicon-projection): service-info の最小固定契約 + 共有シークレット認証
// CF-20260528-019: schemaVersion=2、iconUrl?: string optional
// CF-20260528-010: 全サービス共通シークレット HUB_SERVICE_INFO_SECRET (旧 per-service HUB_SHARED_SECRET 廃止)

describe("serviceInfoPayload (v2)", () => {
  it("最小固定契約 v2 (schemaVersion=2/service/status/generatedAt)", () => {
    const now = new Date("2026-05-27T12:00:00Z");
    const p = serviceInfoPayload(now);
    expect(p).toEqual({
      schemaVersion: 2,
      service: "shipyard",
      status: "up",
      generatedAt: "2026-05-27T12:00:00.000Z",
    });
  });

  it("version は optional (指定時のみ含む)", () => {
    expect(serviceInfoPayload(new Date(), "0.1.0").version).toBe("0.1.0");
    expect(serviceInfoPayload(new Date())).not.toHaveProperty("version");
  });

  it("siteUrl 指定時に iconUrl を組み立てる (v2 favicon-projection)", () => {
    const now = new Date("2026-05-28T00:00:00Z");
    const p = serviceInfoPayload(now, undefined, "https://shipyard.example.com");
    expect(p.iconUrl).toBe("https://shipyard.example.com/icon.svg");
  });

  it("siteUrl 省略時に iconUrl は不在 (v1 互換 path)", () => {
    expect(serviceInfoPayload(new Date())).not.toHaveProperty("iconUrl");
    expect(serviceInfoPayload(new Date(), "0.1.0")).not.toHaveProperty("iconUrl");
  });
});

describe("isAuthorizedHub (HUB_SERVICE_INFO_SECRET v2)", () => {
  it("正しい HUB_SERVICE_INFO_SECRET → true", () => {
    expect(isAuthorizedHub("Bearer hub_secret", "hub_secret")).toBe(true);
  });
  it("不一致/欠落/secret 未設定 → false", () => {
    expect(isAuthorizedHub("Bearer wrong", "hub_secret")).toBe(false);
    expect(isAuthorizedHub(null, "hub_secret")).toBe(false);
    expect(isAuthorizedHub("Bearer x", undefined)).toBe(false);
  });
});
