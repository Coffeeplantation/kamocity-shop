'use client';

import { useState } from 'react';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { crowdForecast, crowdLevel, quietHours } from '@/lib/crowd';
import { addDays, dayType, holidayName, sameDay, weekday, WEEKDAYS, ymd, type YMD } from '@/lib/jpCalendar';
import { nextDepartures, timetable } from '@/lib/shuttle';
import { SHUTTLE_ROUTES, STORE } from '@/lib/storeInfo';

const LEVELS = [0, 45, 70, 90].map((v) => crowdLevel(v));

function dayLabel(d: YMD, today: YMD) {
  if (sameDay(d, today)) return '今日';
  if (sameDay(d, addDays(today, 1))) return '明日';
  return `${d.m}/${d.d}`;
}

export default function CrowdShuttle() {
  const now = useTokyoNow();
  const [offset, setOffset] = useState(0);
  const [routeId, setRouteId] = useState(SHUTTLE_ROUTES[0].id);

  if (!now) {
    return (
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="h-[460px] animate-pulse rounded-card bg-surface" />
        <div className="h-[460px] animate-pulse rounded-card bg-surface" />
      </div>
    );
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(now.date, i));
  const date = days[offset];
  const isToday = offset === 0;
  const points = crowdForecast(date);
  const closed = STORE.closedDates.includes(ymd(date));
  const peak = Math.max(...points.map((p) => p.value));
  const peakLevel = crowdLevel(peak);
  const busy = points.filter((p) => p.value >= 90).map((p) => p.hour);
  const quiet = quietHours(points);
  const currentHour = Math.floor(now.minutes / 60);
  const route = SHUTTLE_ROUTES.find((r) => r.id === routeId)!;
  const table = timetable(route, date);
  const next = isToday ? nextDepartures(route, now, 3) : [];
  const holiday = holidayName(date);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* 混雑予想 */}
      <div className="rounded-card bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[21px] font-semibold text-ink">混雑予想</h3>
          <p className="text-[12px] text-ink-secondary">過去の来場傾向にもとづく目安です</p>
        </div>

        <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="日付を選ぶ">
          {days.map((d, i) => {
            const lv = crowdLevel(Math.max(...crowdForecast(d).map((p) => p.value)));
            const on = i === offset;
            const wd = weekday(d);
            return (
              <button
                key={ymd(d)}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setOffset(i)}
                className={`flex min-w-[64px] shrink-0 flex-col items-center rounded-chip border px-3 py-2 transition-colors ${on ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'}`}
              >
                <span className="text-[14px] font-semibold">{dayLabel(d, now.date)}</span>
                <span className={`text-[11px] ${on ? 'text-white/70' : wd === 0 || holidayName(d) ? 'text-[#d70015]' : wd === 6 ? 'text-accent-link' : 'text-ink-secondary'}`}>
                  {WEEKDAYS[wd]}
                  {holidayName(d) ? '・祝' : ''}
                </span>
                <span className="mt-1 h-1.5 w-6 rounded-full" style={{ background: STORE.closedDates.includes(ymd(d)) ? '#d2d2d7' : lv.color }} aria-hidden />
              </button>
            );
          })}
        </div>

        {closed ? (
          <p className="mt-8 rounded-chip bg-canvas-gray px-5 py-10 text-center text-[17px] text-ink-secondary">全館休業日です（トイレ・駐車場・EV 充電は 24 時間利用可）。</p>
        ) : (
          <>
            <p className="mt-6 text-[17px] leading-[1.5] text-ink">
              {holiday && <span className="mr-1 text-[#d70015]">{holiday}。</span>}
              {busy.length ? (
                <>
                  <span className="font-semibold" style={{ color: peakLevel.color }}>
                    {busy[0]}時〜{busy[busy.length - 1] + 1}時は大変混雑
                  </span>
                  が予想されます。
                </>
              ) : (
                <>
                  いちばん混むのは
                  <span className="font-semibold" style={{ color: peakLevel.color }}>
                    {points.find((p) => p.value === peak)!.hour}時台（{peakLevel.label}）
                  </span>
                  の見込みです。
                </>
              )}
              {quiet.length > 0 && <>おすすめは {quiet.map((h) => `${h}時台`).join('・')}。</>}
            </p>

            {/* 棒グラフ */}
            <div className="mt-6" role="img" aria-label={`${date.m}月${date.d}日の時間帯別混雑予想`}>
              <div className="flex h-44 items-end gap-1.5 sm:gap-2">
                {points.map((p) => {
                  const lv = crowdLevel(p.value);
                  const isNow = isToday && p.hour === currentHour;
                  return (
                    <div key={p.hour} className="relative flex h-full flex-1 flex-col items-center justify-end">
                      {isNow && (
                        <span className="absolute -top-1 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-on-ink">いま</span>
                      )}
                      <div
                        className={`w-full rounded-t-md transition-[height] duration-500 ${isNow ? 'ring-2 ring-ink ring-offset-2' : ''}`}
                        style={{ height: `${Math.max(p.value, 3)}%`, background: lv.color, opacity: isToday && p.hour < currentHour ? 0.35 : 1 }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-1.5 sm:gap-2">
                {points.map((p) => (
                  <span key={p.hour} className="flex-1 text-center text-[11px] tabular-nums text-ink-secondary">
                    {p.hour}
                  </span>
                ))}
              </div>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-secondary">
              {LEVELS.map((l) => (
                <li key={l.label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} aria-hidden />
                  {l.label}
                </li>
              ))}
            </ul>
            {busy.length > 0 && dayType(date) === 'holiday' && (
              <p className="mt-5 rounded-chip bg-[#fff4e5] px-4 py-3 text-[14px] leading-[1.5] text-[#8a4b00]">
                P1 駐車場が満車になる可能性があります。臨時駐車場 P3（{STORE.parking.temporary}台）から 10 分間隔で無料シャトルを運行します。
              </p>
            )}
          </>
        )}
      </div>

      {/* シャトルバス */}
      <div id="shuttle" className="scroll-mt-32 rounded-card bg-surface p-5 sm:p-7">
        <h3 className="text-[21px] font-semibold text-ink">無料シャトルバス</h3>
        <p className="mt-1 text-[13px] text-ink-secondary">
          {date.m}月{date.d}日（{WEEKDAYS[weekday(date)]}）の時刻・{dayType(date) === 'holiday' ? '土日祝' : '平日'}ダイヤ
        </p>
        <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="乗り場を選ぶ">
          {SHUTTLE_ROUTES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === routeId}
              onClick={() => setRouteId(r.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${r.id === routeId ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'}`}
            >
              {r.from}発
            </button>
          ))}
        </div>

        {isToday && (
          <div className="mt-5 rounded-chip bg-canvas-gray p-4">
            <p className="text-[12px] text-ink-secondary">
              次の便（{route.from} → {route.to}）
            </p>
            {next.length ? (
              <ul className="mt-2 space-y-1.5">
                {next.map((d, i) => (
                  <li key={d.time} className="flex items-baseline justify-between">
                    <span className={`tabular-nums ${i === 0 ? 'text-[28px] font-semibold text-ink' : 'text-[17px] text-ink'}`}>{d.time}</span>
                    <span className={`text-[14px] ${i === 0 && d.inMinutes <= 5 ? 'font-semibold text-[#d70015]' : 'text-ink-secondary'}`}>
                      {d.inMinutes === 0 ? 'まもなく発車' : `あと${d.inMinutes}分`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[17px] text-ink">本日の運行は終了しました。</p>
            )}
          </div>
        )}

        {table.length ? (
          <table className="mt-5 w-full text-[14px] tabular-nums">
            <caption className="sr-only">
              {route.from}発の時刻表
            </caption>
            <tbody className="divide-y divide-line/[0.06]">
              {table.map((row) => (
                <tr key={row.hour} className={isToday && row.hour === currentHour ? 'bg-canvas-gray' : ''}>
                  <th scope="row" className="w-12 py-1.5 pl-2 text-left font-semibold text-ink">
                    {row.hour}
                  </th>
                  <td className="py-1.5 tracking-wide text-ink-secondary">{row.minutes.join('　')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-5 text-[15px] text-ink-secondary">{route.weekday ? 'この日は運休です。' : 'この便は土日祝のみ運行します。'}</p>
        )}
        <p className="mt-4 text-[12px] leading-[1.6] text-ink-secondary">乗車無料・予約不要。湊町駅 ⇄ 道の駅は約 9 分です。道路状況により遅れることがあります。</p>
      </div>
    </div>
  );
}
