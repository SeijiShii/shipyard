#!/usr/bin/env bash
# shipyard: .env.production.local を Vercel 永続 env (production) に冪等同期
# release.md §3.1c CF-20260528-008 標準 scaffold。
#
# 前提:
#   - Vercel CLI install + login 済 (`vercel login`)
#   - 本 repo が Vercel project にリンク済 (`vercel link`)
#   - .env.production.local に本番値を記入済 (gitignored)
#
# 動作:
#   - 行頭 # 行 / 空行はスキップ
#   - 値の (空白 + #) インラインコメントを除去 (parse 堅牢化)
#   - 値前後の空白を trim
#   - 空値キーは Vercel production env からも削除 (garbage 防止)
#   - 既存キーは rm → add で冪等 (printf | stdin で秘密がシェル履歴に残らない)
#
# 使い方:
#   bash scripts/sync-prod-env.sh

set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.production.local}"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE が見つかりません。release.md §3.1c に従い作成してください。" >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "❌ vercel CLI が見つかりません。 npm i -g vercel + vercel login + vercel link を実行してください。" >&2
  exit 1
fi

echo "→ $ENV_FILE を Vercel production env に同期します..."

# 行を 1 つずつ処理
while IFS= read -r line || [ -n "$line" ]; do
  # 行頭 # 行 / 空行スキップ
  case "$line" in
    \#*|'') continue ;;
  esac

  # KEY=VALUE 抽出 (= で 1 回分割)
  if [[ "$line" != *"="* ]]; then
    continue
  fi
  key="${line%%=*}"
  val="${line#*=}"

  # 値の (空白 + #) インラインコメント除去
  val="$(printf '%s' "$val" | sed -E 's/[[:space:]]+#.*$//')"
  # 前後空白 trim
  val="$(printf '%s' "$val" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"

  if [ -z "$val" ]; then
    echo "  ⏭  $key (空値、production から削除)"
    vercel env rm "$key" production -y >/dev/null 2>&1 || true
    continue
  fi

  # 既存キー削除 → 新規追加で冪等同期
  vercel env rm "$key" production -y >/dev/null 2>&1 || true
  printf '%s' "$val" | vercel env add "$key" production >/dev/null
  # マスク表示 (末尾 4 文字のみ)
  masked="...${val: -4}"
  echo "  ✓ $key = $masked"
done < "$ENV_FILE"

echo "✅ 同期完了。 bash scripts/deploy-prod.sh で本番デプロイ可能。"
