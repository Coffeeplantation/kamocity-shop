import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { deleteLatestLinePhoto, saveLinePhoto, senderKey } from '@/lib/line/posts';

// LINE 公式アカウント（Messaging API）の受け口。公式アカウントに写真を送ると、道の駅のページに載る。
// LINE Developers のチャネルの「Messaging API 設定」で Webhook URL に https://<サイト>/api/line/webhook を設定し、
// 「Webhook の利用」をオンにする。グループで使うときは、公式アカウントをグループに招待する。
// 必要な設定：
//   LINE_CHANNEL_SECRET        … チャネル基本設定のチャネルシークレット（LINE からの通信か確かめる）
//   LINE_CHANNEL_ACCESS_TOKEN  … Messaging API 設定のチャネルアクセストークン（写真のダウンロードと返信）
//   LINE_ALLOWED_IDS           … 掲載してよい送り主のユーザー ID / グループ ID（カンマ区切り）。
//                                 許可されていない人が写真を送ると、その人の ID を返信するので、それをここに足す

export const dynamic = 'force-dynamic';

function verified(req: Request, body: string) {
  const secret = process.env.LINE_CHANNEL_SECRET;
  const sig = req.headers.get('x-line-signature');
  if (!secret || !sig) return false;
  const a = Buffer.from(createHmac('sha256', secret).update(body).digest('base64'));
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

type Source = { type: 'user' | 'group' | 'room'; userId?: string; groupId?: string; roomId?: string };
type LineEvent = {
  type: string;
  timestamp: number;
  replyToken?: string;
  source: Source;
  message?: {
    id: string;
    type: string;
    text?: string;
    contentProvider?: { type: string };
    imageSet?: { index: number; total: number };
  };
};

const token = () => process.env.LINE_CHANNEL_ACCESS_TOKEN;
const allowedIds = () => (process.env.LINE_ALLOWED_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

async function reply(replyToken: string | undefined, text: string) {
  if (!replyToken) return;
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyToken, messages: [{ type: 'text', text }] }),
  }).catch((e) => console.error('LINE への返信に失敗しました', e));
}

// 戻り値：ページを作り直す必要があれば true
async function handle(e: LineEvent): Promise<boolean> {
  const m = e.message;
  if (e.type !== 'message' || !m) return false;
  const userId = e.source.userId ?? '';
  const allowed = allowedIds();
  const ok = [userId, e.source.groupId, e.source.roomId].some((id) => id && allowed.includes(id));

  if (m.type === 'image') {
    if (!ok) {
      // グループでは関係ない写真もあるので、1 対 1 のトークのときだけ ID を返す
      if (e.source.type === 'user') await reply(e.replyToken, `まだサイトに載せる設定になっていません。管理者にこの ID を伝えてください：\n${userId}`);
      return false;
    }
    // 外部 URL の画像（LINE 以外が持っている画像）は扱わない
    if (m.contentProvider && m.contentProvider.type !== 'line') return false;
    const res = await fetch(`https://api-data.line.me/v2/bot/message/${m.id}/content`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) {
      console.error(`LINE の写真のダウンロードに失敗しました：${res.status}`);
      await reply(e.replyToken, '写真を受け取れませんでした。もう一度送ってください。');
      return false;
    }
    await saveLinePhoto(await res.arrayBuffer(), res.headers.get('content-type') ?? 'image/jpeg', senderKey(userId), m.id, new Date(e.timestamp));
    // 複数枚まとめて送られたときは、最後の 1 枚で 1 回だけ返信する
    if (!m.imageSet || m.imageSet.index === m.imageSet.total) {
      await reply(e.replyToken, 'サイトに掲載しました。取り消すときは「取り消し」と送ってください。');
    }
    return true;
  }

  if (m.type === 'text' && ok && m.text?.trim() === '取り消し') {
    const deleted = await deleteLatestLinePhoto(senderKey(userId));
    await reply(e.replyToken, deleted ? 'いちばん新しい写真をサイトから外しました。' : '外せる写真がありません。');
    return deleted;
  }
  return false;
}

export async function POST(req: Request) {
  const body = await req.text();
  if (!verified(req, body)) return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });

  const { events = [] } = JSON.parse(body) as { events?: LineEvent[] };
  // Webhook URL の「検証」ボタンは events が空で届くので、そのまま 200 を返す
  const results = await Promise.all(
    events.map((e) =>
      handle(e).catch((err) => {
        console.error('LINE のイベント処理に失敗しました', err);
        return false;
      }),
    ),
  );
  if (results.some(Boolean)) revalidatePath('/stores');
  return NextResponse.json({ ok: true });
}
