import { asc, eq } from "drizzle-orm";
import type { DB } from "../client";
import { messages, type MessageSender } from "../schema";

// messageRepo — docs/_shared/db/001_db_SPEC.md §5.2
// body は表示時プレーンテキスト扱い（SEC-003 XSS は表示層/Zod で担保）。

export type Message = typeof messages.$inferSelect;

const SENDERS: MessageSender[] = ["visitor", "operator"];

export function createMessageRepo(db: DB) {
  return {
    // createdAt は通常 DB default。テストの時系列検証用に固定値注入も可（UNIT_TEST §2）。
    async add(input: {
      threadId: string;
      sender: MessageSender;
      body: string;
      createdAt?: Date;
    }): Promise<{ id: string }> {
      if (!SENDERS.includes(input.sender)) {
        throw new Error(`invalid message sender: ${String(input.sender)}`);
      }
      const inserted = await db
        .insert(messages)
        .values({
          threadId: input.threadId,
          sender: input.sender,
          body: input.body,
          ...(input.createdAt ? { createdAt: input.createdAt } : {}),
        })
        .returning({ id: messages.id });
      return { id: inserted[0].id };
    },

    async listByThread(threadId: string): Promise<Message[]> {
      return db
        .select()
        .from(messages)
        .where(eq(messages.threadId, threadId))
        .orderBy(asc(messages.createdAt));
    },
  };
}

export type MessageRepo = ReturnType<typeof createMessageRepo>;
