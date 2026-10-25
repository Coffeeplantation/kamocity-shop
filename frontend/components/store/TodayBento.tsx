'use client';

import Photo from '@/components/Photo';
import { usePostedEvents } from '@/components/store/PostedEvents';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ARRIVAL_UPDATE, arrivalsFor } from '@/lib/arrivals';
import { eventsOn } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { addDays, formatMD, toMinutes, WEEKDAYS, weekday, ymd } from '@/lib/jpCalendar';
import { EVENT_CATEGORIES, NEWS, PRODUCTS } from '@/lib/storeInfo';

// 道の駅のトップの 2 画面目。今日の入荷・今月の旬・この先のイベント・お知らせを 1 画面に詰めたパネル
const card = 'rounded-card border border-line/[0.08] bg-surface/80 p-5 backdrop-blur-xl sm:p-6';
const head = 'text-[13px] font-semibold text-ink-secondary';

export default function TodayBento() {
  const now = useTokyoNow();
  const posted = usePostedEvents();
  if (!now) return <div className="h-[560px] animate-pulse rounded-card bg-surface" />;

  // 更新前（8:30 まで）は前日の入荷を参考として表示
  const beforeUpdate = now.minutes < toMinutes(ARRIVAL_UPDATE);
  const arrivalDate = beforeUpdate ? addDays(now.date, -1) : now.date;
  const groups = arrivalsFor(arrivalDate);

  const m = now.date.m;
  const picks = PRODUCTS.filter((p) => p.months.includes(m)).sort((a, b) => Number(b.peak.includes(m)) - Number(a.peak.includes(m)));

  // 今日の終わっていないイベントから、7 日先までを近い順に 4 件
  const upcoming = Array.from({ length: 7 }, (_, i) => addDays(now.date, i))
    .flatMap((d, i) => eventsOn(d, posted).filter((e) => i > 0 || toMinutes(e.end) > now.minutes).map((e) => ({ ...e, d, i })))
    .slice(0, 4);

  const news = [...NEWS].filter((n) => n.date <= ymd(now.date)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {/* 本日の入荷 */}
      <article className={`${card} md:col-span-2 lg:row-span-2`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[24px] font-semibold text-ink md:text-[28px]">今朝、届いたもの。</h3>
          <p className={head}>
            {formatMD(arrivalDate)}・{beforeUpdate ? `本日分は ${fmt(ARRIVAL_UPDATE)} ごろ更新` : `${fmt(ARRIVAL_UPDATE)} 更新`}
          </p>
        </div>
        {!groups ? (
          <p className="mt-6 text-[17px] text-ink-secondary">全館休業日のため、入荷はありません。</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {groups.map((g) => (
              <li key={g.id} className="flex gap-4">
                <Photo name={g.photo} sizes="160px" className="h-[96px] w-[128px] shrink-0 rounded-tile sm:h-[105px] sm:w-[140px]" />
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold text-ink">{g.title}</p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-ink-secondary">
                    {g.items.slice(0, 6).map((i, n) => (
                      <span key={i.name}>
                        {n > 0 && '・'}
                        {i.name}
                        {i.tag && <span className="ml-0.5 text-[12px] font-semibold text-accent">（{i.tag}）</span>}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* 今月の旬 */}
      <article className={card}>
        <h3 className={head}>{m}月の旬</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {picks.slice(0, 8).map((p) => (
            <li key={p.name} className={`rounded-full px-3 py-1.5 text-[14px] ${p.peak.includes(m) ? 'bg-ink font-semibold text-on-ink' : 'bg-canvas-deep text-ink'}`}>
              {p.name}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-ink-tertiary">濃い色は、いまが最盛期のもの。</p>
      </article>

      {/* この先のイベント */}
      <article className={card}>
        <h3 className={head}>この先のイベント</h3>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-[15px] text-ink-secondary">1 週間のうちに予定はありません。</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {upcoming.map((e) => (
              <li key={`${ymd(e.d)}-${e.title}`} className="flex gap-3 text-[14px] leading-[1.45]">
                <span className="w-[84px] shrink-0 whitespace-nowrap tabular-nums text-ink-secondary">
                  {e.i === 0 ? '今日' : `${e.d.m}/${e.d.d}（${WEEKDAYS[weekday(e.d)]}）`}
                </span>
                <span className="min-w-0 text-ink">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: EVENT_CATEGORIES[e.category].color }} aria-hidden />
                  <span className="tabular-nums text-ink-secondary">{fmt(e.start)}</span> {e.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* お知らせ */}
      <article className={`${card} md:col-span-2 lg:col-span-3`}>
        <h3 className={head}>お知らせ</h3>
        <ul className="mt-2 divide-y divide-line/[0.08]">
          {news.map((n) => (
            <li key={n.title} className="flex flex-col gap-0.5 py-2.5 text-[15px] sm:flex-row sm:gap-5">
              <time dateTime={n.date} className="shrink-0 tabular-nums text-ink-secondary">
                {n.date.replaceAll('-', '.')}
              </time>
              <span className="text-ink">
                {n.important && <span className="mr-2 text-[12px] font-semibold text-[#d70015]">重要</span>}
                {n.title}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
