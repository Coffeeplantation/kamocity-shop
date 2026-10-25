// Slack のチャンネルと LINE 公式アカウントに投稿されたイベントを読み込む（サーバー側で実行する）。
// 必要な設定（.env.local / Vercel の環境変数）：
//   Slack … SLACK_BOT_TOKEN（xoxb-。スコープ channels:history、非公開チャンネルなら groups:history）と
//           SLACK_EVENTS_CHANNEL_ID（イベントを投稿するチャンネルの ID。ボットをチャンネルに招待しておく）
//   LINE  … lib/line/posts.ts と app/api/line/webhook/route.ts を参照
// どちらの設定もなければ何も読み込まない（サイトは道の駅のデータだけで表示する）。

import { tokyoNow } from '@/lib/jpCalendar';
import { fetchLineEventPosts } from '@/lib/line/posts';
import { parseEventPost, type PostedEvent } from '@/lib/slack/eventPost';

// 新しい投稿は Slack・LINE からの通知（/api/slack/events・/api/line/webhook）ですぐ反映する。通知が届かなくても 5 分で取り直す
export const POSTED_EVENTS_REVALIDATE = 300;
export const POSTED_EVENTS_TAG = 'slack-events';

export const postedEventsEnabled = () => Boolean(process.env.SLACK_BOT_TOKEN && process.env.SLACK_EVENTS_CHANNEL_ID);

type SlackMessage = { ts: string; text?: string; subtype?: string };
type Post = { text: string; at: Date };

async function slackPosts(oldest: number): Promise<Post[]> {
  if (!postedEventsEnabled()) return [];
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
    return (j.messages ?? [])
      .filter((m) => m.text && (!m.subtype || m.subtype === 'bot_message'))
      .map((m) => ({ text: m.text!, at: new Date(Number(m.ts) * 1000) }));
  } catch (e) {
    console.error('Slack のイベント読み込みに失敗しました', e);
    return [];
  }
}

export async function fetchPostedEvents(): Promise<PostedEvent[]> {
  // 直近 120 日の投稿を読む
  const oldest = Math.floor(Date.now() / 1000) - 120 * 24 * 60 * 60;
  const [slack, line] = await Promise.all([
    slackPosts(oldest),
    fetchLineEventPosts(oldest * 1000, POSTED_EVENTS_REVALIDATE, [POSTED_EVENTS_TAG]).then((ps) => ps.map((p) => ({ text: p.text, at: new Date(p.postedAt) }))),
  ]);

  const events: PostedEvent[] = [];
  // 同じ日・時刻・タイトルの投稿は、新しいほうだけ使う（Slack と LINE をまとめて新しい順に見る）
  const seen = new Set<string>();
  for (const p of [...slack, ...line].sort((a, b) => b.at.getTime() - a.at.getTime())) {
    const e = parseEventPost(p.text, tokyoNow(p.at).date);
    const key = e && `${e.date} ${e.start} ${e.title}`;
    if (!e || seen.has(key!)) continue;
    seen.add(key!);
    events.push({ ...e, postedAt: p.at.toISOString() });
  }
  return events;
}
