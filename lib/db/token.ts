import { randomBytes } from "crypto";

// thread アクセストークン生成（SEC-002 IDOR 防止のアクセスキー）。
// 128-bit（16 byte）の暗号論的乱数を URL-safe base64（base64url, 長さ 22）で表現する。
//
// 注: spec-review R1 で「token 生成は _shared/spam.generateThreadToken に一本化」と決定済。
// _shared/spam 実装時にそちらへ寄せ、本関数は spam からの再エクスポート or 委譲に切り替える。
// それまでの暫定 default 実装として db 層に置く（threadRepo.create は generateToken を
// injectable に受け取るため、後で差し替えても repository 本体は無変更で済む）。
export function generateThreadToken(): string {
  return randomBytes(16).toString("base64url");
}
