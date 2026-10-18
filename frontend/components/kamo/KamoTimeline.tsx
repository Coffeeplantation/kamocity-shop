'use client';

import Photo from '@/components/Photo';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { KAMO_EVENTS } from '@/lib/kamo';

// これから半年の加茂。月ごとに、その月に見られる行事・見頃を時系列で並べる
export default function KamoTimeline() {
  const now = useTokyoNow(60 * 60_000);
  if (!now) return <div className="h-[280px] animate-pulse rounded-card bg-surface" />;

  const months = Array.from({ length: 6 }, (_, i) => ((now.date.m - 1 + i) % 12) + 1);

  return (
    <ol className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 xl:-mx-16 xl:scroll-px-16 xl:px-16">
      {months.map((m, i) => {
        const list = KAMO_EVENTS.filter((e) => e.months.includes(m));
        const lead = list.find((e) => e.photo);
        return (
          <li key={m} className="w-[min(78vw,300px)] shrink-0 snap-start overflow-hidden rounded-card bg-surface">
            <div className="relative">
              {lead?.photo ? (
                <Photo name={lead.photo} sizes="300px" className="aspect-[16/10]" />
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-canvas-gray to-canvas-deep" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
              <p className="absolute bottom-3 left-4 text-[28px] font-semibold leading-none text-white">
                {m}月{i === 0 && <span className="ml-2 align-middle text-[12px] font-semibold text-white/85">今月</span>}
              </p>
            </div>
            <ul className="space-y-2 p-4 text-[14px] text-ink">
              {list.length ? (
                list.map((e) => (
                  <li key={e.title} className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span>
                      {e.title}
                      <span className="block text-[12px] text-ink-secondary">{e.when}</span>
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-ink-secondary">掲載している行事はありません</li>
              )}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
