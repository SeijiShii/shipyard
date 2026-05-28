#!/usr/bin/env bash
# scripts/smoke-prod.sh — production deploy 後のスモークテスト helper
# CF-20260528-025 準拠: deploy URL をスクリプト内で扱い、ユーザーに inline curl を貼らせない
#
# Usage:
#   bash scripts/smoke-prod.sh                           # vercel CLI から最新 prod URL 自動取得
#   bash scripts/smoke-prod.sh https://shipyard.vercel.app  # URL 明示
#   bash scripts/smoke-prod.sh shipyard.givers.work      # subdomain 確定後

set -euo pipefail

URL="${1:-}"

# 1) URL 自動取得 (引数なし時、vercel CLI から)
if [ -z "$URL" ]; then
  if command -v vercel >/dev/null 2>&1; then
    URL="$(vercel ls 2>/dev/null | grep -oE 'https://[a-z0-9.-]+\.vercel\.app' | head -1 || true)"
  fi
fi

if [ -z "$URL" ]; then
  echo "Error: deploy URL not detected." >&2
  echo "Usage: bash scripts/smoke-prod.sh <deploy-url>" >&2
  echo "       (or run after 'vercel deploy --prod' which puts URL in vercel ls)" >&2
  exit 1
fi

# 2) URL 正規化 (https:// 補完)
case "$URL" in
  http://*|https://*) ;;
  *) URL="https://${URL}" ;;
esac

echo "=== Smoke test target: $URL ==="
echo

# 3) /api/services 確認 (cron で埋まる service-hub status cache、起動直後は空配列の可能性)
echo "--- GET /api/services (cron-populated cache) ---"
curl -sS "$URL/api/services" | head -c 400
echo
echo

# 4) /api/cron/refresh-status (auth 必須、401 期待 = ガードが効いている証拠)
echo "--- GET /api/cron/refresh-status (auth gate check, expect 401) ---"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$URL/api/cron/refresh-status"
echo

# 5) landing top (HTML serve 確認)
echo "--- GET / (landing HTML, expect 200) ---"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$URL/"
echo

# 6) /contact (inquiry form HTML serve)
echo "--- GET /contact (inquiry form, expect 200) ---"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$URL/contact"
echo

echo "=== Smoke test complete ==="
echo "Manual check remaining:"
echo "  - Browser/smartphone で $URL を開いて landing 表示 + デザイン崩れなし"
echo "  - /contact からテスト送信 → quadii.shii@gmail.com に Resend 着信"
echo "  - /admin (Clerk sign-in、allowlist quadii.shii@gmail.com のみ通る) で問い合わせ一覧確認"
