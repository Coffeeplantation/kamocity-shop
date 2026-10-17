'use client';

import { useState } from 'react';
import Photo from '@/components/Photo';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { PRODUCTS, type ProductCategory } from '@/lib/storeInfo';

const CATS: (ProductCategory | 'すべて')[] = ['すべて', '野菜・米', '果物', '水産', '加工品'];
const CAT_COLOR: Record<ProductCategory, { strong: string; soft: string }> = {
  '野菜・米': { strong: '#28a745', soft: '#d6f0dc' },
  果物: { strong: '#f08c00', soft: '#ffe8c7' },
  水産: { strong: '#0a84ff', soft: '#d5e9ff' },
  加工品: { strong: '#a2845e', soft: '#eee5d8' },
};
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// 旬カレンダー：上段に「今が旬」、下段に一年の出回り時期
export default function SeasonCalendar() {
  const now = useTokyoNow();
  const [cat, setCat] = useState<(typeof CATS)[number]>('すべて');
  const month = now?.date.m ?? null;

  const withPhoto = PRODUCTS.filter((p) => p.photo);
  const inSeason = month
    ? [
        ...withPhoto.filter((p) => p.peak.includes(month)),
        ...withPhoto.filter((p) => !p.peak.includes(month) && p.months.includes(month)),
      ].slice(0, 4)
    : [];
  const rows = PRODUCTS.filter((p) => cat === 'すべて' || p.category === cat);

  return (
    <div className="space-y-10">
      {/* 今が旬 */}
      <div>
        <h3 className="mb-4 text-[21px] font-semibold text-ink">{month ? `${month}月、今が旬。` : '今が旬。'}</h3>
        {!month ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-card bg-surface" />)}</div>
        ) : (
          <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0 xl:grid-cols-4">
            {inSeason.map((p) => (
              <li key={p.name} className="relative w-[70vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-card bg-black md:w-auto md:max-w-none">
                <Photo name={p.photo!} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 70vw" className="aspect-[4/5]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="flex items-center gap-2 text-[11px] font-semibold">
                    <span className="rounded-full px-2.5 py-0.5" style={{ background: CAT_COLOR[p.category].strong }}>
                      {p.category}
                    </span>
                    <span className="text-white/80">{p.peak.includes(month!) ? '最盛期' : p.months.indexOf(month!) <= 1 ? '出はじめ' : '出回り中'}</span>
                  </span>
                  <p className="mt-2 text-[24px] font-semibold leading-[1.15]">{p.name}</p>
                  <p className="mt-1 text-[14px] leading-[1.45] text-white/80">{p.note}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 一年の出回り時期 */}
      <div className="rounded-card bg-surface p-4 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h3 className="text-[21px] font-semibold text-ink">一年の旬カレンダー</h3>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="種類で絞り込む">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
                  cat === c ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'
                }`}
              >
                {c !== 'すべて' && <span className="h-2 w-2 rounded-full" style={{ background: CAT_COLOR[c].strong }} />}
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-1.5 text-[13px]">
            <caption className="sr-only">産品ごとの出回り時期（濃い色が最盛期）</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 w-[168px] bg-surface pb-2 text-left font-normal text-ink-secondary">
                  産品
                </th>
                {MONTHS.map((m) => (
                  <th key={m} scope="col" className={`pb-2 text-center font-normal ${m === month ? 'font-semibold text-ink' : 'text-ink-secondary'}`}>
                    <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1 ${m === month ? 'bg-ink text-on-ink' : ''}`}>{m}月</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const color = CAT_COLOR[p.category];
                return (
                  <tr key={p.name}>
                    <th scope="row" className="sticky left-0 z-10 bg-surface pr-3 text-left font-normal">
                      <span className="flex items-center gap-2 text-[14px] text-ink">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color.strong }} aria-hidden />
                        {p.name}
                      </span>
                    </th>
                    {MONTHS.map((m, i) => {
                      const on = p.months.includes(m);
                      const peak = p.peak.includes(m);
                      const prevOn = p.months.includes(MONTHS[(i + 11) % 12]) && i > 0;
                      const nextOn = p.months.includes(MONTHS[(i + 1) % 12]) && i < 11;
                      return (
                        <td key={m} className={`relative h-7 p-0 ${m === month ? 'bg-canvas-gray' : ''}`}>
                          {on && (
                            <span
                              className={`absolute inset-y-1 flex items-center justify-center text-[11px] font-semibold text-white ${prevOn ? 'left-0' : 'left-1 rounded-l-full'} ${nextOn ? 'right-0' : 'right-1 rounded-r-full'}`}
                              style={{ background: peak ? color.strong : color.soft }}
                            >
                              {peak && '旬'}
                            </span>
                          )}
                          <span className="sr-only">{peak ? '最盛期' : on ? '出回り' : '—'}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-ink-secondary">濃い色が最盛期、薄い色が出回り時期です。天候により前後します。</p>
      </div>
    </div>
  );
}
