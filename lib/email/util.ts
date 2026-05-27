// メール基盤の小ユーティリティ — docs/_shared/email/001_email_SPEC.md（SEC-001 PII）

// ログ/エラー文字列からメアド平文をマスク（U-P2、SEC-001）。
export function maskEmail(s: string): string {
  return s.replace(/[\w.+-]+@[\w.-]+\.\w+/g, "[email]");
}

// テンプレに差し込む動的値の HTML エスケープ。
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
