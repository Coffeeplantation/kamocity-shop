'use client';

import { useState } from 'react';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ymd } from '@/lib/jpCalendar';
import { CATEGORY_COLOR, formatUpdatedAt, LOCAL_NEWS, NEWS_CATEGORIES, type NewsCategory } from '@/lib/localNews';

const md = (s: string) => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;

// 今日の新潟・加茂。防災の話題を先頭に、分類で絞り込める
export default function LocalNews({ limit }: { limit?: number }) {
  const [cat, setCat] = useState<NewsCategory | 'すべて'>('すべて');
  const now = useTokyoNow(60 * 60_000);
  // データの更新が遅れても、開催日が過ぎた話題は表示しない
  const today = now ? ymd(now.date) : null;
  const sorted = LOCAL_NEWS.items
    .filter((n) => !n.date || !today || n.date >= today)
    .sort((a, b) => Number(b.category === '防災') - Number(a.category === '防災'));
  const list = sorted.filter((n) => cat === 'すべて' || n.category === cat);
  const shown = limit ? list.slice(0, limit) : list;
  const cats = NEWS_CATEGORIES.filter((c) => LOCAL_NEWS.items.some((n) => n.category === c));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-secondary">
          {formatUpdatedAt(LOCAL_NEWS.updatedAt)} 更新（{LOCAL_NEWS.slot}の更新）・毎日 朝・昼・晩に更新
        </p>
        {!limit && (
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="group" aria-label="分類で絞り込む">
            {(['すべて', ...cats] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${cat === c ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((n) => (
          <li key={n.title} className={`flex flex-col rounded-card bg-surface p-6 ${n.category === '防災' ? 'ring-1 ring-[#d70015]/40' : ''}`}>
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="rounded-full px-2.5 py-0.5 font-semibold text-white" style={{ background: CATEGORY_COLOR[n.category] }}>
                {n.category}
              </span>
              <span className="text-ink-secondary">{n.area}</span>
              {n.date && <span className="tabular-nums text-ink-secondary">・{md(n.date)}</span>}
            </div>
            <h3 className="mt-2.5 text-[18px] font-semibold leading-[1.4] text-ink">{n.title}</h3>
            <p className="mt-2 text-[14px] leading-[1.65] text-ink-secondary">{n.summary}</p>
            <a href={n.url} target="_blank" rel="noopener noreferrer" className="link-chevron mt-auto pt-4 text-[13px]">
              出典：{n.source} ›
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] leading-[1.6] text-ink-secondary">
        ネット上の公開情報をもとに自動でまとめています。日程や内容は変わることがあるため、必ず出典でご確認ください。災害・避難の情報は、気象庁の発表と加茂市・新潟県の公式発表を優先してください。
      </p>
    </div>
  );
}
