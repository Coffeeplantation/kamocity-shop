import { NextResponse } from 'next/server';
import { authEnabled, createMember, isAdminEmail, sameOrigin, sessionCookie, signupProblem, tooManyTries } from '@/lib/auth';

// 会員登録。登録できたらそのままサインインした状態にする
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: '不正なリクエストです。' }, { status: 403 });
  if (!authEnabled()) return NextResponse.json({ error: '会員登録はまだ準備中です。' }, { status: 503 });
  if (tooManyTries(req)) return NextResponse.json({ error: '時間をおいてもう一度お試しください。' }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as { email?: string; password?: string; nickname?: string };
  const [email, password, nickname] = [String(b.email ?? ''), String(b.password ?? ''), String(b.nickname ?? '')];
  const problem = signupProblem(email, password, nickname);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  try {
    const member = await createMember(email, password, nickname);
    const res = NextResponse.json({ user: { ...member, admin: isAdminEmail(member.email) } });
    res.cookies.set(sessionCookie(member));
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : '登録に失敗しました。' }, { status: 400 });
  }
}
