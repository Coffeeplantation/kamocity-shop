// Slack に送る「今日の加茂」のメッセージをつくる（サーバー側で実行する）。
// 天気・美人の湯行きバス・美人の湯の定休日・今月の行事をまとめる。

import { formatMD, toMinutes, tokyoNow, type TokyoNow } from '@/lib/jpCalendar';
import { busNote, isBijinClosed, KAMO_EVENTS, TO_BIJINNOYU, tripsOn } from '@/lib/kamo';
import { fetchKamoWeather, weatherIcon, weatherLabel } from '@/lib/kamoWeather';

export type SlackMessage = { text: string; blocks: unknown[] };

export async function buildKamoDaily(now: TokyoNow = tokyoNow(), siteUrl?: string): Promise<SlackMessage> {
  const lines: string[] = [];

  // 天気（取得できなくても、ほかの情報は送る）
  let weatherLine = '天気：取得できませんでした';
  try {
    const w = await fetchKamoWeather();
    const t = w.days[0];
    weatherLine = `${weatherIcon(t.code)} 天気：${weatherLabel(t.code)}　最高 ${Math.round(t.max)}° / 最低 ${Math.round(t.min)}°　降水確率 ${t.rain}%${
      t.snow > 0 ? `　降雪 ${t.snow}cm` : ''
    }`;
  } catch {
    // 天気 API が落ちていても通知は止めない
  }
  lines.push(weatherLine);

  // 美人の湯行きのバス（加茂駅前 発）
  const trips = tripsOn(TO_BIJINNOYU, now.date).filter((t) => toMinutes(t.from) >= now.minutes);
  const note = busNote(now.date);
  lines.push(
    trips.length
      ? `🚌 美人の湯行き（加茂駅前 発）：${trips.map((t) => t.from).join('、')}${note ? `\n　　※${note}` : ''}`
      : '🚌 美人の湯行き：本日の運行はありません',
  );

  // 美人の湯の定休日
  lines.push(isBijinClosed(now.date) ? '♨️ 美人の湯：今日は定休日です（毎月 第2・第4 水曜）' : '♨️ 美人の湯：今日は定休日ではありません');

  // 今月の行事
  const events = KAMO_EVENTS.filter((e) => e.months.includes(now.date.m));
  lines.push(
    events.length ? `📅 ${now.date.m}月の加茂：\n${events.map((e) => `　・${e.title}（${e.when}）`).join('\n')}` : `📅 ${now.date.m}月の加茂：掲載している行事はありません`,
  );

  const title = `🌅 今日の加茂　${formatMD(now.date)}`;
  const body = lines.join('\n');
  const link = siteUrl ? `<${siteUrl.replace(/\/$/, '')}/kamo|加茂ローカルを開く>` : null;

  return {
    text: `${title}\n${body}`, // 通知のプレビュー用
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title, emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: body } },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ['バス：加茂市公共交通時刻表（令和8年6月1日改正）　天気：Open-Meteo', link].filter(Boolean).join('　'),
          },
        ],
      },
    ],
  };
}
