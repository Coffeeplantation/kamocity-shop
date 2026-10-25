import { NextResponse } from 'next/server';
import { authEnabled, isAdminEmail, sameOrigin, sessionCookie, tooManyTries, verifyMember } from '@/lib/auth';

// サインイン（右上のアカウントのメニューから）
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: '不正なリクエストです。' }, { status: 403 });
  if (!authEnabled()) return NextResponse.json({ error: 'サインインはまだ準備中です。' }, { status: 503 });
  if (tooManyTries(req)) return NextResponse.json({ error: '何度も失敗したため、しばらくお待ちください。' }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const member = await verifyMember(String(b.email ?? ''), String(b.password ?? '')).catch(() => null);
  if (!member) return NextResponse.json({ error: 'メールアドレスまたはパスワードが間違っています。' }, { status: 401 });
  const res = NextResponse.json({ user: { ...member, admin: isAdminEmail(member.email) } });
  res.cookies.set(sessionCookie(member));
  return res;
}
