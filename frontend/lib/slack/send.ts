// Slack への送信。次のどちらかが .env.local にあれば実際に送り、なければ「お試し（送信しない）」になる。
//   SLACK_WEBHOOK_URL                      … Incoming Webhook の URL（いちばん簡単）
//   SLACK_BOT_TOKEN + SLACK_CHANNEL_ID     … ボットのトークン（xoxb-）と投稿先チャンネル ID

import type { SlackMessage } from '@/lib/slack/kamoDaily';

export type SendResult = { mode: 'dry-run' | 'webhook' | 'bot'; ok: boolean; error?: string };

export function slackMode(): SendResult['mode'] {
  if (process.env.SLACK_WEBHOOK_URL) return 'webhook';
  if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) return 'bot';
  return 'dry-run';
}

export async function sendToSlack(msg: SlackMessage): Promise<SendResult> {
  const mode = slackMode();
  if (mode === 'dry-run') return { mode, ok: true };

  try {
    if (mode === 'webhook') {
      const r = await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      return r.ok ? { mode, ok: true } : { mode, ok: false, error: `HTTP ${r.status}: ${await r.text()}` };
    }

    const r = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
      body: JSON.stringify({ channel: process.env.SLACK_CHANNEL_ID, ...msg }),
    });
    const j = (await r.json()) as { ok: boolean; error?: string };
    return j.ok ? { mode, ok: true } : { mode, ok: false, error: j.error ?? `HTTP ${r.status}` };
  } catch (e) {
    return { mode, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
