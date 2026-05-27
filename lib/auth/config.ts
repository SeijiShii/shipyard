// 運用者 allowlist の設定 — docs/_shared/auth/001_auth_SPEC.md §2
// env OPERATOR_EMAILS（カンマ区切り）。秘密ではないが運用者のみ。

// 正規化済みの allowlist（trim + 小文字 + 空要素除去、U-B1）。呼び出し時に env を読む。
export function operatorEmails(): string[] {
  return (process.env.OPERATOR_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
