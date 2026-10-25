'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from '@/components/AccountMenu';

// Starlink 風ストアのページ内リンク（ストアのトップと同じ製品の並び）
export const SL_NAV = [
  { label: 'Phone', href: '#phone' },
  { label: 'Book', href: '#book' },
  { label: 'Pad', href: '#pad' },
  { label: 'Watch', href: '#watch' },
  { label: 'Vision', href: '#vision' },
  { label: 'Buds', href: '#buds' },
  { label: 'ストア', href: '#store' },
];

// starlink.com のような、透明で始まりスクロールすると黒くなるヘッダー。
// 左端の「メインページへ」で道の駅（/stores）へ戻り、右端はアカウントとメニュー。
export default function StarlinkHeader() {
  const { user, links, signOut } = useAccount();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const link = 'text-[13px] font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:text-white';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-b from-black/60 to-transparent'}`}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center gap-8 px-5 md:h-20 md:px-10">
          <Link href="/stores" className={`${link} shrink-0 whitespace-nowrap`}>
            メインページへ
          </Link>
          <ul className="hidden flex-1 items-center gap-7 lg:flex">
            {SL_NAV.map((i) => (
              <li key={i.href}>
                <a href={i.href} className={link}>
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-5">
            <Link href={user ? `/users/${user.id}` : '/auth/login'} className={`${link} hidden md:inline`}>
              {user ? user.nickname : 'サインイン'}
            </Link>
            <Link href="/store" className="sl-btn hidden !px-5 !py-2 md:inline-flex">
              注文する
            </Link>
            <button
              type="button"
              aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-8 items-center justify-center text-white lg:hidden"
            >
              <span className="relative block h-3.5 w-6">
                <span className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-1.5 h-[2px] w-full bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* スマホ・タブレットの全画面メニュー（右から出る黒いパネル） */}
      <div
        className={`fixed inset-0 top-16 z-40 overflow-y-auto bg-black px-8 pb-16 pt-6 transition-transform duration-500 lg:hidden md:top-20 ${
          open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        <ul className="divide-y divide-white/15">
          {SL_NAV.map((i) => (
            <li key={i.href}>
              <a href={i.href} onClick={() => setOpen(false)} className="block py-4 text-[17px] font-semibold uppercase tracking-[0.12em] text-white">
                {i.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-8 space-y-4 text-[15px] text-white/70">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                }}
              >
                サインアウト
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
