'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import OpenBadge from '@/components/store/OpenBadge';
import { tokyoNow } from '@/lib/openStatus';
import { EVENT_CATEGORIES, eventsOn, NEWS, StoreEvent, STORE } from '@/lib/storeInfo';

// トップページ用：店舗の「今日」のまとめ（営業状況・今日のイベント・最新のお知らせ）
export default function TodayAtStore() {
  const [events, setEvents] = useState<StoreEvent[] | null>(null);
  useEffect(() => {
    const n = tokyoNow();
    setEvents(eventsOn(n.y, n.m, n.d));
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Link
        href="/stores"
        className="group flex min-h-[260px] flex-col justify-between rounded-[18px] bg-studio-dark p-7 text-[#f5f5f7] transition-transform duration-500 hover:scale-[1.01]"
      >
        <div>
          <p className="text-[14px] font-semibold text-[#a1a1a6]">道の駅併設ストア</p>
          <p className="mt-1 text-[32px] font-semibold leading-[1.1]">{STORE.name}</p>
          <p className="mt-2 text-[15px] text-[#d2d2d7]">{STORE.catchcopy}</p>
        </div>
        <div className="mt-6 space-y-3">
          <OpenBadge tone="dark" />
          <p className="text-[14px] text-accent-linkdark group-hover:underline">店舗情報を見る ›</p>
        </div>
      </Link>

      <div className="rounded-[18px] bg-white p-7">
        <p className="text-[14px] font-semibold text-ink-secondary">今日のイベント</p>
        {events === null ? (
          <div className="mt-4 space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-canvas-gray" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="mt-4 text-[17px] text-ink">今日予定されているイベントはありません。</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {events.slice(0, 3).map((e) => (
              <li key={e.title} className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: EVENT_CATEGORIES[e.category].color }} />
                <div>
                  <p className="text-[17px] font-semibold leading-[1.3] text-ink">{e.title}</p>
                  <p className="text-[14px] text-ink-secondary">
                    {e.start}〜{e.end}・{e.place}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/stores#events" className="link-chevron mt-5 text-[14px]">
          イベントカレンダー ›
        </Link>
      </div>

      <div className="rounded-[18px] bg-white p-7">
        <p className="text-[14px] font-semibold text-ink-secondary">お知らせ</p>
        <ul className="mt-4 divide-y divide-black/10">
          {NEWS.slice(0, 3).map((n) => (
            <li key={n.title} className="py-3 first:pt-0">
              <time dateTime={n.date} className="text-[12px] tabular-nums text-ink-secondary">
                {n.date.replaceAll('-', '.')}・{n.category}
              </time>
              <p className="mt-0.5 text-[15px] leading-[1.4] text-ink">{n.title}</p>
            </li>
          ))}
        </ul>
        <Link href="/stores#news" className="link-chevron mt-3 text-[14px]">
          すべてのお知らせ ›
        </Link>
      </div>
    </div>
  );
}
