#!/usr/bin/env bash
# shipyard dev 停止 (O36)。外部 DB(Neon クラウド) は触らない。
set -euo pipefail
echo "[stop] next dev プロセスを停止..."
pkill -f "next dev" 2>/dev/null && echo "  停止しました" || echo "  起動中の next dev はありません"
