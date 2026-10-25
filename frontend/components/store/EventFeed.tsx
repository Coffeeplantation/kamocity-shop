'use client';

import { useState } from 'react';
import EventGuide from '@/components/store/EventGuide';
import { usePostedEvents } from '@/components/store/PostedEvents';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { eventsOn } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { addDays, toMinutes, WEEKDAYS, weekday, ymd, type YMD } from '@/lib/jpCalendar';
import { EVENT_CATEGORIES, type StoreEvent } from '@/lib/storeInfo';

// メインページの左側：いちばん上に次回のアメリカンフラワー教室、その下に更新履歴（Slack・LINE で投稿された新しいイベント順）。
// 投稿がまだないときは、この先 2 週間のイベントを並べる。どれを押しても参加の案内（EventGuide）が開く。

const parse = (s: string): YMD => {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
};
const dayLabel = (d: YMD) => `${d.m}/${d.d}（${WEEKDAYS[weekday(d)]}）`;
const NEW_DAYS = 3;

export default function EventFeed() {
  const now = useTokyoNow(60_000);
  const posted = usePostedEvents();
  const [guide, setGuide] = useState<{ e: StoreEvent; d: YMD } | null>(null);
  if (!now) return <div className="h-[520px] animate-pulse rounded-tile bg-surface" />;

  const today = ymd(now.date);
  // 次回の教室（今日まだ終わっていないものから 90 日先まで）
  const next = Array.from({ length: 90 }, (_, i) => addDays(now.date, i))
    .flatMap((d, i) => eventsOn(d, posted).filter((e) => e.category === 'flower' && (i > 0 || toMinutes(e.end) > now.minutes)).map((e) => ({ e, d })))
    .at(0);

  const history = [...posted]
    .filter((e) => e.postedAt)
    .sort((a, b) => b.postedAt!.localeCompare(a.postedAt!))
    .slice(0, 8)
    .map((e) => ({ e, d: parse(e.date), at: e.postedAt! }));
  // 投稿がないときの「この先のイベント」。同じ時間・同じタイトルの定例は 1 行にまとめ、ほかの日付を添える
  const upcoming: { e: StoreEvent; d: YMD; more: string[] }[] = [];
  Array.from({ length: 14 }, (_, i) => addDays(now.date, i)).forEach((d, i) =>
    eventsOn(d, posted)
      .filter((e) => i > 0 || toMinutes(e.end) > now.minutes)
      .forEach((e) => {
        const same = upcoming.find((u) => u.e.title === e.title && u.e.start === e.start);
        if (same) same.more.push(dayLabel(d));
        else upcoming.push({ e, d, more: [] });
      }),
  );
  upcoming.splice(8);
  const isNew = (iso: string) => Date.now() - Date.parse(iso) < NEW_DAYS * 86_400_000;
  const flower = EVENT_CATEGORIES.flower.color;

  return (
    <div className="space-y-3">
      {next ? (
        <button
          type="button"
          onClick={() => setGuide(next)}
          className="block w-full rounded-tile p-6 text-left text-white transition-transform hover:-translate-y-0.5 sm:p-7"
          style={{ background: `linear-gradient(135deg, ${flower}, #7b2ff7)` }}
        >
          <span className="text-[13px] font-semibold text-white/80">次回のアメリカンフラワー教室</span>
          <span className="mt-1 block text-[26px] font-semibold leading-[1.25] sm:text-[30px]">{next.e.title}</span>
          <span className="mt-2 block text-[16px] tabular-nums text-white/90">
            {ymd(next.d) === today ? '今日・' : ''}
            {next.d.m}月{next.d.d}日（{WEEKDAYS[weekday(next.d)]}） {fmt(next.e.start)}〜{fmt(next.e.end)}・{next.e.place}
          </span>
          <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-[14px] font-semibold" style={{ color: flower }}>
            参加の案内を見る ›
          </span>
        </button>
      ) : (
        <div className="rounded-tile p-6 text-white sm:p-7" style={{ background: `linear-gradient(135deg, ${flower}, #7b2ff7)` }}>
          <p className="text-[13px] font-semibold text-white/80">アメリカンフラワー教室</p>
          <p className="mt-1 text-[22px] font-semibold leading-[1.35]">次回の日程は、決まりしだいここでお知らせします。</p>
        </div>
      )}

      <div className="rounded-tile bg-surface p-5 sm:p-6">
        <h3 className="text-[19px] font-semibold text-ink">{history.length ? '更新履歴' : 'この先のイベント'}</h3>
        <ul className="mt-2 divide-y divide-line/[0.08]">
          {(history.length ? history : upcoming).map((item) => {
            const { e, d } = item;
            const at = 'at' in item ? (item.at as string) : null;
            const more = 'more' in item ? item.more : [];
            const cat = EVENT_CATEGORIES[e.category];
            return (
              <li key={`${ymd(d)}-${e.start}-${e.title}`}>
                <button type="button" onClick={() => setGuide({ e, d })} className="group flex w-full gap-4 py-3.5 text-left">
                  <span className="w-[86px] shrink-0 pt-0.5 text-[13px] tabular-nums text-ink-secondary">
                    {at ? `${at.slice(0, 10).replaceAll('-', '.')} 更新` : ymd(d) === today ? '今日' : dayLabel(d)}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-[12px] font-semibold" style={{ color: cat.color }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                      {cat.label}
                      {at && isNew(at) && <span className="rounded-full bg-[#e3004f] px-1.5 py-px text-[10px] text-white">NEW</span>}
                    </span>
                    <span className="mt-0.5 block text-[16px] font-semibold leading-[1.4] text-ink group-hover:underline">{e.title}</span>
                    <span className="block text-[13px] tabular-nums text-ink-secondary">
                      {at && `${dayLabel(d)} `}
                      {fmt(e.start)}〜{fmt(e.end)}・{e.place}
                    </span>
                    {more.length > 0 && <span className="block text-[13px] tabular-nums text-ink-secondary">ほかに {more.slice(0, 4).join('・')}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {guide && <EventGuide event={guide.e} date={guide.d} onClose={() => setGuide(null)} />}
    </div>
  );
}
