'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useHScroll } from '@/components/useHScroll';
import { Buds, Card, Headset, Laptop, PhonePair, Tablet, Watch } from '@/components/Devices';
import Icon from '@/components/Icons';

type Item = { label: string; href: string; icon: ReactNode; badge?: string };

// アイコンは同じ高さの枠に収め、製品ごとの縦横比の違いを吸収する
const box = 'flex h-[54px] w-[84px] items-end justify-center';

const ITEMS: Item[] = [
  { label: 'Phone 17 Pro', href: '/#phone', badge: 'New', icon: <PhonePair id="strip-pro" className="h-[54px]" /> },
  {
    label: 'Phone 17',
    href: '/#phone-17',
    badge: 'New',
    icon: <PhonePair id="strip-17" className="h-[54px]" frame={['#c9d8ea', '#7d94b3', '#d7e3f1']} back={['#a9c0de', '#8aa6cc']} wallpaper={['#04122b', '#0b3b74', '#36c3ff', '#2d5bff']} />,
  },
  { label: 'Book Air', href: '/#book', icon: <Laptop id="strip-book" className="w-[84px]" /> },
  { label: 'Pad Pro', href: '/#pad', icon: <Tablet id="strip-pad" className="w-[70px]" /> },
  { label: 'Watch', href: '/#watch', icon: <Watch id="strip-watch" className="h-[54px]" /> },
  { label: 'Vision', href: '/#vision', icon: <Headset id="strip-vision" className="w-[80px]" /> },
  { label: 'Buds Pro 3', href: '/#buds', icon: <Buds id="strip-buds" className="w-[64px]" /> },
  { label: 'Card', href: '/store', icon: <Card id="strip-card" className="w-[76px]" /> },
  { label: 'ストア', href: '/store', icon: <Icon name="store" className="h-11 w-11 text-ink" /> },
];

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Apple の製品ページ上部のような、横に並んだ製品ナビ。スワイプ・ホイール・矢印ボタンで左右に動かせる
export default function ProductStrip() {
  const { ref, edge, update, scrollBy } = useHScroll<HTMLUListElement>();

  const arrow =
    'absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-opacity md:flex';

  return (
    <nav aria-label="製品とサービス" className="relative border-b border-line/10 bg-surface">
      <button type="button" aria-label="前へ" onClick={() => scrollBy(-1)} className={`${arrow} left-3 ${edge.start ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <Arrow dir="left" />
      </button>
      <ul
        ref={ref}
        onScroll={update}
        className="no-scrollbar mx-auto flex w-fit max-w-full snap-x snap-mandatory scroll-px-4 gap-1 overflow-x-auto scroll-smooth px-4 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16"
      >
        {ITEMS.map((i) => (
          <li key={i.label} className="shrink-0 snap-start">
            <Link href={i.href} className="group flex w-[104px] flex-col items-center px-2 pb-3 pt-4 text-center">
              <span className={`${box} transition-transform duration-300 group-hover:-translate-y-0.5`}>{i.icon}</span>
              <span className="mt-2 text-[12px] leading-[1.3] text-ink group-hover:text-accent-link">{i.label}</span>
              <span className={`text-[10px] font-semibold leading-[1.3] text-[#bf4800] ${i.badge ? '' : 'invisible'}`}>{i.badge ?? '—'}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" aria-label="次へ" onClick={() => scrollBy(1)} className={`${arrow} right-3 ${edge.end ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <Arrow dir="right" />
      </button>
      {/* 端のフェード（続きがあることを示す） */}
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-surface to-transparent transition-opacity ${edge.start ? 'opacity-0' : 'opacity-100'}`} aria-hidden />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-surface to-transparent transition-opacity ${edge.end ? 'opacity-0' : 'opacity-100'}`} aria-hidden />
    </nav>
  );
}
