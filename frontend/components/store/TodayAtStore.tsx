'use client';

import Link from 'next/link';
import Photo from '@/components/Photo';
import { StatusSkeleton, StatusText } from '@/components/store/OpenBadge';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ARRIVAL_UPDATE, arrivalsFor } from '@/lib/arrivals';
import { crowdAt, crowdLevel } from '@/lib/crowd';
import { eventsOn } from '@/lib/events';
import { fmt, stationStatus } from '@/lib/hours';
import { addDays, toMinutes } from '@/lib/jpCalendar';
import { nextDepartures, routeById } from '@/lib/shuttle';
import { EVENT_CATEGORIES, STORE } from '@/lib/storeInfo';

// トップページ用：道の駅の「今日」のまとめ
export default function TodayAtStore() {
  const now = useTokyoNow();

  const status = now ? stationStatus(now) : null;
  const events = now ? eventsOn(now.date) : null;
  const crowd = now ? crowdAt(now) : null;
  const level = crowd && status?.open ? crowdLevel(crowd.value) : null;
  const bus = now ? nextDepartures(routeById('from-station'), now, 1)[0] : undefined;
  const arrivalsDate = now ? (now.minutes < toMinutes(ARRIVAL_UPDATE) ? addDays(now.date, -1) : now.date) : null;
  const highlights = arrivalsDate
    ? (arrivalsFor(arrivalsDate) ?? []).flatMap((g) => g.items.filter((i) => i.tag === 'おすすめ' || i.tag === '初入荷').map((i) => i.name)).slice(0, 5)
    : null;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Link href="/stores" className="group relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[22px] bg-black p-7 text-white lg:row-span-2">
        <Photo name="lighthouseDusk" sizes="(min-width: 1024px) 33vw, 100vw" className="!absolute inset-0 -z-10" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
        <p className="text-[14px] font-semibold text-white/75">道の駅・Lumina Store 併設</p>
        <p className="mt-1 text-[36px] font-semibold leading-[1.05]">{STORE.name}</p>
        <p className="mt-2 text-[15px] text-white/85">{STORE.catchcopy}</p>
        <div className="mt-5">{status ? <StatusText status={status} tone="dark" /> : <StatusSkeleton tone="dark" />}</div>
        <p className="mt-4 text-[14px] text-accent-linkdark group-hover:underline">店舗情報を見る ›</p>
      </Link>

      <div className="rounded-[22px] bg-white p-7">
        <p className="text-[14px] font-semibold text-ink-secondary">今日のイベント</p>
        {!events ? (
          <div className="mt-4 space-y-3">{[0, 1].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-canvas-gray" />)}</div>
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
                    {fmt(e.start)}〜{fmt(e.end)}・{e.place}
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

      <div className="rounded-[22px] bg-white p-7">
        <p className="text-[14px] font-semibold text-ink-secondary">本日のおすすめ入荷</p>
        {!highlights ? (
          <div className="mt-4 h-20 animate-pulse rounded-xl bg-canvas-gray" />
        ) : highlights.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {highlights.map((n) => (
              <li key={n} className="rounded-full bg-canvas-gray px-3.5 py-1.5 text-[15px] text-ink">
                {n}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[17px] text-ink">本日は全館休業日です。</p>
        )}
        <Link href="/stores#arrivals" className="link-chevron mt-5 text-[14px]">
          入荷状況をすべて見る ›
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:col-span-2">
        <Link href="/stores#crowd" className="rounded-[22px] bg-white p-7 transition-colors hover:bg-white/80">
          <p className="text-[14px] font-semibold text-ink-secondary">いまの混雑（予想）</p>
          <p className="mt-3 flex items-center gap-2 text-[24px] font-semibold text-ink">
            {level && <span className="h-3 w-3 rounded-full" style={{ background: level.color }} aria-hidden />}
            {now ? (level ? level.label : '営業時間外') : '—'}
          </p>
        </Link>
        <Link href="/stores#shuttle" className="rounded-[22px] bg-white p-7 transition-colors hover:bg-white/80">
          <p className="text-[14px] font-semibold text-ink-secondary">次のシャトル（湊町駅発）</p>
          <p className="mt-3 text-[24px] font-semibold tabular-nums text-ink">
            {now ? (bus ? bus.time : '本日の運行終了') : '—'}
            {bus && <span className="ml-2 text-[15px] font-normal text-ink-secondary">{bus.inMinutes === 0 ? 'まもなく発車' : `あと${bus.inMinutes}分`}</span>}
          </p>
        </Link>
      </div>
    </div>
  );
}
