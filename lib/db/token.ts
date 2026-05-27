// token 生成の単一責務は _shared/spam（spec-review R1、SEC-002）。二重定義しないため
// db 層からは re-export のみ（threadRepo.create のデフォルト generator として利用）。
// spam/token.ts は crypto のみに依存するため循環参照は生じない。
export { generateThreadToken } from "@/lib/spam/token";
