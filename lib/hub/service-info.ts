// O48 v2 (favicon-projection): service-hub 連携用の標準 service-info エンドポイントの純ロジック。
// 契約 SoT = service-hub 側 (CF-20260528-019 改訂、schemaVersion=2 推奨)。
// HUB が pull するアプリ層指標契約（公開ヘルスとは分離、HUB_SERVICE_INFO_SECRET で認証）。

export interface ServiceInfo {
  schemaVersion: 2;
  service: string;
  status: "up" | "down" | "unknown";
  generatedAt: string;
  version?: string;
  // iconUrl?: producer favicon 絶対 URL (v2 favicon-projection、HUB ダッシュボード表示用)。
  // siteUrl + "/icon.svg" で組み立て (Next.js が app/icon.svg を自動 serve)。
  iconUrl?: string;
  // metrics?: Record<string, number>; // service-hub 契約確定後に追加（active 数 / 機能利用等）
  extra?: Record<string, unknown>;
}

export function serviceInfoPayload(
  now: Date = new Date(),
  version?: string,
  siteUrl?: string,
): ServiceInfo {
  return {
    schemaVersion: 2,
    service: "shipyard",
    status: "up",
    generatedAt: now.toISOString(),
    ...(version ? { version } : {}),
    ...(siteUrl ? { iconUrl: `${siteUrl}/icon.svg` } : {}),
  };
}

// 共有シークレット認証（Authorization: Bearer <HUB_SERVICE_INFO_SECRET>、全サービス共通 1 本）。
export function isAuthorizedHub(authHeader: string | null, secret: string | undefined): boolean {
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}
