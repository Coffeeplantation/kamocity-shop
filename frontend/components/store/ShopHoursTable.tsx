'use client';

import { StatusSkeleton, StatusText } from '@/components/store/OpenBadge';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { closureLabel, fmt, formatHours, shopStatus } from '@/lib/hours';
import { dayType, holidayName, ymd } from '@/lib/jpCalendar';
import { KINDS, SHOPS, STORE } from '@/lib/storeInfo';

// 店舗ごとの営業時間一覧（平日・土日祝・定休日・いまの状況）
export default function ShopHoursTable() {
  const now = useTokyoNow();
  const type = now ? dayType(now.date) : null;
  const holiday = now ? holidayName(now.date) : null;

  const todayBadge = <span className="ml-1.5 rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">今日</span>;

  return (
    <div className="overflow-hidden rounded-[22px] bg-white">
      {now && (
        <p className="border-b border-black/10 px-6 py-4 text-[14px] text-ink-secondary">
          {STORE.closedDates.includes(ymd(now.date)) ? (
            <span className="font-semibold text-[#d70015]">今日は全館休業日です。</span>
          ) : (
            <>
              今日は<span className="font-semibold text-ink">{type === 'holiday' ? '土日祝' : '平日'}の営業時間</span>
              {holiday && `（${holiday}）`}です。
            </>
          )}
        </p>
      )}

      {/* デスクトップ：表 */}
      <table className="hidden w-full text-left text-[14px] md:table">
        <thead className="text-[12px] text-ink-secondary">
          <tr className="border-b border-black/10">
            <th scope="col" className="py-3 pl-6 font-normal">店舗・施設</th>
            <th scope="col" className="py-3 font-normal">平日{type === 'weekday' && todayBadge}</th>
            <th scope="col" className="py-3 font-normal">土日祝{type === 'holiday' && todayBadge}</th>
            <th scope="col" className="py-3 font-normal">定休日</th>
            <th scope="col" className="py-3 pr-6 font-normal">いま</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.06]">
          {SHOPS.map((s) => {
            const sch = s.schedule === '24h' ? null : s.schedule;
            return (
              <tr key={s.id} className="align-top">
                <th scope="row" className="py-3.5 pl-6 font-normal">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: KINDS[s.kind].color }}>
                      {s.no}
                    </span>
                    <span className="font-semibold text-ink">{s.name}</span>
                  </span>
                </th>
                <td className={`py-3.5 tabular-nums ${type === 'weekday' ? 'font-semibold text-ink' : 'text-ink-secondary'}`}>{sch ? formatHours(sch.weekday) : '24時間'}</td>
                <td className={`py-3.5 tabular-nums ${type === 'holiday' ? 'font-semibold text-ink' : 'text-ink-secondary'}`}>{sch ? formatHours(sch.holiday) : '24時間'}</td>
                <td className="py-3.5 pr-4 text-ink-secondary">{closureLabel(s)}</td>
                <td className="py-3.5 pr-6">{now ? <StatusText status={shopStatus(s, now)} size="sm" showDetail={false} /> : <StatusSkeleton />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* モバイル：リスト */}
      <ul className="divide-y divide-black/[0.06] md:hidden">
        {SHOPS.map((s) => {
          const sch = s.schedule === '24h' ? null : s.schedule;
          return (
            <li key={s.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: KINDS[s.kind].color }}>
                    {s.no}
                  </span>
                  <span className="text-[15px] font-semibold text-ink">{s.name}</span>
                </span>
                {now ? <StatusText status={shopStatus(s, now)} size="sm" showDetail={false} /> : <StatusSkeleton />}
              </div>
              <p className="mt-1.5 pl-[34px] text-[13px] tabular-nums text-ink-secondary">
                平日 {sch ? formatHours(sch.weekday) : '24時間'}・土日祝 {sch ? formatHours(sch.holiday) : '24時間'}
                <br />
                定休日 {closureLabel(s)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="space-y-1 border-t border-black/10 px-6 py-4 text-[12px] leading-[1.6] text-ink-secondary">
        <p>全館休業日：{STORE.closedDates.map((d) => d.replaceAll('-', '/')).join('、')}（トイレ・駐車場・EV 充電は 24 時間利用可）</p>
        <p>
          短縮営業：
          {Object.entries(STORE.specialHours)
            .map(([d, h]) => `${d.replaceAll('-', '/')} ${fmt(h.open)}〜${fmt(h.close)}`)
            .join('、')}
        </p>
      </div>
    </div>
  );
}
