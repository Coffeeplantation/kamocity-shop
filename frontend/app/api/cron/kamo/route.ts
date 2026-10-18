import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { buildKamoDaily, isSlotId } from '@/lib/slack/kamoDaily';
import { sendToSlack } from '@/lib/slack/send';

// 1日3回（朝 7 時・昼 12 時・夕方 18 時ごろ）Vercel の Cron Jobs から呼ばれる（設定は vercel.json）。
//   1. ニュースを取り直して、道の駅ページの表示を更新する
//   2. 「加茂のいま」を Slack に送る（Slack の設定がなければ送らない）
// Vercel は環境変数 CRON_SECRET を Authorization: Bearer <CRON_SECRET> として付けて呼ぶので、それ以外は断る。

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  revalidateTag('news');
  revalidatePath('/stores');

  const slot = new URL(req.url).searchParams.get('slot');
  const msg = await buildKamoDaily(undefined, process.env.SITE_URL, isSlotId(slot) ? slot : undefined);
  const result = await sendToSlack(msg);
  return NextResponse.json({ ...result, preview: msg.text }, { status: result.ok ? 200 : 502 });
}
