// 稼働日数計算 — docs/service-status/002 §1
// 単一実装は lib/ui/status.daysSince（since→N 日、未来日/欠落を安全に扱う）。re-export で一本化。
export { daysSince as uptimeDays } from "@/lib/ui/status";
