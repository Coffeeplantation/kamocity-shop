'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { eventIcs, eventsOn } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { formatMD, holidayName, sameDay, weekday, WEEKDAYS, ymd, type YMD } from '@/lib/jpCalendar';
import { EVENT_CATEGORIES, STORE, type EventCategory, type StoreEvent } from '@/lib/storeInfo';

function downloadIcs(e: StoreEvent, date: YMD) {
  const blob = new Blob([eventIcs(e, date)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lumina-${ymd(date)}-${e.start.replace(':', '')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function EventCalendar() {
  const now = useTokyoNow(60_000);
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<YMD | null>(null);
  const [filter, setFilter] = useState<EventCategory | 'all'>('all');

  useEffect(() => {
    if (!now || month) return;
    setMonth({ y: now.date.y, m: now.date.m });
    setSelected(now.date);
  }, [now, month]);

  const cells = useMemo(() => {
    if (!month) return [];
    const first = weekday({ y: month.y, m: month.m, d: 1 });
    const days = new Date(Date.UTC(month.y, month.m, 0)).getUTCDate();
    const out: (YMD | null)[] = Array.from({ length: first }, () => null);
    for (let d = 1; d <= days; d++) out.push({ y: month.y, m: month.m, d });
    while (out.length % 7) out.push(null);
    return out;
  }, [month]);

  if (!now || !month || !selected) return <div className="h-[560px] animate-pulse rounded-tile bg-surface" />;

  const today = now.date;
  const shift = (n: number) => {
    const t = new Date(Date.UTC(month.y, month.m - 1 + n, 1));
    setMonth({ y: t.getUTCFullYear(), m: t.getUTCMonth() + 1 });
  };
  const match = (c: EventCategory) => filter === 'all' || filter === c;
  const isPast = (c: YMD) => ymd(c) < ymd(today);
  const selectedEvents = eventsOn(selected).filter((e) => match(e.category));
  const selectedClosed = STORE.closedDates.includes(ymd(selected));
  const atCurrentMonth = month.y === today.y && month.m === today.m;
  const selectedHoliday = holidayName(selected);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="rounded-tile bg-surface p-4 sm:p-6">
        <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1" role="group" aria-label="カテゴリで絞り込む">
          {(['all', ...Object.keys(EVENT_CATEGORIES)] as (EventCategory | 'all')[]).map((c) => {
            const on = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
                  on ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'
                }`}
              >
                {c !== 'all' && <span className="h-2 w-2 rounded-full" style={{ background: EVENT_CATEGORIES[c].color }} />}
                {c === 'all' ? 'すべて' : EVENT_CATEGORIES[c].label}
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[21px] font-semibold text-ink" aria-live="polite">
            {month.y}年{month.m}月
          </h3>
          <div className="flex items-center gap-1">
            {!atCurrentMonth && (
              <button
                type="button"
                onClick={() => {
                  setMonth({ y: today.y, m: today.m });
                  setSelected(today);
                }}
                className="mr-2 text-[14px] text-accent-link hover:underline"
              >
                今日
              </button>
            )}
            {[
              { n: -1, label: '前の月', d: 'M15 6l-6 6 6 6' },
              { n: 1, label: '次の月', d: 'M9 6l6 6-6 6' },
            ].map((b) => (
              <button
                key={b.n}
                type="button"
                onClick={() => shift(b.n)}
                aria-label={b.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas-gray"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d={b.d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-[12px] text-ink-secondary">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`pb-2 ${i === 0 ? 'text-[#d70015]' : i === 6 ? 'text-accent-link' : ''}`}>
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {cells.map((c, i) => {
            if (!c) return <div key={`e${i}`} />;
            const evs = eventsOn(c).filter((e) => match(e.category));
            const closed = STORE.closedDates.includes(ymd(c));
            const isSel = sameDay(c, selected);
            const isToday = sameDay(c, today);
            const hol = holidayName(c);
            const wd = weekday(c);
            const cats = Array.from(new Set(evs.map((e) => e.category)));
            const numColor = isSel ? '' : hol || wd === 0 ? 'text-[#d70015]' : wd === 6 ? 'text-accent-link' : '';
            return (
              <button
                key={c.d}
                type="button"
                onClick={() => setSelected(c)}
                aria-pressed={isSel}
                aria-label={`${c.m}月${c.d}日${hol ? `（${hol}）` : ''} ${closed ? '休業日' : `イベント${evs.length}件`}`}
                className={`flex min-h-[48px] flex-col items-center justify-start rounded-ctl pt-1 text-[14px] transition-colors sm:min-h-[60px] sm:pt-2 sm:text-[15px] xl:min-h-[68px] ${
                  isSel ? 'bg-ink text-on-ink' : isPast(c) ? 'text-ink-tertiary opacity-60 hover:bg-canvas-gray' : 'text-ink hover:bg-canvas-gray'
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${isToday && !isSel ? 'bg-accent font-semibold text-white' : numColor}`}>{c.d}</span>
                {closed ? (
                  <span className={`mt-0.5 text-[10px] ${isSel ? 'text-white/70' : 'text-[#d70015]'}`}>休館</span>
                ) : (
                  <span className="mt-1 flex gap-0.5">
                    {cats.slice(0, 4).map((k) => (
                      <span key={k} className="h-1.5 w-1.5 rounded-full" style={{ background: EVENT_CATEGORIES[k].color }} />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択日のイベント */}
      <div className="rounded-tile bg-surface p-6">
        <p className="text-[14px] text-ink-secondary">
          {sameDay(selected, today) ? '今日・' : ''}
          {formatMD(selected)}
          {selectedHoliday && <span className="text-[#d70015]">・{selectedHoliday}</span>}
        </p>
        <h3 className="mt-1 text-[24px] font-semibold text-ink">
          {selectedClosed ? '全館休業日' : selectedEvents.length ? `${selectedEvents.length}件のイベント` : 'イベントはありません'}
        </h3>
        {selectedClosed && <p className="mt-3 text-[14px] text-ink-secondary">トイレ・EV 充電・駐車場は 24 時間ご利用いただけます。</p>}
        <ul className="mt-5 space-y-3">
          {selectedEvents.map((e) => (
            <li key={e.title} className="rounded-chip bg-canvas-gray p-4">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold" style={{ color: EVENT_CATEGORIES[e.category].color }}>
                <span className="h-2 w-2 rounded-full" style={{ background: EVENT_CATEGORIES[e.category].color }} />
                {EVENT_CATEGORIES[e.category].label}
                {e.reservation && <span className="rounded-full border border-current px-2 py-px text-[11px]">要予約</span>}
                {e.fee && <span className="text-ink-secondary">参加費 {e.fee}</span>}
              </div>
              <p className="mt-1.5 text-[17px] font-semibold leading-[1.3] text-ink">{e.title}</p>
              <p className="mt-1 text-[14px] text-ink-secondary">
                {fmt(e.start)}〜{fmt(e.end)}・{e.place}
              </p>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink">{e.desc}</p>
              {!isPast(selected) && (
                <button type="button" onClick={() => downloadIcs(e, selected)} className="link-chevron mt-3 text-[13px]">
                  カレンダーに追加 ›
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
