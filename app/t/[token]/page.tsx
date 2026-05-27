import { notFound } from "next/navigation";
import { getRepos } from "@/lib/db/repositories";
import { buildMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { ThreadView } from "@/features/inquiry/ThreadView";
import { ReplyForm } from "@/features/inquiry/ReplyForm";

// /t/[token] — スレッド表示 + 追記。token 検証経由のみ（IDOR、SEC-002）。
// 検索/SNS に拾わせない（noindex、SEC-002）。
export const metadata = buildMetadata({ title: "お問い合わせ", path: "/t", noindex: true });
export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const repos = getRepos();
  const thread = await repos.threads.findByToken(token); // IDOR: token のみが到達経路
  if (!thread) notFound(); // 無効/不在 → 404（列挙耐性、I-E3）
  const messages = await repos.messages.listByThread(thread.id);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-ink">{thread.subject ?? "お問い合わせ"}</h1>
        <div className="mt-6">
          <ThreadView messages={messages} />
        </div>
        {thread.status === "open" ? (
          <ReplyForm token={token} />
        ) : (
          <p className="mt-6 text-sm text-ink-muted">このやり取りは完了しています。</p>
        )}
      </main>
    </>
  );
}
