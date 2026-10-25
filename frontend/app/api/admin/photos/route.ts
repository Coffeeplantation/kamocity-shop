import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/admin';
import { sameOrigin } from '@/lib/auth';
import { LAYOUTS, normalizeStyle, SPACES, type GalleryLayout, type SpaceId } from '@/lib/line/gallery';
import { approveLinePhoto, deleteLinePhoto, fetchAllLinePhotos, lineStoreEnabled, updateGalleryLayout, updateLinePhotoStyle } from '@/lib/line/posts';

// 管理画面（/admin/photos）の受け口。LINE から届いた写真の承認・却下・見せ方の変更と、スペースごとの並べ方の変更。
export const dynamic = 'force-dynamic';

const deny = () => NextResponse.json({ ok: false, error: '管理者としてサインインしてください。' }, { status: 403 });

export async function GET() {
  if (!(await currentAdmin())) return deny();
  if (!lineStoreEnabled()) return NextResponse.json({ ok: false, error: '写真の保存先（Vercel Blob）が設定されていません。' }, { status: 503 });
  return NextResponse.json({ ok: true, ...(await fetchAllLinePhotos()) });
}

type Body =
  | { action: 'approve' | 'style'; id: string; style: unknown }
  | { action: 'reject' | 'remove'; id: string }
  | { action: 'layout'; space: string; layout: string };

export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await currentAdmin())) return deny();
  const body = (await req.json().catch(() => null)) as Body | null;
  try {
    switch (body?.action) {
      case 'approve':
        await approveLinePhoto(body.id, normalizeStyle(body.style));
        break;
      case 'style':
        await updateLinePhotoStyle(body.id, normalizeStyle(body.style));
        break;
      case 'reject':
      case 'remove':
        await deleteLinePhoto(body.id);
        break;
      case 'layout':
        if (!(body.space in SPACES) || !(body.layout in LAYOUTS)) throw new Error('並べ方の指定が正しくありません');
        await updateGalleryLayout(body.space as SpaceId, body.layout as GalleryLayout);
        break;
      default:
        return NextResponse.json({ ok: false, error: '操作の指定が正しくありません。' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : '保存に失敗しました。' }, { status: 400 });
  }
  revalidatePath('/stores');
  revalidatePath('/store');
  return NextResponse.json({ ok: true });
}
