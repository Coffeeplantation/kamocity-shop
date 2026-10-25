// 管理者かどうかを確かめる（サーバー側で実行する）。サインイン中の会員のメールアドレスが ADMIN_EMAILS に入っていれば管理者（lib/auth.ts）。

import { currentMember, isAdminEmail } from '@/lib/auth';

// 管理者ならメールアドレス、そうでなければ null
export async function currentAdmin(): Promise<string | null> {
  const m = currentMember();
  return m && isAdminEmail(m.email) ? m.email : null;
}
