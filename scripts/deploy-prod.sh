#!/usr/bin/env bash
# shipyard: 本番デプロイ (sync-prod-env → vercel deploy --prod)
# release.md §3.1c CF-20260528-008 標準 scaffold。
#
# 前提:
#   - .env.production.local に本番値を記入済
#   - Vercel CLI login + vercel link 済
#
# 動作:
#   1. scripts/sync-prod-env.sh で Vercel 永続 env (production) に同期
#   2. vercel deploy --prod (Class B、外部公開、本人承認の上で実行する想定)
#
# 使い方:
#   bash scripts/deploy-prod.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== shipyard 本番デプロイ ==="
echo
echo "[1/2] Vercel 永続 env (production) に .env.production.local を同期..."
bash "$SCRIPT_DIR/sync-prod-env.sh"

echo
echo "[2/2] vercel deploy --prod を実行..."
echo "⚠️  Class B (外部公開)。本人承認済の前提で実行します。"
vercel deploy --prod

echo
echo "✅ デプロイ完了。"
echo "公開後の動作確認:"
echo "  - 公開 URL でトップが表示される (Hero リード文 + 稼働一覧 + ConsultPitch)"
echo "  - /api/* (cron 等) が 200 を返す (vercel logs <url> で確認)"
echo "  - スマホ実機で問い合わせ送信 → スレッド生成 + Resend 通知が届く"
