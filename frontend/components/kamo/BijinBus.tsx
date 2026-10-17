'use client';

import { useState } from 'react';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { toMinutes } from '@/lib/jpCalendar';
import { BUS_TIMETABLE_REVISION, busNote, FROM_BIJINNOYU, isKamoWeekday, SOURCES, TO_BIJINNOYU, tripsOn, type BusTrip } from '@/lib/kamo';

type Dir = 'to' | 'from';
const DIRS: Record<Dir, { label: string; fromStop: string; toStop: string; trips: BusTrip[] }> = {
  to: { label: '美人の湯へ', fromStop: '加茂駅前', toStop: '美人の湯前', trips: TO_BIJINNOYU },
  from: { label: '加茂駅へ', fromStop: '美人の湯前', toStop: '加茂駅前', trips: FROM_BIJINNOYU },
};

export function nextBijinBus(now: { date: Parameters<typeof tripsOn>[1]; minutes: number }, dir: Dir = 'to') {
  return tripsOn(DIRS[dir].trips, now.date).find((t) => toMinutes(t.from) >= now.minutes);
}

// かもんバス 七谷線：加茂駅前 ⇄ 美人の湯前 の次の便と、今日の時刻表
export default function BijinBus() {
  const now = useTokyoNow();
  const [dir, setDir] = useState<Dir>('to');
  const d = DIRS[dir];

  if (!now) return <div className="h-[420px] animate-pulse rounded-card bg-surface" />;

  const today = tripsOn(d.trips, now.date);
  const upcoming = today.filter((t) => toMinutes(t.from) >= now.minutes);
  const next = upcoming[0];
  const note = busNote(now.date);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <div className="flex flex-col rounded-card bg-surface p-6 md:p-8">
        <div className="flex gap-2" role="group" aria-label="方向">
          {(Object.keys(DIRS) as Dir[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={dir === k}
              onClick={() => setDir(k)}
              className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${dir === k ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'}`}
            >
              {DIRS[k].label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-ink-secondary">
          次のバス（{d.fromStop} 発 → {d.toStop}）
        </p>
        {next ? (
          <>
            <p className="mt-1 text-[56px] font-semibold leading-none tabular-nums text-ink">{next.from}</p>
            <p className="mt-2 text-[17px] text-ink">
              {toMinutes(next.from) - now.minutes === 0 ? 'まもなく発車' : `あと ${toMinutes(next.from) - now.minutes} 分`}
              <span className="text-ink-secondary">・{d.toStop} {next.to} 着（第{next.no}便）</span>
            </p>
            {upcoming[1] && (
              <p className="mt-3 text-[14px] text-ink-secondary">
                その次：<span className="tabular-nums">{upcoming.slice(1, 3).map((t) => t.from).join('、')}</span>
              </p>
            )}
          </>
        ) : (
          <p className="mt-2 text-[24px] font-semibold text-ink">本日の運行は終了しました</p>
        )}
        <p className="mt-6 text-[13px] text-ink-secondary">
          {isKamoWeekday(now.date) ? '今日は平日ダイヤ' : '今日は土日祝ダイヤ'}・{BUS_TIMETABLE_REVISION}
          {note && <span className="block text-[#b25000]">{note}</span>}
        </p>
        <p className="mt-auto pt-6 text-[12px] leading-[1.6] text-ink-secondary">
          かもんバス（加茂市営バス）七谷線。運賃は後払い（現金・回数券・RYDE Pass）。最新の時刻・運休情報は
          <a href={SOURCES.bus} target="_blank" rel="noopener noreferrer" className="link-chevron">
            加茂市公式 ›
          </a>
        </p>
      </div>

      <div className="rounded-card bg-surface p-2">
        <table className="w-full text-left text-[15px]">
          <caption className="px-4 pb-1 pt-3 text-left text-[14px] font-semibold text-ink">
            今日の時刻表（{d.fromStop} → {d.toStop}）
          </caption>
          <thead>
            <tr className="text-[12px] text-ink-secondary">
              <th className="px-4 py-2 font-normal">便</th>
              <th className="px-4 py-2 font-normal">{d.fromStop} 発</th>
              <th className="px-4 py-2 font-normal">{d.toStop} 着</th>
              <th className="px-4 py-2 font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/[0.06]">
            {d.trips.map((t) => {
              const runs = today.includes(t);
              const past = runs && toMinutes(t.from) < now.minutes;
              const isNext = next === t;
              return (
                <tr key={t.no} className={`${isNext ? 'bg-accent/10' : ''} ${!runs || past ? 'text-ink-tertiary' : 'text-ink'}`}>
                  <td className="px-4 py-2.5 tabular-nums">第{t.no}便</td>
                  <td className="px-4 py-2.5 font-semibold tabular-nums">{t.from}</td>
                  <td className="px-4 py-2.5 tabular-nums">{t.to}</td>
                  <td className="px-4 py-2.5 text-right text-[12px]">
                    {isNext ? <span className="font-semibold text-accent">次の便</span> : !runs ? '本日運休' : t.weekdayOnly ? '平日のみ' : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
