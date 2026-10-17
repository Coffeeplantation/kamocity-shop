import { NextResponse } from 'next/server';
import { buildKamoDaily } from '@/lib/slack/kamoDaily';
import { sendToSlack, slackMode } from '@/lib/slack/send';

// 毎回その場でつくる（キャッシュしない）
export const dynamic = 'force-dynamic';

// GET  /api/slack/kamo        … 送る予定のメッセージを確認する（送信しない）
// POST /api/slack/kamo        … Slack に送る。SLACK_TRIGGER_SECRET を設定したら、ヘッダー x-trigger-secret に同じ値が必要
export async function GET() {
  const msg = await buildKamoDaily(undefined, process.env.SITE_URL);
  return NextResponse.json({ mode: slackMode(), preview: msg.text, message: msg });
}

export async function POST(req: Request) {
  const secret = process.env.SLACK_TRIGGER_SECRET;
  if (secret && req.headers.get('x-trigger-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }
  const msg = await buildKamoDaily(undefined, process.env.SITE_URL);
  const result = await sendToSlack(msg);
  return NextResponse.json({ ...result, preview: msg.text }, { status: result.ok ? 200 : 502 });
}
