// Cloudflare Turnstile サーバー検証（injectable）— docs/_shared/spam/001_spam_SPEC.md §2.4
// SECRET はサーバーのみ（SEC-001/O25）。テストは mock verifier を注入。

export interface TurnstileVerifier {
  verify(token: string, ip?: string): Promise<{ success: boolean }>;
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function cloudflareTurnstile(
  secret: string | undefined = process.env.TURNSTILE_SECRET_KEY,
  fetcher: typeof fetch = fetch,
): TurnstileVerifier {
  return {
    async verify(token, ip) {
      const body = new URLSearchParams({ secret: secret ?? "", response: token });
      if (ip) body.set("remoteip", ip);
      const res = await fetcher(SITEVERIFY_URL, { method: "POST", body });
      if (!res.ok) throw new Error(`turnstile siteverify ${res.status}`);
      const data = (await res.json()) as { success?: boolean };
      return { success: !!data.success };
    },
  };
}
