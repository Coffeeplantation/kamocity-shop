'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

// ログイン状態に応じたアカウントのリンクと、サインアウト（ヘッダーのメニューと、スマホの全画面メニューで共用）
export function useAccount() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const links = user
    ? [
        { label: `${user.nickname} さんのページ`, href: `/users/${user.id}` },
        { label: '出品する', href: '/furimas/new' },
      ]
    : [
        { label: 'サインイン', href: '/auth/login' },
        { label: 'アカウントを作成', href: '/auth/signup' },
      ];
  const signOut = async () => {
    await logout();
    router.push('/');
  };
  return { user, links, signOut };
}

// 人のアイコンのボタンと、押すと開くアカウントのメニュー（ストアのヘッダーと道の駅のヘッダーで共用）
export default function AccountMenu({ className = '' }: { className?: string }) {
  const { user, links, signOut } = useAccount();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className="flex h-11 w-9 items-center justify-center text-ink/80 transition-colors hover:text-ink"
        aria-label="アカウント"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <PersonIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-full w-60 rounded-chip bg-surface/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <p className="mb-3 text-[12px] text-ink-secondary">{user ? 'アカウント' : 'ようこそ'}</p>
          <ul className="space-y-2.5 text-[14px] font-semibold">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink hover:text-accent-link">
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
                  className="text-ink hover:text-accent-link"
                >
                  サインアウト
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
