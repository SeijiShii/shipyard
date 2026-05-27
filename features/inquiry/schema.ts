import { z } from "zod";

// 入力検証（Zod、SEC-003）— docs/inquiry/001 §2.2
export const BODY_MAX = 5000;

export const inquirySchema = z.object({
  email: z.string().trim().email().max(254),
  body: z.string().trim().min(1).max(BODY_MAX),
  subject: z.string().trim().max(200).optional(),
});

export const replySchema = z.object({
  body: z.string().trim().min(1).max(BODY_MAX),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
