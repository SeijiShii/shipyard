#!/usr/bin/env bash
# 本番 Neon DB に drizzle migration を適用する (additive、例: service_status_cache.summary 列)。
# DATABASE_URL を .env.production.local (gitignore 済) から読み、drizzle-kit migrate を本番 DB に対して実行。
# ⚠️ Class B: 本番 DB スキーマを変更する。実行は明示承認後のみ。
set -euo pipefail
cd "$(dirname "$0")/.."

PROD=".env.production.local"
[ -f "$PROD" ] || { echo "❌ $PROD がありません (本番 DATABASE_URL の source)"; exit 1; }

DATABASE_URL="$(grep -E '^DATABASE_URL=' "$PROD" | head -1 | cut -d= -f2-)"
[ -n "$DATABASE_URL" ] || { echo "❌ DATABASE_URL が $PROD にありません"; exit 1; }
export DATABASE_URL

echo "→ 本番 Neon に drizzle-kit migrate 実行 (host=${DATABASE_URL#*@})"
npx drizzle-kit migrate
