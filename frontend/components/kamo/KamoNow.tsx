'use client';

import Link from 'next/link';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { nextBijinBus } from '@/components/kamo/BijinBus';
import { useKamoWeather, weatherIcon, weatherLabel } from '@/components/kamo/useKamoWeather';
import { toMinutes } from '@/lib/jpCalendar';
import { KAMO_EVENTS } from '@/lib/kamo';

// 「いまの加茂」：天気・次の美人の湯行きバス・今月の行事をまとめて表示（加茂ページとトップページで使う）
export default function KamoNow({ base = '' }: { base?: string }) {
  const now = useTokyoNow();
  const { data: w, failed } = useKamoWeather();
  const bus = now ? nextBijinBus(now, 'to') : undefined;
  const events = now ? KAMO_EVENTS.filter((e) => e.months.includes(now.date.m)) : [];

  const card = 'flex min-h-[132px] flex-col rounded-card bg-surface p-5 transition-colors';
  const label = 'text-[12px] font-semibold text-ink-secondary';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className={card}>
        <span className={label}>加茂市の天気</span>
        {w ? (
          <>
            <span className="mt-2 flex items-baseline gap-2 text-[32px] font-semibold leading-none text-ink">
              <span aria-hidden>{weatherIcon(w.code)}</span>
              <span className="tabular-nums">{Math.round(w.temp)}°</span>
              <span className="text-[15px] font-normal text-ink-secondary">{weatherLabel(w.code)}</span>
            </span>
            <span className="mt-auto pt-2 text-[13px] text-ink-secondary">
              今日 {Math.round(w.days[0].max)}° / {Math.round(w.days[0].min)}°・降水 {w.days[0].rain}%
              {w.snowDepthCm > 0 && `・積雪 ${w.snowDepthCm}cm`}
            </span>
          </>
        ) : (
          <span className="mt-2 text-[15px] text-ink-secondary">{failed ? '天気を取得できませんでした' : '読み込み中…'}</span>
        )}
      </div>

      <div className={card}>
        <span className={label}>あしたとあさって</span>
        {w ? (
          <ul className="mt-2 space-y-1.5 text-[15px] text-ink">
            {w.days.slice(1).map((d) => (
              <li key={d.date} className="flex items-center justify-between gap-2">
                <span className="tabular-nums text-ink-secondary">
                  {+d.date.slice(5, 7)}/{+d.date.slice(8)}
                </span>
                <span>
                  {weatherIcon(d.code)} {weatherLabel(d.code)}
                </span>
                <span className="tabular-nums">
                  {Math.round(d.max)}°/{Math.round(d.min)}°
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="mt-2 text-[15px] text-ink-secondary">—</span>
        )}
      </div>

      <Link href={`${base}#bus`} className={`${card} hover:bg-surface/80`}>
        <span className={label}>次の美人の湯行き（加茂駅前発）</span>
        {now ? (
          bus ? (
            <span className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-ink">
              {bus.from}
              <span className="ml-2 text-[15px] font-normal text-ink-secondary">あと {toMinutes(bus.from) - now.minutes} 分</span>
            </span>
          ) : (
            <span className="mt-2 text-[17px] font-semibold text-ink">本日の運行は終了</span>
          )
        ) : (
          <span className="mt-2 text-[15px] text-ink-secondary">—</span>
        )}
        <span className="mt-auto pt-2 text-[13px] text-accent-link">時刻表を見る ›</span>
      </Link>

      <Link href={`${base}#events`} className={`${card} hover:bg-surface/80`}>
        <span className={label}>{now ? `${now.date.m}月の加茂` : '今月の加茂'}</span>
        {events.length ? (
          <ul className="mt-2 space-y-1 text-[15px] leading-[1.4] text-ink">
            {events.slice(0, 3).map((e) => (
              <li key={e.title} className="line-clamp-1">
                ・{e.title}
              </li>
            ))}
          </ul>
        ) : (
          <span className="mt-2 text-[15px] text-ink-secondary">{now ? '掲載している行事はありません' : '—'}</span>
        )}
        <span className="mt-auto pt-2 text-[13px] text-accent-link">行事カレンダー ›</span>
      </Link>
    </div>
  );
}
