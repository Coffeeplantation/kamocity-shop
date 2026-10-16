'use client';

import { useState } from 'react';
import { NEWS, NewsCategory } from '@/lib/storeInfo';

const CATS: (NewsCategory | 'すべて')[] = ['すべて', 'お知らせ', 'イベント', '施設', '商品', '交通'];
const CAT_COLOR: Record<NewsCategory, string> = {
  お知らせ: '#0071e3',
  イベント: '#ff375f',
  施設: '#34c759',
  商品: '#bf5af2',
  交通: '#ff9f0a',
};

export default function NewsList({ limit }: { limit?: number }) {
  const [cat, setCat] = useState<(typeof CATS)[number]>('すべて');
  const [expanded, setExpanded] = useState(false);
  const all = NEWS.filter((n) => cat === 'すべて' || n.category === cat);
  const shown = limit && !expanded ? all.slice(0, limit) : all;

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
        {shown.map((n) => (
          <li key={n.title}>
            <details className="group">
              <summary className="flex cursor-pointer list-none flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6 [&::-webkit-details-marker]:hidden">
                <span className="flex shrink-0 items-center gap-3 text-[14px] sm:w-56">
                  <time dateTime={n.date} className="tabular-nums text-ink-secondary">
                    {n.date.replaceAll('-', '.')}
                  </time>
                  <span className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-white" style={{ background: CAT_COLOR[n.category] }}>
                    {n.category}
                  </span>
                </span>
                <span className="flex flex-1 items-start justify-between gap-4 text-[17px] text-ink">
                  <span className="group-hover:underline">{n.title}</span>
                  <span className="mt-0.5 text-ink-tertiary transition-transform group-open:rotate-45" aria-hidden>
                    ＋
                  </span>
                </span>
              </summary>
              <p className="pb-6 text-[15px] leading-[1.6] text-ink-secondary sm:pl-[248px]">{n.body}</p>
            </details>
          </li>
        ))}
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
