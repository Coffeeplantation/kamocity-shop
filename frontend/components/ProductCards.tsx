'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Buds, Card, Headset, Laptop, PhonePair, Tablet, Watch } from '@/components/Devices';
import { useHScroll } from '@/components/useHScroll';

export type LuminaProduct = { id: string; badge?: string; name: string; lead: string; price: string; href: string; dark?: boolean; art: ReactNode };

// 価格はすべて架空のもの
export const LUMINA_PRODUCTS: LuminaProduct[] = [
  { id: 'pro', badge: 'New', name: 'Lumina Phone 17 Pro', lead: 'プロの、その先へ。', price: '¥159,800（税込）から', href: '/#phone', art: <PhonePair id="card-pro" className="h-[250px]" /> },
  {
    id: '17',
    badge: 'New',
    name: 'Lumina Phone 17',
    lead: 'あざやかに。しなやかに。',
    price: '¥124,800（税込）から',
    href: '/#phone-17',
    dark: true,
    art: <PhonePair id="card-17" className="h-[250px]" frame={['#c9d8ea', '#7d94b3', '#d7e3f1']} back={['#a9c0de', '#8aa6cc']} wallpaper={['#04122b', '#0b3b74', '#36c3ff', '#2d5bff']} />,
  },
  { id: 'book', name: 'Lumina Book Air', lead: 'L5チップで、さらに薄く。さらに速く。', price: '¥164,800（税込）から', href: '/#book', art: <Laptop id="card-book" className="w-[300px]" /> },
  { id: 'pad', name: 'Lumina Pad Pro', lead: 'とてつもなく薄い。とてつもなくパワフル。', price: '¥168,800（税込）から', href: '/#pad', art: <Tablet id="card-pad" className="w-[290px]" /> },
  { id: 'watch', badge: 'New', name: 'Lumina Watch', lead: '健康を、もっと深く知る。', price: '¥59,800（税込）から', href: '/#watch', dark: true, art: <Watch id="card-watch" className="h-[230px]" /> },
  { id: 'vision', name: 'Lumina Vision', lead: '空間を、あなたのキャンバスに。', price: '¥599,800（税込）から', href: '/#vision', art: <Headset id="card-vision" className="w-[300px]" /> },
  { id: 'buds', name: 'Lumina Buds Pro 3', lead: '静けさを、もう一段上へ。', price: '¥39,800（税込）', href: '/#buds', art: <Buds id="card-buds" className="w-[220px]" /> },
  { id: 'card', name: 'Lumina Card', lead: '毎日のお買い物に、最大3%のキャッシュバック。', price: '年会費無料', href: '/store', art: <Card id="card-card" className="w-[280px]" /> },
];

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 製品カード 1 枚（トップの横スクロールと、ストアの一覧で共用）
export function ProductCard({ p }: { p: LuminaProduct }) {
  return (
    <Link
      href={p.href}
      className={`group flex h-[500px] flex-col overflow-hidden rounded-card p-7 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)] ${
        p.dark ? 'bg-studio-dark text-[#f5f5f7]' : 'bg-surface text-ink'
      }`}
    >
      <span className={`text-[12px] font-semibold text-[#bf4800] ${p.badge ? '' : 'invisible'}`}>{p.badge ?? '—'}</span>
      <span className="mt-1 text-[24px] font-semibold leading-[1.17] md:text-[28px]">{p.name}</span>
      <span className={`mt-1.5 text-[15px] leading-[1.45] ${p.dark ? 'text-white/75' : 'text-ink-secondary'}`}>{p.lead}</span>
      <span className={`mt-2 text-[14px] ${p.dark ? 'text-white/60' : 'text-ink-secondary'}`}>{p.price}</span>
      <span className="mt-auto flex items-end justify-center pt-4 transition-transform duration-500 group-hover:-translate-y-1">{p.art}</span>
    </Link>
  );
}

// Apple Store の「最新モデル」のような、横に並んだ製品カード。1 枚ずつがひと目で読める大きさ
export default function ProductCards() {
  const { ref, edge, update, scrollBy } = useHScroll<HTMLUListElement>();
  const btn = 'flex h-9 w-9 items-center justify-center rounded-full bg-ink/10 text-ink transition-opacity hover:bg-ink/15 disabled:opacity-30';

  return (
    <section aria-label="最新モデル" className="bg-canvas-gray py-12 md:py-16">
      <div className="mx-auto mb-6 flex max-w-content items-end justify-between gap-4 px-4 md:px-10 xl:px-16">
        <h2 className="text-[28px] font-semibold leading-[1.15] text-ink md:text-[40px]">
          最新モデル。<span className="text-ink-secondary">すべてのモデルを見る。</span>
        </h2>
        <div className="hidden gap-2 md:flex">
          <button type="button" aria-label="前の製品" className={btn} disabled={edge.start} onClick={() => scrollBy(-1)}>
            <Arrow dir="left" />
          </button>
          <button type="button" aria-label="次の製品" className={btn} disabled={edge.end} onClick={() => scrollBy(1)}>
            <Arrow dir="right" />
          </button>
        </div>
      </div>
      <ul
        ref={ref}
        onScroll={update}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-6 pt-1 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16"
      >
        {LUMINA_PRODUCTS.map((p) => (
          <li key={p.id} className="w-[min(82vw,400px)] shrink-0 snap-start">
            <ProductCard p={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
