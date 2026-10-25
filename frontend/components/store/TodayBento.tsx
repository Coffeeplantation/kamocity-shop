'use client';

import { usePostedEvents } from '@/components/store/PostedEvents';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ARRIVAL_UPDATE, arrivalsFor } from '@/lib/arrivals';
import { eventsOn } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { addDays, toMinutes, WEEKDAYS, weekday, ymd } from '@/lib/jpCalendar';
import { ACCESS, EVENT_CATEGORIES, KINDS, NEWS, PRODUCTS, SHOPS, STORE } from '@/lib/storeInfo';

// 道の駅のトップの 2 画面目。入荷と旬・イベントとお知らせ・お店・アクセスを、1 行 4 枚の小さなカードにまとめる
const card = 'rounded-card border border-line/[0.08] bg-surface/80 p-5 backdrop-blur-xl';
const head = 'text-[13px] font-semibold text-ink-secondary';

export default function TodayBento() {
  const now = useTokyoNow();
  const posted = usePostedEvents();
  if (!now) return <div className="h-[260px] animate-pulse rounded-card bg-surface" />;

  // 更新前（8:30 まで）は前日の入荷を参考として表示
  const beforeUpdate = now.minutes < toMinutes(ARRIVAL_UPDATE);
  const groups = arrivalsFor(beforeUpdate ? addDays(now.date, -1) : now.date);

  const m = now.date.m;
  const picks = PRODUCTS.filter((p) => p.peak.includes(m)).slice(0, 5);

  // 今日の終わっていないイベントから、7 日先までを近い順に 2 件
  const upcoming = Array.from({ length: 7 }, (_, i) => addDays(now.date, i))
    .flatMap((d, i) => eventsOn(d, posted).filter((e) => i > 0 || toMinutes(e.end) > now.minutes).map((e) => ({ ...e, d, i })))
    .slice(0, 2);

  const news = [...NEWS].filter((n) => n.date <= ymd(now.date)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 1);
  const { parking } = STORE;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className={card}>
        <h3 className={head}>今朝の入荷{beforeUpdate && `（本日分は ${fmt(ARRIVAL_UPDATE)} ごろ）`}</h3>
        {!groups ? (
          <p className="mt-2 text-[15px] text-ink-secondary">全館休業日です。</p>
        ) : (
          <ul className="mt-2 space-y-1 text-[15px] leading-[1.5] text-ink">
            {groups.slice(0, 3).map((g) => (
              <li key={g.id} className="line-clamp-1">
                {g.items
                  .slice(0, 3)
                  .map((i) => i.name)
                  .join('・')}
              </li>
            ))}
          </ul>
        )}
        {picks.length > 0 && <p className="mt-3 line-clamp-1 text-[13px] text-ink-secondary">{m}月の旬：{picks.map((p) => p.name).join('・')}</p>}
      </article>

      <article className={card}>
        <h3 className={head}>イベント・お知らせ</h3>
        <ul className="mt-2 space-y-1 text-[15px] leading-[1.5]">
          {upcoming.length === 0 && <li className="text-ink-secondary">1 週間のうちに予定はありません。</li>}
          {upcoming.map((e) => (
            <li key={`${ymd(e.d)}-${e.title}`} className="line-clamp-1 text-ink">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: EVENT_CATEGORIES[e.category].color }} aria-hidden />
              <span className="tabular-nums text-ink-secondary">{e.i === 0 ? '今日' : `${e.d.m}/${e.d.d}（${WEEKDAYS[weekday(e.d)]}）`} </span>
              {e.title}
            </li>
          ))}
        </ul>
        {news.map((n) => (
          <p key={n.title} className="mt-3 line-clamp-2 text-[13px] text-ink-secondary">
            {n.important && <span className="mr-1.5 font-semibold text-[#d70015]">重要</span>}
            {n.title}
          </p>
        ))}
      </article>

      <article id="shops" className={`${card} scroll-mt-20`}>
        <h3 className={head}>{SHOPS.length} の店と施設</h3>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[14px] text-ink">
          {SHOPS.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: KINDS[s.kind].color }} aria-hidden />
              {s.name}
            </li>
          ))}
        </ul>
      </article>

      <article id="access" className={`${card} scroll-mt-20`}>
        <h3 className={head}>アクセス</h3>
        <ul className="mt-2 space-y-1 text-[14px] leading-[1.5] text-ink">
          {ACCESS.slice(0, 2).map((a) => (
            <li key={a.mode}>
              <span className="font-semibold">{a.mode}</span> <span className="text-ink-secondary">{a.lines[0]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-ink-secondary">
          駐車場 {parking.cars + parking.large} 台・EV 充電 {parking.ev} 基・{parking.fee.split('（')[0]}
        </p>
      </article>
    </div>
  );
}
