// イベントの取得と、カレンダーアプリ用ファイル（.ics）の生成。

import { nthOfMonth, weekday, ymd, type YMD } from '@/lib/jpCalendar';
import { EVENT_RULES, SPECIAL_EVENTS, STORE, type StoreEvent } from '@/lib/storeInfo';

// posted … Slack に投稿されたイベント（components/store/PostedEvents の usePostedEvents から渡す）
export function eventsOn(date: YMD, posted: (StoreEvent & { date: string })[] = []): StoreEvent[] {
  const key = ymd(date);
  if (STORE.closedDates.includes(key)) return [];
  const wd = weekday(date);
  const nth = nthOfMonth(date);
  const list: StoreEvent[] = EVENT_RULES.filter(
    (r) => r.weekdays?.includes(wd) || (r.nthWeekday && r.nthWeekday.weekday === wd && r.nthWeekday.n === nth),
  );
  for (const s of [...SPECIAL_EVENTS, ...posted]) if (s.date === key) list.push(s);
  return list.sort((a, b) => a.start.localeCompare(b.start));
}

// ---- iCalendar（RFC 5545） ----

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// 1行75オクテットで折り返す（マルチバイト文字の途中では切らない）
function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

// 日本時間の日時を UTC 形式に変換（YYYYMMDDTHHMMSSZ）
function utcStamp(date: YMD, time: string) {
  const [h, m] = time.split(':').map(Number);
  return new Date(Date.UTC(date.y, date.m - 1, date.d, h - 9, m)).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function eventIcs(e: StoreEvent, date: YMD) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const uid = `${ymd(date).replace(/-/g, '')}-${e.start.replace(':', '')}-${encodeURIComponent(e.title).slice(0, 24)}@lumina.example`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lumina Minatomachi//Events//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${utcStamp(date, e.start)}`,
    `DTEND:${utcStamp(date, e.end)}`,
    `SUMMARY:${esc(e.title)}`,
    `LOCATION:${esc(`${STORE.name} ${e.place}`)}`,
    `DESCRIPTION:${esc(`${e.desc}${e.reservation ? '\n※要予約' : ''}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
