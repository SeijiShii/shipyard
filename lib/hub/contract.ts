import { z } from "zod";

// HUB 公開 status の contract — docs/_shared/hub-client/001_hub-client_SPEC.md §2
// [論点-001] 実 service-hub MVP との contract 整合 (2026-05-28 確認、CF-20260528-016):
//   - 実 service-hub レスポンス = Service[] (直接配列)、camelCase (lastCheckedAt)
//   - 元 mock contract = { generated_at, services }、snake_case (last_checked_at)
//   - 修正方針 = 実 service-hub 形 (camelCase + 直接配列) を受け入れ、内部互換 (services key) のため transform で wrap
// z.object はデフォルトで未知キーを strip する = 安全サブセットのみ受信 (内部指標 cost/churn 等を破棄、U-E3)。

export const serviceStatusSchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
  status: z.enum(["up", "down", "unknown"]), // 不正値は reject (U-E4)
  since: z.string().optional(),
  lastCheckedAt: z.string().optional(), // 実 service-hub は camelCase (shipyard 内部 DB schema と同じ)
  // service-icons revise (spec-review R3): 無効 URL は service エントリ保持で iconUrl のみ undefined 降格
  iconUrl: z.string().url().optional().catch(undefined),
});

// 実 service-hub は直接 Service[] を返すが、shipyard 内部 consumer は { generated_at, services } 形を期待。
// transform で wrap + generated_at は fetch 時刻を擬似生成 (実 API には含まれない)。
// 互換のため { generated_at, services } 形でも受け入れる union (旧 mock 互換)。
export const publicStatusResponseSchema = z
  .union([
    z.array(serviceStatusSchema), // 実 service-hub (MVP)
    z.object({
      generated_at: z.string(),
      services: z.array(serviceStatusSchema),
    }), // 旧 mock contract 互換
  ])
  .transform((r) =>
    Array.isArray(r)
      ? { generated_at: new Date().toISOString(), services: r }
      : r,
  );

export type ServiceStatus = z.infer<typeof serviceStatusSchema>;
export type PublicStatusResponse = z.infer<typeof publicStatusResponseSchema>;
