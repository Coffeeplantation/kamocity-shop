'use client';

import { useEffect, useState } from 'react';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ymd } from '@/lib/jpCalendar';
import { KAMO_EVENTS } from '@/lib/kamo';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const md = (s: string) => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;

// 月ごとの加茂市の行事・見頃。最初は今月を表示する
export default function KamoEvents() {
  const now = useTokyoNow(60 * 60_000);
  const [month, setMonth] = useState<number | null>(null);
  useEffect(() => {
    if (now && month === null) setMonth(now.date.m);
  }, [now, month]);

  if (!now || month === null) return <div className="h-[360px] animate-pulse rounded-card bg-surface" />;

  const today = ymd(now.date);
  const list = KAMO_EVENTS.filter((e) => e.months.includes(month));

  return (
    <div>
      <div className="no-scrollbar -mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1" role="group" aria-label="月を選ぶ">
        {MONTHS.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={month === m}
            onClick={() => setMonth(m)}
            className={`relative shrink-0 rounded-full border px-3.5 py-1.5 text-[14px] tabular-nums transition-colors ${
              month === m ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'
            }`}
          >
            {m}月{m === now.date.m && <span className="ml-1 text-[11px] font-semibold text-[#bf4800]">今月</span>}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-card bg-surface px-6 py-10 text-[17px] text-ink-secondary">この月に掲載している行事はありません。</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => {
            const d = e.date2026;
            const state = d ? (today > d.end ? '終了' : today >= d.start ? '開催中' : '予定') : null;
            return (
              <li key={e.title} className="flex flex-col rounded-card bg-surface p-6">
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <span className="text-ink-secondary">{e.when}</span>
                  {state === '開催中' && <span className="rounded-full bg-[#e3004f] px-2 py-px font-semibold text-white">開催中</span>}
                </div>
                <h3 className="mt-1.5 text-[21px] font-semibold leading-[1.3] text-ink">{e.title}</h3>
                <p className="mt-0.5 text-[13px] text-ink-secondary">{e.place}</p>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-secondary">{e.desc}</p>
                {d && (
                  <p className={`mt-3 text-[13px] ${state === '終了' ? 'text-ink-tertiary' : 'text-ink'}`}>
                    2026年：{d.start === d.end ? md(d.start) : `${md(d.start)}〜${md(d.end)}`}
                    {state === '終了' && '（終了）'}
                  </p>
                )}
                <a href={e.source} target="_blank" rel="noopener noreferrer" className="link-chevron mt-auto pt-4 text-[13px]">
                  くわしい情報 ›
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-[12px] text-ink-secondary">日程は年によって変わります。お出かけ前に各公式情報をご確認ください。</p>
    </div>
  );
}
