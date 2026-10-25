import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: '不正なリクエストです。' }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: SESSION_COOKIE, value: '', path: '/', maxAge: 0 });
  return res;
}
