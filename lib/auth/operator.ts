import { operatorEmails } from "./config";

// 運用者認可（Clerk 非依存の純ロジック）— docs/_shared/auth/001_auth_SPEC.md
// SEC-002: admin は Clerk 認証 + allowlist の二重防御。本ファイルは allowlist 判定 +
// 認可判定 + 保護パス判定を提供（Clerk セッション取得は lib/auth/clerk.ts に分離）。

export interface OperatorSession {
  userId: string;
  email: string | null;
}

export type SessionResolver = () => Promise<OperatorSession | null>;

export type RequireResult =
  | { ok: true; session: OperatorSession }
  | { ok: false; status: 401 | 403 };

// allowlist 判定（大文字小文字を無視、空/不正は false、U-1/U-E3）。
export function isOperator(email: string | null | undefined): boolean {
  if (!email) return false;
  return operatorEmails().includes(email.trim().toLowerCase());
}

// admin 保護対象パス。訪問者導線（/, /contact, /t/*, /services, /legal）は含めない（D004、U-B2）。
const PROTECTED_PATTERNS = [/^\/admin(\/.*)?$/, /^\/api\/admin(\/.*)?$/];
export function isProtectedAdminPath(pathname: string): boolean {
  return PROTECTED_PATTERNS.some((re) => re.test(pathname));
}

// セッション解決を injectable に受け、認可結果を返す（実 Clerk 不要でテスト可能）。
// 未認証=401 / 認証済だが allowlist 外=403（詳細は返さない、SEC-001）。
export async function requireOperator(resolve: SessionResolver): Promise<RequireResult> {
  const session = await resolve();
  if (!session) return { ok: false, status: 401 }; // AUTH-E1
  if (!isOperator(session.email)) return { ok: false, status: 403 }; // AUTH-E2/E3
  return { ok: true, session };
}
