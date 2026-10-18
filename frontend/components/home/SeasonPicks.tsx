'use client';

import Link from 'next/link';
import Photo from '@/components/Photo';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { PRODUCTS } from '@/lib/storeInfo';

// 今月が旬の産品を、写真つきの横スクロールで紹介する
export default function SeasonPicks() {
  const now = useTokyoNow(60 * 60_000);
  if (!now) return <div className="h-[420px] animate-pulse rounded-card bg-surface" />;

  const m = now.date.m;
  const picks = PRODUCTS.filter((p) => p.months.includes(m)).sort((a, b) => {
    const score = (p: (typeof PRODUCTS)[number]) => (p.peak.includes(m) ? 0 : 1) + (p.photo ? 0 : 2);
    return score(a) - score(b);
  });

  return (
    <div>
      <p className="mb-5 text-[17px] text-ink-secondary">
        <span className="font-semibold text-ink">{m}月</span>の旬 {picks.length} 品
      </p>
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-10 md:px-10 xl:-mx-16 xl:px-16">
        {picks.map((p) => (
          <li key={p.name} className="w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-card bg-surface">
            {p.photo ? (
              <Photo name={p.photo} sizes="340px" className="aspect-[4/3]" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-canvas-gray to-canvas-deep text-[40px] font-semibold text-ink/20">{p.name.slice(0, 2)}</div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-ink-secondary">{p.category}</span>
                {p.peak.includes(m) && <span className="rounded-full bg-[#e3004f] px-2 py-px text-[11px] font-semibold text-white">いまが最盛期</span>}
              </div>
              <p className="mt-1 text-[21px] font-semibold text-ink">{p.name}</p>
              <p className="mt-1 text-[14px] leading-[1.55] text-ink-secondary">{p.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/stores#season" className="link-chevron mt-5 text-[17px]">
        旬カレンダーを見る ›
      </Link>
    </div>
  );
}
