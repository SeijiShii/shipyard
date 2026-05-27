import { auth, currentUser } from "@clerk/nextjs/server";
import type { OperatorSession, SessionResolver } from "./operator";

// Clerk から OperatorSession を解決する runtime resolver（実キー必須）。
// requireOperator(clerkSessionResolver) で利用。テストは mock resolver を注入するため本体は未 unit。
export const clerkSessionResolver: SessionResolver = async (): Promise<OperatorSession | null> => {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;
  return { userId, email };
};
