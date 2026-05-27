import { randomBytes } from "crypto";

// thread アクセストークンの単一生成元（spec-review R1、SEC-002）。
// 128-bit（16 byte）暗号論的乱数を URL-safe base64（長さ 22）で表現。
// db.threadRepo.create はこれを呼んで生成し、UNIQUE 衝突時は repo がリトライ（再呼出）。
export function generateThreadToken(): string {
  return randomBytes(16).toString("base64url");
}
