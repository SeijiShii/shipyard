import { z } from "zod";

// 運用者返信の入力検証（Zod、SEC-003）— docs/admin/001 §4 A-E3
export const adminReplySchema = z.object({
  body: z.string().trim().min(1).max(5000),
});
