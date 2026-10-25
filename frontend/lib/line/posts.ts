// LINE 公式アカウントに送られた写真を保存し、道の駅のページに表示する（サーバー側で実行する）。
// LINE には過去のメッセージを読み直す API がないので、届いた写真は Vercel Blob に保存しておく。
// 必要な設定（.env.local / Vercel の環境変数）：
//   BLOB_READ_WRITE_TOKEN … Vercel の Storage で Blob を作ってプロジェクトにつなぐと自動で入る
// 設定がなければ何も読み込まない（ページに写真の欄を出さない）。

import { createHash } from 'node:crypto';
import { del, list, put } from '@vercel/blob';

export const LINE_PHOTOS_PREFIX = 'line-photos/';

export type LinePhoto = { url: string; postedAt: string };

export const linePhotosEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// 送った人を区別するための短い印。LINE のユーザー ID はそのまま URL に出さない
export const senderKey = (id: string) => createHash('sha256').update(id).digest('hex').slice(0, 12);

// ファイル名は「投稿時刻-送った人の印-メッセージ ID」。名前順がそのまま投稿順になる
export async function saveLinePhoto(image: ArrayBuffer, contentType: string, sender: string, messageId: string, at: Date) {
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  await put(`${LINE_PHOTOS_PREFIX}${at.getTime()}-${sender}-${messageId}.${ext}`, image, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function listAll() {
  const blobs = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: LINE_PHOTOS_PREFIX, cursor, limit: 1000 });
    blobs.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
}

// 送った人の、いちばん新しい写真を消す（「取り消し」と送ったとき）。消せたら true
export async function deleteLatestLinePhoto(sender: string) {
  const mine = (await listAll()).find((b) => b.pathname.split('-')[1] === sender);
  if (!mine) return false;
  await del(mine.url);
  return true;
}

// 新しい順に最大 limit 枚
export async function fetchLinePhotos(limit = 12): Promise<LinePhoto[]> {
  if (!linePhotosEnabled()) return [];
  try {
    return (await listAll()).slice(0, limit).map((b) => ({
      url: b.url,
      postedAt: new Date(Number(b.pathname.slice(LINE_PHOTOS_PREFIX.length).split('-')[0])).toISOString(),
    }));
  } catch (e) {
    console.error('LINE の写真の読み込みに失敗しました', e);
    return [];
  }
}
