import { publicStatusResponseSchema, type PublicStatusResponse } from "./contract";

// HUB status クライアント — docs/_shared/hub-client/001_hub-client_SPEC.md
// fetch は injectable（mock 注入で実 HUB 不要テスト）。Zod で安全サブセットのみ受信。

export interface FetchHubOptions {
  fetcher?: typeof fetch;
  url?: string;
  apiKey?: string;
  timeoutMs?: number;
}

export async function fetchHubStatus(opts: FetchHubOptions = {}): Promise<PublicStatusResponse> {
  const url = opts.url ?? process.env.HUB_STATUS_URL;
  if (!url) throw new Error("HUB_STATUS_URL is not set");
  const fetcher = opts.fetcher ?? fetch;

  const headers: Record<string, string> = { accept: "application/json" };
  const apiKey = opts.apiKey ?? process.env.HUB_STATUS_API_KEY;
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;

  const res = await fetcher(url, {
    headers,
    signal: AbortSignal.timeout(opts.timeoutMs ?? 5000),
  });
  if (!res.ok) throw new Error(`HUB status responded ${res.status}`); // HUB-E1
  const json = await res.json();
  // contract 不一致 / 不正 status は reject、余剰フィールドは strip（HUB-E2/E3/E4）
  return publicStatusResponseSchema.parse(json);
}
