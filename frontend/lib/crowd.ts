// 混雑予想。曜日・祝日・行楽シーズン・イベントから時間帯ごとの混み具合（0〜100）を算出する。
// 実測ではなく過去の傾向にもとづく目安。

import { dayType, ymd, type TokyoNow, type YMD } from '@/lib/jpCalendar';
import { eventsOn } from '@/lib/events';
import { STORE } from '@/lib/storeInfo';

export const CROWD_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const WEEKDAY = [12, 26, 42, 60, 74, 62, 48, 44, 40, 30, 20, 12];
const HOLIDAY = [28, 54, 78, 94, 100, 92, 80, 70, 58, 42, 28, 16];

// ゴールデンウィーク・お盆・年始
function isPeakSeason({ m, d }: YMD) {
  const md = m * 100 + d;
  return (md >= 429 && md <= 506) || (md >= 811 && md <= 816) || (md >= 102 && md <= 103);
}

export type CrowdPoint = { hour: number; value: number };

export function crowdForecast(date: YMD): CrowdPoint[] {
  if (STORE.closedDates.includes(ymd(date))) return CROWD_HOURS.map((hour) => ({ hour, value: 0 }));
  const base = dayType(date) === 'holiday' ? HOLIDAY : WEEKDAY;
  const events = eventsOn(date);
  let mult = 1;
  if (isPeakSeason(date)) mult *= 1.12;
  if (events.some((e) => e.category === 'special')) mult *= 1.15;
  const market = events.some((e) => e.category === 'market');
  return CROWD_HOURS.map((hour, i) => {
    let v = base[i] * mult;
    if (market && hour >= 9 && hour < 15) v += 6;
    return { hour, value: Math.min(100, Math.round(v)) };
  });
}

export type CrowdLevel = { level: 0 | 1 | 2 | 3; label: string; color: string };

export function crowdLevel(v: number): CrowdLevel {
  if (v >= 90) return { level: 3, label: '大変混雑', color: '#d70015' };
  if (v >= 70) return { level: 2, label: '混雑', color: '#e8590c' };
  if (v >= 45) return { level: 1, label: 'やや混雑', color: '#b07d00' };
  return { level: 0, label: '空いています', color: '#1a7f37' };
}

export function crowdAt(now: TokyoNow): CrowdPoint | null {
  const hour = Math.floor(now.minutes / 60);
  return crowdForecast(now.date).find((p) => p.hour === hour) ?? null;
}

// 9〜17時のうち、空いている時間帯を早い順に最大2つ
export function quietHours(points: CrowdPoint[]) {
  return points
    .filter((p) => p.hour >= 9 && p.hour <= 17 && p.value > 0)
    .sort((a, b) => a.value - b.value || a.hour - b.hour)
    .slice(0, 2)
    .sort((a, b) => a.hour - b.hour)
    .map((p) => p.hour);
}
