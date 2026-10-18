'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AccountMenu from '@/components/AccountMenu';

type Item = { id: string; label: string };

// ページ内ナビ。いま読んでいるセクションを強調し、横スクロールの位置も追従させる。
// 道の駅のページではサイトのヘッダーの代わりに一番上に置き、左端の「ストア」から戻れるようにする。右端はアカウントのメニュー。
export default function SectionNav({ title, items, home }: { title: string; items: Item[]; home?: { href: string; label: string } }) {
  const [active, setActive] = useState<string>('');
  const listRef = useRef<HTMLUListElement>(null);

  // スクロール位置から「上端がナビの下を通過した最後のセクション」を求める
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 140;
      let current = '';
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = i.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (list && link) list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav
      aria-label="ページ内リンク"
      className={`sticky z-50 border-b border-line/10 bg-[rgb(var(--header)/0.85)] backdrop-blur-xl backdrop-saturate-150 ${home ? 'top-0' : 'top-11'}`}
    >
      <div className="mx-auto flex h-[52px] max-w-content items-center gap-4 px-4 md:gap-6 md:px-10 xl:px-16">
        {home && (
          <Link href={home.href} className="flex h-11 shrink-0 items-center text-[13px] font-semibold text-ink/80 transition-colors hover:text-ink">
            {home.label}
          </Link>
        )}
        {/* 道の駅のヘッダーとして使うときは施設名を出さない */}
        {!home && <span className="hidden shrink-0 text-[17px] font-semibold text-ink md:inline">{title}</span>}
        <ul
          ref={listRef}
          className={`no-scrollbar flex h-full min-w-0 flex-1 items-center gap-5 overflow-x-auto text-[13px] md:gap-6 ${home ? 'lg:justify-center' : 'md:justify-end'}`}
        >
          {items.map((i) => {
            const on = active === i.id;
            return (
              <li key={i.id} className="relative flex h-full shrink-0 items-center">
                <a
                  href={`#${i.id}`}
                  data-id={i.id}
                  aria-current={on ? 'location' : undefined}
                  className={`transition-colors ${on ? 'font-semibold text-ink' : 'text-ink-secondary hover:text-ink'}`}
                >
                  {i.label}
                </a>
                <span className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-ink transition-opacity [[data-theme=nv]_&]:bg-accent ${on ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
              </li>
            );
          })}
        </ul>
        {home && <AccountMenu className="-mr-2 shrink-0" />}
      </div>
    </nav>
  );
}
