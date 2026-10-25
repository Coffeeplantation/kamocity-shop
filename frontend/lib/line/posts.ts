// LINE 公式アカウントに送られた写真とイベントを保存して読み出す（サーバー側で実行する）。
//   写真     … まず「承認待ち」に置き、管理者が見せ方（lib/line/gallery.ts）を決めて承認すると、選んだスペースに並ぶ
//   イベント … 「【イベント】」で始まるメッセージ。Slack に投稿したイベントと同じ書式で、道の駅のカレンダーに載せる
// LINE には過去のメッセージを読み直す API がないので、届いたものは Vercel Blob に保存しておく。
// 必要な設定（.env.local / Vercel の環境変数）：
//   BLOB_READ_WRITE_TOKEN … Vercel の Storage で Blob を作ってプロジェクトにつなぐと自動で入る
// 設定がなければ何も読み込まない。

import { createHash } from 'node:crypto';
import { copy, del, list, put } from '@vercel/blob';
import { DEFAULT_SETTINGS, DEFAULT_STYLE, normalizeSettings, sortPhotos, type GalleryLayout, type GalleryPhoto, type GallerySettings, type PhotoStyle, type SpaceId } from '@/lib/line/gallery';

export const LINE_PHOTOS_PREFIX = 'line-photos/';
export const LINE_PENDING_PREFIX = 'line-photos-pending/';
export const LINE_EVENTS_PREFIX = 'line-events/';
const SETTINGS_PATH = 'line-photos-meta/settings.json';

export type LineEventPost = { text: string; postedAt: string };

export const lineStoreEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// 送った人を区別するための短い印。LINE のユーザー ID はそのまま URL に出さない
export const senderKey = (id: string) => createHash('sha256').update(id).digest('hex').slice(0, 12);

// ファイル名は「<prefix>投稿時刻-送った人の印-メッセージ ID.拡張子」。名前順がそのまま投稿順になる
const fileName = (prefix: string, at: Date, sender: string, messageId: string, ext: string) => `${prefix}${at.getTime()}-${sender}-${messageId}.${ext}`;
const partsOf = (prefix: string, pathname: string) => {
  const [time, sender] = pathname.slice(prefix.length).split('-');
  return { postedAt: new Date(Number(time)).toISOString(), sender };
};

// 届いた写真は承認待ちに置く。承認前の写真の URL を推測されないよう、ファイル名にランダムな文字を足す
export async function saveLinePhoto(image: ArrayBuffer, contentType: string, sender: string, messageId: string, at: Date) {
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  await put(fileName(LINE_PENDING_PREFIX, at, sender, messageId, ext), image, { access: 'public', contentType, addRandomSuffix: true });
}

// イベントは元の文面のまま保存し、読むときに Slack と同じ読み取り方（parseEventPost）で解釈する
export async function saveLineEvent(text: string, sender: string, messageId: string, at: Date) {
  const body: LineEventPost = { text, postedAt: at.toISOString() };
  await put(fileName(LINE_EVENTS_PREFIX, at, sender, messageId, 'json'), JSON.stringify(body), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// 新しい順
async function listAll(prefix: string) {
  const blobs = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
}

// 送った人の、いちばん新しい写真（またはイベント）を消す。消せたら true
export async function deleteLatestLinePost(prefix: string, sender: string) {
  const mine = (await listAll(prefix)).find((b) => partsOf(prefix, b.pathname).sender === sender);
  if (!mine) return false;
  await del(mine.url);
  return true;
}

// ---- 見せ方の設定（並べ方と、1 枚ずつのスタイル） ----

// 同じ名前で上書きするので、URL に更新時刻を付けて CDN の古い内容を避ける
export async function readGallerySettings(): Promise<GallerySettings> {
  const b = (await list({ prefix: SETTINGS_PATH, limit: 1 })).blobs.find((x) => x.pathname === SETTINGS_PATH);
  if (!b) return DEFAULT_SETTINGS;
  const res = await fetch(`${b.url}?v=${new Date(b.uploadedAt).getTime()}`, { cache: 'no-store' });
  return normalizeSettings(await res.json());
}

export async function writeGallerySettings(settings: GallerySettings) {
  await put(SETTINGS_PATH, JSON.stringify(settings), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
}

const toPhoto = (prefix: string, b: { pathname: string; url: string }, style?: PhotoStyle): GalleryPhoto => ({
  id: b.pathname,
  url: b.url,
  postedAt: partsOf(prefix, b.pathname).postedAt,
  style: style ?? DEFAULT_STYLE,
});

// スペースに載せる写真（承認済みで、そのスペースを選んだもの）と並べ方
export async function fetchLinePhotos(space: SpaceId, limit = 24): Promise<{ layout: GalleryLayout; photos: GalleryPhoto[] }> {
  if (!lineStoreEnabled()) return { layout: DEFAULT_SETTINGS.layouts[space], photos: [] };
  try {
    const [blobs, settings] = await Promise.all([listAll(LINE_PHOTOS_PREFIX), readGallerySettings()]);
    const photos = blobs.map((b) => toPhoto(LINE_PHOTOS_PREFIX, b, settings.photos[b.pathname])).filter((p) => p.style.spaces.includes(space));
    return { layout: settings.layouts[space], photos: sortPhotos(photos).slice(0, limit) };
  } catch (e) {
    console.error('LINE の写真の読み込みに失敗しました', e);
    return { layout: DEFAULT_SETTINGS.layouts[space], photos: [] };
  }
}

// 管理画面用：承認待ちと掲載中のすべて
export async function fetchAllLinePhotos() {
  const [pending, published, settings] = await Promise.all([listAll(LINE_PENDING_PREFIX), listAll(LINE_PHOTOS_PREFIX), readGallerySettings()]);
  return {
    settings,
    pending: pending.map((b) => toPhoto(LINE_PENDING_PREFIX, b)),
    published: sortPhotos(published.map((b) => toPhoto(LINE_PHOTOS_PREFIX, b, settings.photos[b.pathname]))),
  };
}

// 承認：承認待ちから掲載用へ移し、見せ方を保存する
export async function approveLinePhoto(id: string, style: PhotoStyle) {
  if (!id.startsWith(LINE_PENDING_PREFIX)) throw new Error('承認待ちの写真ではありません');
  const b = (await listAll(LINE_PENDING_PREFIX)).find((x) => x.pathname === id);
  if (!b) throw new Error('写真が見つかりません');
  const to = LINE_PHOTOS_PREFIX + id.slice(LINE_PENDING_PREFIX.length);
  await copy(b.url, to, { access: 'public', addRandomSuffix: false, allowOverwrite: true });
  await del(b.url);
  const settings = await readGallerySettings();
  await writeGallerySettings({ ...settings, photos: { ...settings.photos, [to]: style } });
}

// 却下（承認待ちを消す）・掲載をやめる（掲載中を消す）
export async function deleteLinePhoto(id: string) {
  const prefix = id.startsWith(LINE_PENDING_PREFIX) ? LINE_PENDING_PREFIX : id.startsWith(LINE_PHOTOS_PREFIX) ? LINE_PHOTOS_PREFIX : null;
  if (!prefix) throw new Error('写真ではありません');
  const b = (await listAll(prefix)).find((x) => x.pathname === id);
  if (b) await del(b.url);
  const settings = await readGallerySettings();
  if (settings.photos[id]) {
    const photos = { ...settings.photos };
    delete photos[id];
    await writeGallerySettings({ ...settings, photos });
  }
}

export async function updateLinePhotoStyle(id: string, style: PhotoStyle) {
  const settings = await readGallerySettings();
  await writeGallerySettings({ ...settings, photos: { ...settings.photos, [id]: style } });
}

export async function updateGalleryLayout(space: SpaceId, layout: GalleryLayout) {
  const settings = await readGallerySettings();
  await writeGallerySettings({ ...settings, layouts: { ...settings.layouts, [space]: layout } });
}

// sinceMs より後に送られたイベントの文面（新しい順）
export async function fetchLineEventPosts(sinceMs: number, revalidate: number, tags: string[]): Promise<LineEventPost[]> {
  if (!lineStoreEnabled()) return [];
  try {
    const blobs = (await listAll(LINE_EVENTS_PREFIX)).filter((b) => Date.parse(partsOf(LINE_EVENTS_PREFIX, b.pathname).postedAt) > sinceMs).slice(0, 200);
    const posts = await Promise.all(
      blobs.map((b) =>
        fetch(b.url, { next: { revalidate, tags } })
          .then((r) => r.json() as Promise<LineEventPost>)
          .catch(() => null),
      ),
    );
    return posts.filter((p): p is LineEventPost => !!p?.text);
  } catch (e) {
    console.error('LINE のイベントの読み込みに失敗しました', e);
    return [];
  }
}
