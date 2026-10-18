'use client';

import Link from 'next/link';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { eventsOn } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { addDays, holidayName, weekday, WEEKDAYS, ymd } from '@/lib/jpCalendar';
import { EVENT_CATEGORIES } from '@/lib/storeInfo';

// 今日から 7 日間のイベントを日付ごとに並べる
export default function WeekEvents() {
  const now = useTokyoNow(10 * 60_000);
  if (!now) return <div className="h-[420px] animate-pulse rounded-card bg-surface" />;

  const days = Array.from({ length: 7 }, (_, i) => addDays(now.date, i));

  return (
    <div className="rounded-card bg-surface p-2">
      <ul className="divide-y divide-line/[0.06]">
        {days.map((d, i) => {
          const events = eventsOn(d);
          const wd = weekday(d);
          const red = wd === 0 || holidayName(d) !== null;
          return (
            <li key={ymd(d)} className="flex gap-4 px-4 py-4">
              <div className="w-14 shrink-0 text-center">
                <p className={`text-[12px] font-semibold ${i === 0 ? 'text-accent' : 'text-ink-secondary'}`}>{i === 0 ? '今日' : `${d.m}月`}</p>
                <p className={`text-[28px] font-semibold leading-none tabular-nums ${red ? 'text-[#d70015]' : wd === 6 ? 'text-accent' : 'text-ink'}`}>{d.d}</p>
                <p className="mt-0.5 text-[12px] text-ink-secondary">{WEEKDAYS[wd]}</p>
              </div>
              {events.length === 0 ? (
                <p className="self-center text-[14px] text-ink-tertiary">予定はありません</p>
              ) : (
                <ul className="min-w-0 flex-1 space-y-2">
                  {events.slice(0, 3).map((e) => (
                    <li key={e.title} className="flex gap-2.5">
                      <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full" style={{ background: EVENT_CATEGORIES[e.category].color }} aria-hidden />
                      <p className="min-w-0 text-[15px] leading-[1.45] text-ink">
                        <span className="tabular-nums text-ink-secondary">{fmt(e.start)}</span> {e.title}
                        {e.reservation && <span className="ml-1.5 text-[12px] text-[#b25000]">要予約</span>}
                      </p>
                    </li>
                  ))}
                  {events.length > 3 && <li className="pl-[18px] text-[12px] text-ink-secondary">ほか {events.length - 3} 件</li>}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div className="px-4 pb-4 pt-2">
        <Link href="/stores#events" className="link-chevron text-[14px]">
          イベントカレンダー ›
        </Link>
      </div>
    </div>
  );
}
