import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { POSTED_EVENTS_TAG } from '@/lib/slack/postedEvents';

// Slack の Events API の受け口。イベント用チャンネルに投稿・編集・削除があったら、道の駅ページのイベントを取り直す。
// Slack アプリの「Event Subscriptions」で Request URL に https://<サイト>/api/slack/events を設定し、
// Bot Events に message.channels（非公開チャンネルなら message.groups）を追加する。
// SLACK_SIGNING_SECRET（アプリの Basic Information にある Signing Secret）で、Slack からの通信か確かめる。

export const dynamic = 'force-dynamic';

function verified(req: Request, body: string) {
  const secret = process.env.SLACK_SIGNING_SECRET;
  const ts = req.headers.get('x-slack-request-timestamp');
  const sig = req.headers.get('x-slack-signature');
  if (!secret || !ts || !sig) return false;
  // 5 分より古いリクエストは、なりすましの再送とみなす
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = `v0=${createHmac('sha256', secret).update(`v0:${ts}:${body}`).digest('hex')}`;
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

type Payload = { type: string; challenge?: string; event?: { type: string; channel?: string } };

export async function POST(req: Request) {
  const body = await req.text();
  if (!verified(req, body)) return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });

  const payload = JSON.parse(body) as Payload;
  // Request URL を登録するときの確認
  if (payload.type === 'url_verification') return NextResponse.json({ challenge: payload.challenge });

  if (payload.type === 'event_callback' && payload.event?.type === 'message' && payload.event.channel === process.env.SLACK_EVENTS_CHANNEL_ID) {
    revalidateTag(POSTED_EVENTS_TAG);
    revalidatePath('/stores');
  }
  // Slack は 3 秒以内に 200 が返らないと再送するので、すぐ返す
  return NextResponse.json({ ok: true });
}
