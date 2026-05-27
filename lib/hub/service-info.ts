// O48: service-hub 連携用の標準 service-info エンドポイントの純ロジック。
// 契約 SoT = service-hub 側。未確定項目は extra/省略（最小固定 + optional）。
// HUB が pull するアプリ層指標契約（公開ヘルスとは分離、HUB_SHARED_SECRET で認証）。

export interface ServiceInfo {
  schemaVersion: number;
  service: string;
  status: "up" | "down" | "unknown";
  generatedAt: string;
  version?: string;
  // metrics?: Record<string, number>; // service-hub 契約確定後に追加（active 数 / 機能利用等）
  extra?: Record<string, unknown>;
}

export function serviceInfoPayload(now: Date = new Date(), version?: string): ServiceInfo {
  return {
    schemaVersion: 1,
    service: "shipyard",
    status: "up",
    generatedAt: now.toISOString(),
    ...(version ? { version } : {}),
  };
}

// 共有シークレット認証（Authorization: Bearer <HUB_SHARED_SECRET>）。
export function isAuthorizedHub(authHeader: string | null, secret: string | undefined): boolean {
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}
