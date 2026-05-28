#!/usr/bin/env bash
# CLI ツール用 env load ラッパ (CF-20260528-015、release.md §3.1c scaffold 拡張案)
# Next.js は .env.development.local を自動 load するが、drizzle-kit / playwright / 自前 scripts
# 等の CLI ツールは自前で env load しないと値が見えない。本 launcher で Next.js の
# env 読込順を CLI でも再現し、PJ ごとに config 個別パッチを避ける (drift 防止)。
#
# 優先順位 (後勝ち、Next.js 慣習に近似):
#   .env → .env.local → .env.development.local
#
# 使い方:
#   bash scripts/with-env.sh <command...>
# 例:
#   bash scripts/with-env.sh drizzle-kit migrate
#   bash scripts/with-env.sh playwright test
#
# package.json scripts では `"db:migrate": "bash scripts/with-env.sh drizzle-kit migrate"` の形で wrap。
#
# 本番 (.env.production.local) は本 launcher の対象外 (Phase 3 で deploy-target env 同期スクリプト
# scripts/sync-prod-env.sh が担当)。
#
# 重要: bash の `source` (.) は KEY=VALUE 内の `&` `;` `|` 等を特殊文字として parse するため
# URL query (?sslmode=require&channel_binding=require 等) を壊す。本実装は dotenv 互換の
# 手動 parse で安全に export する。

set -euo pipefail

load_env() {
  local f="$1"
  [ -f "$f" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    # 行頭 # 行 / 空行スキップ
    case "$line" in
      \#*|'') continue ;;
    esac
    # KEY=VALUE 形式のみ処理
    case "$line" in
      *=*)
        local key="${line%%=*}"
        local value="${line#*=}"
        # key の前後空白 trim (bash 拡張)
        key="${key#"${key%%[![:space:]]*}"}"
        key="${key%"${key##*[![:space:]]}"}"
        # value の前後の引用符を剥がす (dotenv 互換、両端の " or ' のみ)
        if [[ "$value" == \"*\" ]]; then
          value="${value:1:${#value}-2}"
        elif [[ "$value" == \'*\' ]]; then
          value="${value:1:${#value}-2}"
        fi
        export "$key=$value"
        ;;
    esac
  done < "$f"
}

load_env .env
load_env .env.local
load_env .env.development.local

if [ $# -eq 0 ]; then
  echo "usage: bash scripts/with-env.sh <command...>" >&2
  exit 2
fi

exec "$@"
