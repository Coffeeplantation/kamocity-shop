// Slack のチャンネルに投稿されたイベントを読み込む（サーバー側で実行する）。
// 必要な設定（.env.local / Vercel の環境変数）：
//   SLACK_BOT_TOKEN          … ボットのトークン（xoxb-）。スコープ channels:history（非公開チャンネルなら groups:history）
//   SLACK_EVENTS_CHANNEL_ID  … イベントを投稿するチャンネルの ID（ボットをチャンネルに招待しておく）
// 設定がなければ何も読み込まない（サイトは道の駅のデータだけで表示する）。

import { tokyoNow } from '@/lib/jpCalendar';
import { parseEventPost, type PostedEvent } from '@/lib/slack/eventPost';

// 新しい投稿は Slack からの通知（/api/slack/events）ですぐ反映する。通知が届かなくても 5 分で取り直す
export const POSTED_EVENTS_REVALIDATE = 300;
export const POSTED_EVENTS_TAG = 'slack-events';

export const postedEventsEnabled = () => Boolean(process.env.SLACK_BOT_TOKEN && process.env.SLACK_EVENTS_CHANNEL_ID);

type SlackMessage = { ts: string; text?: string; subtype?: string };

export async function fetchPostedEvents(): Promise<PostedEvent[]> {
  if (!postedEventsEnabled()) return [];
  // 直近 120 日の投稿を読む
  const oldest = Math.floor(Date.now() / 1000) - 120 * 24 * 60 * 60;
  const url = `https://slack.com/api/conversations.history?channel=${encodeURIComponent(process.env.SLACK_EVENTS_CHANNEL_ID!)}&limit=200&oldest=${oldest}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
      next: { revalidate: POSTED_EVENTS_REVALIDATE, tags: [POSTED_EVENTS_TAG] },
      signal: AbortSignal.timeout(10_000),
    });
    const j = (await res.json()) as { ok: boolean; error?: string; messages?: SlackMessage[] };
    if (!j.ok) {
      console.error(`Slack のイベント読み込みに失敗しました：${j.error}`);
      return [];
    }
    const events: PostedEvent[] = [];
    // 同じ日・時刻・タイトルの投稿は、新しいほうだけ使う（messages は新しい順）
    const seen = new Set<string>();
    for (const m of j.messages ?? []) {
      if (!m.text || (m.subtype && m.subtype !== 'bot_message')) continue;
      const e = parseEventPost(m.text, tokyoNow(new Date(Number(m.ts) * 1000)).date);
      const key = e && `${e.date} ${e.start} ${e.title}`;
      if (!e || seen.has(key!)) continue;
      seen.add(key!);
      events.push(e);
    }
    return events;
  } catch (e) {
    console.error('Slack のイベント読み込みに失敗しました', e);
    return [];
  }
}
