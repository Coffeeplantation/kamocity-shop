'use client';

import { useState } from 'react';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { addDays, ymd } from '@/lib/jpCalendar';
import { NEWS, type NewsCategory } from '@/lib/storeInfo';

const CATS: (NewsCategory | 'すべて')[] = ['すべて', 'お知らせ', 'イベント', '施設', '商品', '交通'];
// 白文字でも読みやすい濃さの色（コントラスト比 4.5 以上）
const CAT_COLOR: Record<NewsCategory, string> = {
  お知らせ: '#0066cc',
  イベント: '#c4003f',
  施設: '#1a7f37',
  商品: '#7a3ea8',
  交通: '#a34700',
};

export default function NewsList({ limit }: { limit?: number }) {
  const now = useTokyoNow(10 * 60_000);
  const [cat, setCat] = useState<(typeof CATS)[number]>('すべて');
  const [expanded, setExpanded] = useState(false);
  const all = NEWS.filter((n) => cat === 'すべて' || n.category === cat);
  const shown = limit && !expanded ? all.slice(0, limit) : all;
  // 掲載から 7 日以内は NEW
  const newSince = now ? ymd(addDays(now.date, -7)) : null;

  return (
    <div>
      <div className="no-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1" role="group" aria-label="お知らせの種類で絞り込む">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
              cat === c ? 'border-ink bg-ink text-white' : 'border-[#d2d2d7] text-ink hover:border-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-black/10 border-y border-black/10">
        {shown.map((n) => {
          const isNew = newSince !== null && n.date > newSince && n.date <= ymd(now!.date);
          return (
            <li key={n.title}>
              <details className="group">
                <summary className="flex cursor-pointer list-none flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:gap-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex shrink-0 items-center gap-2 text-[14px] sm:w-64">
                    <time dateTime={n.date} className="tabular-nums text-ink-secondary">
                      {n.date.replaceAll('-', '.')}
                    </time>
                    <span className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-white" style={{ background: CAT_COLOR[n.category] }}>
                      {n.category}
                    </span>
                    {n.important && <span className="rounded-full border border-[#d70015] px-2 py-px text-[11px] font-semibold text-[#d70015]">重要</span>}
                    {isNew && <span className="text-[12px] font-semibold text-[#e3004f]">NEW</span>}
                  </span>
                  <span className="flex flex-1 items-start justify-between gap-4 text-[17px] text-ink">
                    <span className="group-hover:underline">{n.title}</span>
                    <span className="mt-0.5 text-ink-tertiary transition-transform group-open:rotate-45" aria-hidden>
                      ＋
                    </span>
                  </span>
                </summary>
                <p className="pb-6 text-[15px] leading-[1.7] text-ink-secondary sm:pl-[280px]">{n.body}</p>
              </details>
            </li>
          );
        })}
        {shown.length === 0 && <li className="py-8 text-[17px] text-ink-secondary">該当するお知らせはありません。</li>}
      </ul>

      {limit && all.length > limit && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="link-chevron mt-5 text-[17px]">
          {expanded ? '閉じる' : `すべてのお知らせを見る（${all.length}件）`} ›
        </button>
      )}
    </div>
  );
}
