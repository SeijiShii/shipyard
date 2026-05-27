import { getRepos } from "@/lib/db/repositories";
import { ThreadList } from "@/features/admin/ThreadList";

// /admin — スレッド一覧（last_activity 降順）。認可は layout（requireOperator）。
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const threads = await getRepos().threads.listRecent(100, 0);
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold text-ink">お問い合わせ</h1>
      <div className="mt-6">
        <ThreadList threads={threads} />
      </div>
    </main>
  );
}
