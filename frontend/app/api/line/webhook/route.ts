import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { tokyoNow, weekday, WEEKDAYS } from '@/lib/jpCalendar';
import { deleteLatestLinePost, LINE_EVENTS_PREFIX, LINE_PENDING_PREFIX, saveLineEvent, saveLinePhoto, senderKey } from '@/lib/line/posts';
import { EVENT_POST_TEMPLATE, parseEventPost } from '@/lib/slack/eventPost';
import { POSTED_EVENTS_TAG } from '@/lib/slack/postedEvents';

// LINE 公式アカウント（Messaging API）の受け口。
//   写真を送る                     … 誰でも送れる。承認待ちに置かれ、管理者が /admin/photos で見せ方を決めて承認すると載る。
//                                    「取り消し」で、承認前の最後の 1 枚を取り下げる
//   「【イベント】」で始まる文を送る … 許可した人だけ。道の駅のカレンダーに載る（書式は Slack と同じ）。「イベント取り消し」で最後の 1 件を外す
// LINE Developers のチャネルの「Messaging API 設定」で Webhook URL に https://<サイト>/api/line/webhook を設定し、
// 「Webhook の利用」をオンにする。グループで使うときは、公式アカウントをグループに招待する。
// 必要な設定：
//   LINE_CHANNEL_SECRET        … チャネル基本設定のチャネルシークレット（LINE からの通信か確かめる）
//   LINE_CHANNEL_ACCESS_TOKEN  … Messaging API 設定のチャネルアクセストークン（写真のダウンロードと返信）
//   LINE_ALLOWED_IDS           … イベントを載せてよい送り主のユーザー ID / グループ ID（カンマ区切り）。
//                                 許可されていない人がイベントを送ると、その人の ID を返信するので、それをここに足す

export const dynamic = 'force-dynamic';

// 受け付ける写真：種類は JPEG・PNG・WebP、大きさは 10MB まで。Webhook の本文は 1MB まで
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_BODY = 1024 * 1024;

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

async function handle(e: LineEvent): Promise<void> {
  const m = e.message;
  // メッセージ ID は数字だけ（ファイル名や URL に使うので、それ以外は受け付けない）
  if (e.type !== 'message' || !m || !/^\d+$/.test(m.id)) return;
  const userId = e.source.userId ?? '';
  const allowed = allowedIds();
  const ok = [userId, e.source.groupId, e.source.roomId].some((id) => id && allowed.includes(id));

  const text = m.type === 'text' ? (m.text ?? '').trim() : '';
  const isEvent = /^【\s*イベント\s*】/.test(text);

  if (isEvent) {
    if (!ok) {
      // グループでは関係ない投稿もあるので、1 対 1 のトークのときだけ ID を返す
      if (e.source.type === 'user') await reply(e.replyToken, `まだサイトに載せる設定になっていません。管理者にこの ID を伝えてください：\n${userId}`);
      return;
    }
  }

  if (isEvent) {
    const at = new Date(e.timestamp);
    const ev = parseEventPost(text, tokyoNow(at).date);
    if (!ev) {
      await reply(e.replyToken, `日付・時間・場所が読み取れませんでした。この形で送ってください：\n\n${EVENT_POST_TEMPLATE}`);
      return;
    }
    await saveLineEvent(text, senderKey(userId), m.id, at);
    revalidateTag(POSTED_EVENTS_TAG);
    revalidatePath('/stores');
    const [y, mo, d] = ev.date.split('-').map(Number);
    await reply(e.replyToken, `カレンダーに載せました：${mo}/${d}（${WEEKDAYS[weekday({ y, m: mo, d })]}）${ev.start}〜 ${ev.title}\n外すときは「イベント取り消し」と送ってください。`);
    return;
  }

  if (m.type === 'image') {
    // 外部 URL の画像（LINE 以外が持っている画像）は扱わない
    if (m.contentProvider && m.contentProvider.type !== 'line') return;
    const res = await fetch(`https://api-data.line.me/v2/bot/message/${m.id}/content`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) {
      console.error(`LINE の写真のダウンロードに失敗しました：${res.status}`);
      await reply(e.replyToken, '写真を受け取れませんでした。もう一度送ってください。');
      return;
    }
    const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
    const image = await res.arrayBuffer();
    if (!IMAGE_TYPES.includes(type) || image.byteLength > MAX_IMAGE) {
      await reply(e.replyToken, '送れる写真は JPEG・PNG・WebP で、10MB までです。');
      return;
    }
    await saveLinePhoto(image, type, senderKey(userId), m.id, new Date(e.timestamp));
    // 複数枚まとめて送られたときは、最後の 1 枚で 1 回だけ返信する
    if (!m.imageSet || m.imageSet.index === m.imageSet.total) {
      await reply(e.replyToken, '写真を受け取りました。管理者が確認してから、サイトに載せます。取り下げるときは「取り消し」と送ってください。');
    }
  }

  if (text === '取り消し') {
    const deleted = await deleteLatestLinePost(LINE_PENDING_PREFIX, senderKey(userId));
    await reply(e.replyToken, deleted ? '確認待ちの写真を 1 枚取り下げました。' : '取り下げられる写真がありません（掲載済みの写真は管理者に連絡してください）。');
  }

  if (ok && text === 'イベント取り消し') {
    const deleted = await deleteLatestLinePost(LINE_EVENTS_PREFIX, senderKey(userId));
    if (deleted) {
      revalidateTag(POSTED_EVENTS_TAG);
      revalidatePath('/stores');
    }
    await reply(e.replyToken, deleted ? 'いちばん新しいイベントをカレンダーから外しました。' : '外せるイベントがありません。');
  }
}

export async function POST(req: Request) {
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY) return NextResponse.json({ ok: false }, { status: 413 });
  const body = await req.text();
  if (body.length > MAX_BODY) return NextResponse.json({ ok: false }, { status: 413 });
  if (!verified(req, body)) return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });

  const { events = [] } = JSON.parse(body) as { events?: LineEvent[] };
  // Webhook URL の「検証」ボタンは events が空で届くので、そのまま 200 を返す
  await Promise.all(
    events.map((e) =>
      handle(e).catch((err) => {
        console.error('LINE のイベント処理に失敗しました', err);
      }),
    ),
  );
  return NextResponse.json({ ok: true });
}
