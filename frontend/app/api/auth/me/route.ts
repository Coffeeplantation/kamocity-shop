import { NextResponse } from 'next/server';
import { currentMember, isAdminEmail } from '@/lib/auth';

// いまサインインしている会員（していなければ null）と、管理者かどうか
export const dynamic = 'force-dynamic';

export async function GET() {
  const m = currentMember();
  return NextResponse.json({ user: m ? { ...m, admin: isAdminEmail(m.email) } : null });
}
