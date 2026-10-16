// 無料シャトルバスの時刻表と、次の出発時刻。

import { dayType, fromMinutes, toMinutes, ymd, type TokyoNow, type YMD } from '@/lib/jpCalendar';
import { SHUTTLE_ROUTES, STORE, type ShuttleRoute } from '@/lib/storeInfo';

export function departures(route: ShuttleRoute, date: YMD): number[] {
  if (STORE.closedDates.includes(ymd(date))) return [];
  const t = route[dayType(date)];
  if (!t) return [];
  const out: number[] = [];
  for (let m = toMinutes(t.first); m <= toMinutes(t.last); m += t.every) out.push(m);
  return out;
}

export type Departure = { time: string; inMinutes: number };

export function nextDepartures(route: ShuttleRoute, now: TokyoNow, count = 3): Departure[] {
  return departures(route, now.date)
    .filter((m) => m >= now.minutes)
    .slice(0, count)
    .map((m) => ({ time: fromMinutes(m), inMinutes: m - now.minutes }));
}

export const routeById = (id: string) => SHUTTLE_ROUTES.find((r) => r.id === id)!;

// 時刻表を「時」ごとにまとめる（8 → ['40'], 9 → ['00','20','40'] ...）
export function timetable(route: ShuttleRoute, date: YMD) {
  const rows = new Map<number, string[]>();
  for (const m of departures(route, date)) {
    const h = Math.floor(m / 60);
    rows.set(h, [...(rows.get(h) ?? []), String(m % 60).padStart(2, '0')]);
  }
  return Array.from(rows, ([hour, minutes]) => ({ hour, minutes }));
}
