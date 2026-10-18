'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogoMark } from '@/components/Devices';
import ThemeSwitch from '@/components/ThemeSwitch';

export const NAV_ITEMS = [
  { label: 'ストア', href: '/store' },
  { label: '店舗', href: '/stores' },
  { label: '加茂', href: '/kamo' },
  { label: 'Phone', href: '/#phone' },
  { label: 'Book', href: '/#book' },
  { label: 'Pad', href: '/#pad' },
  { label: 'Watch', href: '/#watch' },
  { label: 'Vision', href: '/#vision' },
  { label: 'Buds', href: '/#buds' },
  { label: 'イベント', href: '/stores#events' },
  { label: 'アクセス', href: '/stores#access' },
  { label: 'サポート', href: '/stores#faq' },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 8h14l-1 12.5H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAccountOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  const accountLinks = user
    ? [
        { label: `${user.nickname} さんのページ`, href: `/users/${user.id}` },
        { label: '出品する', href: '/furimas/new' },
      ]
    : [
        { label: 'サインイン', href: '/auth/login' },
        { label: 'アカウントを作成', href: '/auth/signup' },
      ];

  const iconBtn = 'flex h-11 w-9 items-center justify-center text-ink/80 transition-colors hover:text-ink';

  return (
    <>
      <header className="sticky top-0 z-50 h-11 bg-[rgb(var(--header)/0.8)] backdrop-blur-xl backdrop-saturate-[1.8]">
        <nav className="mx-auto flex h-full max-w-content items-center justify-between px-4 text-[12px] md:px-5 lg:px-10 xl:px-16">
          <Link href="/" className={iconBtn} aria-label="Lumina ホーム">
            <LogoMark className="h-[18px] w-[18px]" />
          </Link>

          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-2 md:flex lg:gap-3 lg:px-4 xl:gap-6 2xl:gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link whitespace-nowrap px-1.5 text-ink/80 transition-colors hover:text-ink lg:px-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center">
            <ThemeSwitch className="mr-2 hidden 2xl:flex" />
            <button type="button" className={iconBtn} aria-label="検索" onClick={() => setSearchOpen((v) => !v)}>
              <SearchIcon />
            </button>
            <Link href="/store" className={iconBtn} aria-label="ストア">
              <BagIcon />
            </Link>
            <div className="relative hidden md:block" ref={accountRef}>
              <button
                type="button"
                className={iconBtn}
                aria-label="アカウント"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((v) => !v)}
              >
                <PersonIcon />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-11 w-60 rounded-chip bg-surface/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
                  <p className="mb-3 text-[12px] text-ink-secondary">{user ? 'アカウント' : 'ようこそ'}</p>
                  <ul className="space-y-2.5 text-[14px] font-semibold">
                    {accountLinks.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-ink hover:text-accent-link">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                    {user && (
                      <li>
                        <button type="button" onClick={handleLogout} className="text-ink hover:text-accent-link">
                          サインアウト
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`${iconBtn} md:hidden`}
              aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-[17px]">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${
                    menuOpen ? 'top-1.5 rotate-45' : 'top-0.5'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${
                    menuOpen ? 'top-1.5 -rotate-45' : 'top-[9px]'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-line/5 bg-[rgb(var(--header)/0.97)] backdrop-blur-xl">
            <form
              className="mx-auto flex max-w-[680px] items-center gap-3 px-6 py-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
                const q = query.trim();
                router.push(q ? `/store?q=${encodeURIComponent(q)}` : '/store');
              }}
            >
              <span className="text-ink-tertiary">
                <SearchIcon />
              </span>
              <label htmlFor="site-search" className="sr-only">
                ストアの商品を検索
              </label>
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                autoFocus
                className="flex-1 bg-transparent text-[24px] font-semibold text-ink outline-none placeholder:text-ink-tertiary"
                placeholder="ストアの商品を検索"
              />
            </form>
          </div>
        )}
      </header>

      {/* モバイル全画面メニュー */}
      <div
        className={`fixed inset-x-0 bottom-0 top-11 z-40 overflow-y-auto bg-[rgb(var(--header))] px-12 pb-16 pt-6 transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block py-1 text-[28px] font-semibold text-ink" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeSwitch className="mt-8 w-fit text-[13px]" />
        <ul className="mt-8 space-y-3 border-t border-line/10 pt-6 text-[17px] text-ink-secondary">
          {accountLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button type="button" onClick={handleLogout}>
                サインアウト
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
