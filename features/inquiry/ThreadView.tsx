// スレッド表示 — docs/inquiry/001 UC-I2
// 本文は **プレーンテキスト**（React のデフォルトエスケープ＝XSS 防止、SEC-003）。
// dangerouslySetInnerHTML は使わない。

export interface ThreadMessage {
  id: string;
  sender: string; // 'visitor' | 'operator'
  body: string;
}

export function ThreadView({ messages }: { messages: ThreadMessage[] }) {
  if (messages.length === 0) {
    return <p className="text-ink-muted">まだメッセージはありません。</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {messages.map((m) => (
        <li
          key={m.id}
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <span className="text-xs text-ink-muted">
            {m.sender === "operator" ? "運営から" : "あなた"}
          </span>
          <p className="mt-1 whitespace-pre-wrap break-words text-ink">{m.body}</p>
        </li>
      ))}
    </ul>
  );
}
