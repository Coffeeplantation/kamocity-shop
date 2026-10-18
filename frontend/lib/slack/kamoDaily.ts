// Slack に送る「加茂のいま」のメッセージをつくる（サーバー側で実行する）。1日3回（朝・昼・夕）送る想定。
// 道の駅の営業状況・イベント・入荷、天気、美人の湯行きバス、加茂市と新潟のニュースをまとめる。

import { arrivalsFor } from '@/lib/arrivals';
import { eventsOn } from '@/lib/events';
import { fmt, stationStatus } from '@/lib/hours';
import { formatMD, toMinutes, tokyoNow, type TokyoNow } from '@/lib/jpCalendar';
import { busNote, isBijinClosed, KAMO_EVENTS, TO_BIJINNOYU, tripsOn } from '@/lib/kamo';
import { fetchKamoWeather, weatherIcon, weatherLabel } from '@/lib/kamoWeather';
import { fetchNews } from '@/lib/news';
import { fetchPostedEvents } from '@/lib/slack/postedEvents';
import { STORE } from '@/lib/storeInfo';

export type SlackMessage = { text: string; blocks: unknown[] };

export type SlotId = 'morning' | 'noon' | 'evening';
export type Slot = { id: SlotId; label: string; icon: string };

const SLOTS: Record<SlotId, Slot> = {
  morning: { id: 'morning', label: '朝', icon: '🌅' },
  noon: { id: 'noon', label: '昼', icon: '☀️' },
  evening: { id: 'evening', label: '夕方', icon: '🌇' },
};

export const isSlotId = (s: string | null): s is SlotId => s !== null && s in SLOTS;

// 指定がなければ、送る時刻から「朝・昼・夕」を決める
export function slotOf(now: TokyoNow, id?: SlotId): Slot {
  if (id) return SLOTS[id];
  const h = Math.floor(now.minutes / 60);
  return SLOTS[h < 11 ? 'morning' : h < 16 ? 'noon' : 'evening'];
}

const section = (text: string) => ({ type: 'section', text: { type: 'mrkdwn', text: text.slice(0, 2900) } });
// Slack の mrkdwn で、リンクの表示文字に使えない記号を置き換える
const linkText = (s: string) => s.replace(/[<>|]/g, ' ').replace(/&/g, '＆');

async function weatherLine() {
  try {
    const t = (await fetchKamoWeather()).days[0];
    return `${weatherIcon(t.code)} *天気* ${weatherLabel(t.code)}　最高 ${Math.round(t.max)}° / 最低 ${Math.round(t.min)}°　降水確率 ${t.rain}%${t.snow > 0 ? `　降雪 ${t.snow}cm` : ''}`;
  } catch {
    return '*天気* 取得できませんでした'; // 天気 API が落ちていても通知は止めない
  }
}

async function stationLines(now: TokyoNow) {
  const status = stationStatus(now, false);
  const posted = await fetchPostedEvents();
  const events = eventsOn(now.date, posted).filter((e) => toMinutes(e.end) > now.minutes);
  const lines = [`🏪 *${STORE.name}* ${status.label}${status.detail ? `（${status.detail}）` : ''}`];
  lines.push(
    events.length
      ? `📣 *これからのイベント*\n${events.map((e) => `　・${fmt(e.start)}〜${fmt(e.end)} ${e.title}（${e.place}）${e.posted ? ' 🆕' : ''}`).join('\n')}`
      : '📣 *イベント* 本日これからの予定はありません',
  );
  const arrivals = arrivalsFor(now.date);
  if (arrivals) {
    const picks = arrivals.flatMap((g) => g.items.filter((i) => i.tag === 'おすすめ' || i.tag === '初入荷').map((i) => `${i.name}${i.tag === '初入荷' ? '（初入荷）' : ''}`));
    if (picks.length) lines.push(`🧺 *今日のおすすめ* ${picks.slice(0, 5).join('、')}`);
  }
  return lines;
}

function kamoLines(now: TokyoNow, slot: Slot) {
  const lines: string[] = [];
  const trips = tripsOn(TO_BIJINNOYU, now.date).filter((t) => toMinutes(t.from) >= now.minutes);
  const note = busNote(now.date);
  lines.push(
    trips.length
      ? `🚌 *美人の湯行き*（加茂駅前 発）${trips.slice(0, 4).map((t) => t.from).join('、')}${trips.length > 4 ? ' ほか' : ''}${note ? `\n　※${note}` : ''}`
      : '🚌 *美人の湯行き* 本日の運行は終了しました',
  );
  lines.push(isBijinClosed(now.date) ? '♨️ *美人の湯* 今日は定休日です（毎月 第2・第4 水曜）' : '♨️ *美人の湯* 今日は営業日です');
  // 今月の行事は朝だけ
  if (slot.id === 'morning') {
    const events = KAMO_EVENTS.filter((e) => e.months.includes(now.date.m));
    if (events.length) lines.push(`📅 *${now.date.m}月の加茂*\n${events.map((e) => `　・${e.title}（${e.when}）`).join('\n')}`);
  }
  return lines;
}

// 各配信元の新しい見出しを 3 件ずつ。複数の配信元に同じ記事があれば 1 回だけ
async function newsBlocks() {
  const results = await fetchNews('all', 3);
  const seen = new Set<string>();
  const blocks: unknown[] = [];
  for (const { feed, items, ok } of results) {
    const fresh = items.filter((i) => {
      const k = i.title.replace(/\s/g, '').slice(0, 24);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const body = !ok
      ? '　取得できませんでした'
      : fresh.length
        ? fresh.map((i) => `　・<${i.link}|${linkText(i.title)}>（${linkText(i.publisher)}）`).join('\n')
        : '　新しい記事はありません';
    blocks.push(section(`📰 *${feed.label}*\n${body}`));
  }
  return blocks;
}

export async function buildKamoDaily(now: TokyoNow = tokyoNow(), siteUrl?: string, slotId?: SlotId): Promise<SlackMessage> {
  const slot = slotOf(now, slotId);
  const [weather, station, news] = await Promise.all([weatherLine(), stationLines(now), newsBlocks()]);
  const local = [weather, ...kamoLines(now, slot)];

  const title = `${slot.icon} 加茂のいま（${slot.label}）${formatMD(now.date)}`;
  const base = siteUrl?.replace(/\/$/, '');
  const links = base ? `<${base}/stores|道の駅のページ>　<${base}/kamo|加茂ローカル>` : null;

  return {
    text: `${title}\n${[...station, ...local].join('\n')}`, // 通知のプレビュー用
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title, emoji: true } },
      section(station.join('\n')),
      section(local.join('\n')),
      { type: 'divider' },
      ...news,
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ['バス：加茂市公共交通時刻表（令和8年6月1日改正）　天気：Open-Meteo　ニュース：加茂市・Google ニュース・Yahoo!ニュース・Bing ニュース', links]
              .filter(Boolean)
              .join('　'),
          },
        ],
      },
    ],
  };
}
