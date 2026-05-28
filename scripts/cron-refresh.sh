#!/usr/bin/env bash
# DEV 用 status cache refresh ヘルパ (CF-20260528-017)
# Vercel Cron は DEV では動かないため手動で叩く。Phase 2 ローカル動作確認で稼働一覧を表示する用途。
#
# 前提:
#   - dev server (localhost:3000) が起動中 (`npm run dev`)
#   - .env.development.local に CRON_SECRET 設定済
#   - HUB_STATUS_URL = service-hub の公開 endpoint 設定済
#
# 使い方:
#   bash scripts/cron-refresh.sh
#
# 成功の見分け方:
#   {"ok":true,"updated":N}  ← service-hub から N 件取得 + Neon cache 保存

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-3000}"

exec bash "$SCRIPT_DIR/with-env.sh" bash -c '
  curl -sS \
    -H "Authorization: Bearer $CRON_SECRET" \
    "http://localhost:'"$PORT"'/api/cron/refresh-status"
  echo
'
