'use client';

import { useEffect, useMemo, useState } from 'react';
import { EVENT_CATEGORIES, EventCategory, eventsOn, STORE, ymd } from '@/lib/storeInfo';
import { tokyoNow, WEEKDAYS } from '@/lib/openStatus';

type Day = { y: number; m: number; d: number };

export default function EventCalendar() {
  const [today, setToday] = useState<Day | null>(null);
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<Day | null>(null);
  const [filter, setFilter] = useState<EventCategory | 'all'>('all');

  useEffect(() => {
    const n = tokyoNow();
    const t = { y: n.y, m: n.m, d: n.d };
    setToday(t);
    setMonth({ y: n.y, m: n.m });
    setSelected(t);
  }, []);

  const cells = useMemo(() => {
    if (!month) return [];
    const first = new Date(month.y, month.m - 1, 1).getDay();
    const days = new Date(month.y, month.m, 0).getDate();
    const out: (Day | null)[] = Array.from({ length: first }, () => null);
    for (let d = 1; d <= days; d++) out.push({ y: month.y, m: month.m, d });
    while (out.length % 7) out.push(null);
    return out;
  }, [month]);

  if (!month || !today || !selected) {
    return <div className="h-[560px] animate-pulse rounded-[18px] bg-white" />;
  }

  const shift = (n: number) => {
    const dt = new Date(month.y, month.m - 1 + n, 1);
    setMonth({ y: dt.getFullYear(), m: dt.getMonth() + 1 });
  };
  const match = (c: EventCategory) => filter === 'all' || filter === c;
  const same = (a: Day, b: Day) => a.y === b.y && a.m === b.m && a.d === b.d;
  const isPast = (c: Day) => new Date(c.y, c.m - 1, c.d) < new Date(today.y, today.m - 1, today.d);
  const selectedEvents = eventsOn(selected.y, selected.m, selected.d).filter((e) => match(e.category));
  const selectedClosed = STORE.closedDates.includes(ymd(selected.y, selected.m, selected.d));
  const atCurrentMonth = month.y === today.y && month.m === today.m;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="rounded-[18px] bg-white p-4 sm:p-6">
        {/* カテゴリ絞り込み */}
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
                  on ? 'border-ink bg-ink text-white' : 'border-[#d2d2d7] text-ink hover:border-ink'
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
            const evs = eventsOn(c.y, c.m, c.d).filter((e) => match(e.category));
            const closed = STORE.closedDates.includes(ymd(c.y, c.m, c.d));
            const isSel = same(c, selected);
            const isToday = same(c, today);
            const cats = Array.from(new Set(evs.map((e) => e.category)));
            return (
              <button
                key={c.d}
                type="button"
                onClick={() => setSelected(c)}
                aria-pressed={isSel}
                aria-label={`${c.m}月${c.d}日 ${closed ? '休業日' : `イベント${evs.length}件`}`}
                className={`flex min-h-[48px] flex-col items-center justify-start rounded-xl pt-1 text-[14px] sm:min-h-[60px] sm:pt-2 xl:min-h-[68px] transition-colors sm:text-[15px] ${
                  isSel ? 'bg-ink text-white' : isPast(c) ? 'text-ink-tertiary hover:bg-canvas-gray' : 'text-ink hover:bg-canvas-gray'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isToday && !isSel ? 'bg-accent text-white' : ''
                  }`}
                >
                  {c.d}
                </span>
                {closed ? (
                  <span className={`mt-0.5 text-[10px] ${isSel ? 'text-white/70' : 'text-[#d70015]'}`}>休</span>
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
      <div className="rounded-[18px] bg-white p-6">
        <p className="text-[14px] text-ink-secondary">
          {same(selected, today) ? '今日' : ''} {selected.m}月{selected.d}日（{WEEKDAYS[new Date(selected.y, selected.m - 1, selected.d).getDay()]}）
        </p>
        <h3 className="mt-1 text-[24px] font-semibold text-ink">
          {selectedClosed ? '休業日' : selectedEvents.length ? `${selectedEvents.length}件のイベント` : 'イベントはありません'}
        </h3>
        {selectedClosed && <p className="mt-3 text-[14px] text-ink-secondary">トイレ・EV 充電・駐車場は 24 時間ご利用いただけます。</p>}
        <ul className="mt-5 space-y-3">
          {selectedEvents.map((e) => (
            <li key={e.title} className="rounded-2xl bg-canvas-gray p-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: EVENT_CATEGORIES[e.category].color }}>
                <span className="h-2 w-2 rounded-full" style={{ background: EVENT_CATEGORIES[e.category].color }} />
                {EVENT_CATEGORIES[e.category].label}
                {e.reservation && <span className="rounded-full border border-current px-2 py-px text-[11px]">要予約</span>}
              </div>
              <p className="mt-1.5 text-[17px] font-semibold leading-[1.3] text-ink">{e.title}</p>
              <p className="mt-1 text-[14px] text-ink-secondary">
                {e.start}〜{e.end}・{e.place}
              </p>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink">{e.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
