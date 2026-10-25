'use client';

import Photo from '@/components/Photo';
import { usePostedEvents } from '@/components/store/PostedEvents';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ARRIVAL_UPDATE, arrivalsFor } from '@/lib/arrivals';
import { eventsOn } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { addDays, formatMD, toMinutes, WEEKDAYS, weekday, ymd } from '@/lib/jpCalendar';
import { EVENT_CATEGORIES, NEWS, PRODUCTS, type EventCategory } from '@/lib/storeInfo';

// 道の駅のトップの 2 画面目。今日の入荷（と今月の旬）・この先のイベント・お知らせを 1 画面に詰めたパネル
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

  // 入荷に並んでいる品は旬として重ねて出さず、まだ入荷していない旬の品だけを添える
  const arrived = new Set(groups?.flatMap((g) => g.items.slice(0, 6).map((i) => i.name)));
  const otherPicks = picks.filter((p) => !arrived.has(p.name)).slice(0, 6);

  // 今日の終わっていないイベントから 7 日先まで。同じ時間・同じタイトルの回は 1 行にまとめ、日付を並べる
  const upcoming: { title: string; start: string; category: EventCategory; days: string[] }[] = [];
  Array.from({ length: 7 }, (_, i) => addDays(now.date, i)).forEach((d, i) =>
    eventsOn(d, posted)
      .filter((e) => i > 0 || toMinutes(e.end) > now.minutes)
      .forEach((e) => {
        const day = i === 0 ? '今日' : `${d.m}/${d.d}（${WEEKDAYS[weekday(d)]}）`;
        const same = upcoming.find((u) => u.title === e.title && u.start === e.start);
        if (same) same.days.push(day);
        else upcoming.push({ title: e.title, start: e.start, category: e.category, days: [day] });
      }),
  );
  upcoming.splice(4);

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
        {otherPicks.length > 0 && (
          <p className="mt-5 text-[14px] leading-[1.6] text-ink-secondary">
            <span className="font-semibold text-ink">ほかの{m}月の旬</span>　{otherPicks.map((p) => p.name).join('・')}
          </p>
        )}
      </article>

      {/* この先のイベント */}
      <article className={`${card} md:col-span-2 lg:col-span-1 lg:row-span-2`}>
        <h3 className={head}>この先のイベント</h3>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-[15px] text-ink-secondary">1 週間のうちに予定はありません。</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {upcoming.map((e) => (
              <li key={`${e.start}-${e.title}`} className="text-[14px] leading-[1.45] text-ink">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: EVENT_CATEGORIES[e.category].color }} aria-hidden />
                <span className="tabular-nums text-ink-secondary">{fmt(e.start)}</span> {e.title}
                <span className="block pl-3.5 tabular-nums text-ink-secondary">{e.days.join('・')}</span>
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
