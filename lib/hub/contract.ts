import { z } from "zod";

// HUB 公開 status の contract（[論点-001] 提案）— docs/_shared/hub-client/001_hub-client_SPEC.md §2
// z.object はデフォルトで未知キーを strip する = 安全サブセットのみ受信（内部指標 cost/churn 等を破棄、U-E3）。

export const serviceStatusSchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
  status: z.enum(["up", "down", "unknown"]), // 不正値は reject（U-E4）
  since: z.string().optional(),
  last_checked_at: z.string().optional(),
});

export const publicStatusResponseSchema = z.object({
  generated_at: z.string(),
  services: z.array(serviceStatusSchema),
});

export type ServiceStatus = z.infer<typeof serviceStatusSchema>;
export type PublicStatusResponse = z.infer<typeof publicStatusResponseSchema>;
