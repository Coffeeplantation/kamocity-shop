import { NextResponse } from 'next/server';
import { fetchLinePhotos } from '@/lib/line/posts';

// ストアのページが読む、LINE から送られた写真の一覧（新しい順）。送ったらすぐ並ぶように、毎回読み直す
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ photos: await fetchLinePhotos(12) });
}
