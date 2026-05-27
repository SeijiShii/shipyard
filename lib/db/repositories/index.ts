import { getDb } from "../client";
import { createInquirerRepo } from "./inquirer";
import { createThreadRepo } from "./thread";
import { createMessageRepo } from "./message";
import { createRateLimitRepo } from "./rateLimit";
import { createStatusCacheRepo } from "./statusCache";

export * from "./inquirer";
export * from "./thread";
export * from "./message";
export * from "./rateLimit";
export * from "./statusCache";

// アプリ用エルゴノミクス: getDb() に束ねた repository 一式を返す。
// テストは各 create*Repo(testDb) を直接使う（DI）。
export function getRepos() {
  const db = getDb();
  return {
    inquirers: createInquirerRepo(db),
    threads: createThreadRepo(db),
    messages: createMessageRepo(db),
    rateLimits: createRateLimitRepo(db),
    statusCache: createStatusCacheRepo(db),
  };
}
