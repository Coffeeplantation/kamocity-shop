// 店舗ごとの営業時間・定休日・営業状況の判定（すべて日本時間）。

import {
  addDays,
  dayType,
  formatMD,
  fromMinutes,
  isHoliday,
  nthOfMonth,
  toMinutes,
  tokyoNow,
  weekday,
  WEEKDAYS,
  ymd,
  type TokyoNow,
  type YMD,
} from '@/lib/jpCalendar';
import { SHOPS, STORE, type Closure, type DayHours, type Shop } from '@/lib/storeInfo';

export const fmt = (t: string) => fromMinutes(toMinutes(t)); // '09:00' → '9:00'

export function formatHours(h: DayHours | '24h') {
  if (h === '24h') return '24時間';
  if (!h) return '休み';
  return `${fmt(h.open)}〜${fmt(h.close)}`;
}

export const isStoreClosedDate = (date: YMD) => STORE.closedDates.includes(ymd(date));

const matches = (c: Closure, date: YMD) => weekday(date) === c.weekday && (!c.nth || c.nth.includes(nthOfMonth(date)));

// 定休日の判定。定休日が祝日に当たる場合は営業し、翌平日を休みにする。
export function isRegularClosed(shop: Shop, date: YMD) {
  const c = shop.closure;
  if (!c || dayType(date) === 'holiday') return false;
  if (matches(c, date)) return true;
  for (let k = 1; k <= 7; k++) {
    const prev = addDays(date, -k);
    if (dayType(prev) !== 'holiday') return false;
    if (isHoliday(prev) && matches(c, prev)) return true;
  }
  return false;
}

export function closureLabel(shop: Shop) {
  const c = shop.closure;
  if (!c) return shop.schedule !== '24h' && !shop.schedule.weekday ? '平日' : 'なし';
  const when = c.nth ? `第${c.nth.join('・')}` : '毎週';
  return `${when}${WEEKDAYS[c.weekday]}曜日（祝日の場合は翌平日）`;
}

export function hoursOn(shop: Shop, date: YMD): DayHours | '24h' {
  if (shop.schedule === '24h') return '24h';
  if (isStoreClosedDate(date) || isRegularClosed(shop, date)) return null;
  const base = shop.schedule[dayType(date)];
  const sp = STORE.specialHours[ymd(date)];
  if (!base || !sp) return base;
  const open = Math.max(toMinutes(base.open), toMinutes(sp.open));
  const close = Math.min(toMinutes(base.close), toMinutes(sp.close));
  return open < close ? { open: fromMinutes(open), close: fromMinutes(close) } : null;
}

export function closedReason(shop: Shop, date: YMD): string {
  if (isStoreClosedDate(date)) return '全館休業';
  if (isRegularClosed(shop, date)) return '定休日';
  return '休業';
}

export type StatusState = 'open' | 'closing' | 'before' | 'after' | 'closed' | '24h';
export type Status = { state: StatusState; open: boolean; label: string; detail: string };

function nextOpening(hoursFor: (d: YMD) => DayHours | '24h', from: YMD) {
  for (let k = 1; k <= 21; k++) {
    const d = addDays(from, k);
    const h = hoursFor(d);
    if (h && h !== '24h') return `${k === 1 ? '明日' : formatMD(d)} ${fmt(h.open)}から`;
  }
  return '';
}

function statusFrom(h: DayHours | '24h', now: TokyoNow, opts: { lastOrder?: number; closedLabel: string; next: () => string; suffix?: string }): Status {
  if (h === '24h') return { state: '24h', open: true, label: '利用可能', detail: '24時間' };
  if (h) {
    const o = toMinutes(h.open);
    const c = toMinutes(h.close);
    if (now.minutes >= o && now.minutes < c) {
      const lo = opts.lastOrder ? c - opts.lastOrder : null;
      if (lo !== null && now.minutes >= lo) return { state: 'closing', open: true, label: 'まもなく終了', detail: `ラストオーダー終了・${fmt(h.close)}閉店` };
      if (c - now.minutes <= 30) return { state: 'closing', open: true, label: 'まもなく終了', detail: `${fmt(h.close)}まで` };
      const loText = lo !== null ? `（LO ${fromMinutes(lo)}）` : '';
      return { state: 'open', open: true, label: '営業中', detail: `${fmt(h.close)}まで${loText}${opts.suffix ?? ''}` };
    }
    if (now.minutes < o) return { state: 'before', open: false, label: o - now.minutes <= 120 ? '準備中' : '営業時間外', detail: `本日 ${fmt(h.open)}から` };
    return { state: 'after', open: false, label: '本日の営業は終了', detail: opts.next() };
  }
  return { state: 'closed', open: false, label: opts.closedLabel, detail: opts.next() };
}

export function shopStatus(shop: Shop, now: TokyoNow = tokyoNow()): Status {
  const reason = closedReason(shop, now.date);
  return statusFrom(hoursOn(shop, now.date), now, {
    lastOrder: shop.lastOrder,
    closedLabel: reason === '休業' ? '本日休業' : `本日${reason}`,
    next: () => nextOpening((d) => hoursOn(shop, d), now.date),
  });
}

// 道の駅全体：いずれかの店舗が営業していれば「営業中」
export function stationHoursOn(date: YMD): DayHours {
  const list = SHOPS.map((s) => hoursOn(s, date)).filter((h): h is { open: string; close: string } => !!h && h !== '24h');
  if (!list.length) return null;
  return {
    open: fromMinutes(Math.min(...list.map((h) => toMinutes(h.open)))),
    close: fromMinutes(Math.max(...list.map((h) => toMinutes(h.close)))),
  };
}

export function stationStatus(now: TokyoNow = tokyoNow(), withNote = true): Status {
  return statusFrom(stationHoursOn(now.date), now, {
    closedLabel: isStoreClosedDate(now.date) ? '本日休館' : '本日休業',
    next: () => nextOpening(stationHoursOn, now.date),
    suffix: withNote ? '・店舗により異なります' : '',
  });
}
