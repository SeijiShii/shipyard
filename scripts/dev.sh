#!/usr/bin/env bash
# shipyard ローカル開発 launcher (O36 / concept §4.5.7)
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[dev] env チェック..."
if [ ! -f .env.local ]; then
  echo "  ⚠ .env.local がありません。.env.example をコピーして実値を設定してください:"
  echo "    cp .env.example .env.local"
  echo "  (詳細: docs/PREREQUISITES.md)"
fi

echo "[dev] 依存チェック..."
if [ ! -d node_modules ]; then
  echo "  node_modules 不在 → npm install"
  npm install
fi

# DB マイグレーション (DATABASE_URL があれば)
if [ -f .env.local ] && grep -q "^DATABASE_URL=" .env.local; then
  echo "[dev] db:migrate..."
  npm run db:migrate || echo "  (migrate skip/失敗: schema 未実装の可能性)"
fi

echo "[dev] Next.js dev server 起動 (http://localhost:3000)"
echo "[dev] health: GET /  /  smoke: /api/services /contact"
exec npm run dev
