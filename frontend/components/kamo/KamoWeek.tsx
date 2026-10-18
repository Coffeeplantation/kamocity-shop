'use client';

import { useKamoWeather, weatherIcon, weatherLabel } from '@/components/kamo/useKamoWeather';
import { parseYmd, weekday, WEEKDAYS } from '@/lib/jpCalendar';

// 加茂市の 7 日間の天気。冬は降雪量も表示する
export default function KamoWeek() {
  const { data, failed } = useKamoWeather();
  if (failed) return <p className="rounded-card bg-surface p-6 text-[15px] text-ink-secondary">天気予報を取得できませんでした。時間をおいて再度お試しください。</p>;
  if (!data) return <div className="h-[168px] animate-pulse rounded-card bg-surface" />;

  return (
    <div className="no-scrollbar overflow-x-auto rounded-card bg-surface">
      <ol className="grid min-w-[640px] grid-cols-7 divide-x divide-line/[0.06]">
        {data.days.map((d, i) => {
          const day = weekday(parseYmd(d.date));
          return (
            <li key={d.date} className={`flex flex-col items-center px-2 py-5 text-center ${i === 0 ? 'bg-accent/[0.06]' : ''}`}>
              <p className={`text-[13px] font-semibold ${day === 0 ? 'text-[#d70015]' : day === 6 ? 'text-accent' : 'text-ink-secondary'}`}>
                {i === 0 ? '今日' : `${+d.date.slice(5, 7)}/${+d.date.slice(8)}`}
                <span className="ml-1 font-normal">（{WEEKDAYS[day]}）</span>
              </p>
              <p className="mt-2 text-[30px] leading-none" aria-hidden>
                {weatherIcon(d.code)}
              </p>
              <p className="mt-1.5 text-[13px] text-ink">{weatherLabel(d.code)}</p>
              <p className="mt-2 text-[15px] tabular-nums">
                <span className="font-semibold text-[#d70015]">{Math.round(d.max)}°</span>
                <span className="text-ink-tertiary"> / </span>
                <span className="font-semibold text-accent">{Math.round(d.min)}°</span>
              </p>
              <p className="mt-1 text-[12px] tabular-nums text-ink-secondary">☂ {d.rain}%</p>
              {d.snow > 0 && <p className="mt-0.5 text-[12px] tabular-nums text-ink-secondary">❄ {d.snow}cm</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
