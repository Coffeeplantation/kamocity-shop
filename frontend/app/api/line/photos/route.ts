import { NextResponse } from 'next/server';
import { SPACES, type SpaceId } from '@/lib/line/gallery';
import { fetchLinePhotos } from '@/lib/line/posts';

// 写真を載せるスペースが読む、承認済みの写真と並べ方。承認したらすぐ並ぶように、毎回読み直す
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const s = new URL(req.url).searchParams.get('space') ?? 'stores';
  const space: SpaceId = s in SPACES ? (s as SpaceId) : 'stores';
  return NextResponse.json(await fetchLinePhotos(space));
}
