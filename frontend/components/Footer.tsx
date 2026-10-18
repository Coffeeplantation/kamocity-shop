import Link from 'next/link';
import ThemeSwitch from '@/components/ThemeSwitch';

// フッターのリンクは、サイト内に実在するページ・セクションだけを並べる
const DIRECTORY = [
  {
    title: '製品を見る',
    links: [
      { label: 'Phone', href: '/#phone' },
      { label: 'Book', href: '/#book' },
      { label: 'Pad', href: '/#pad' },
      { label: 'Watch', href: '/#watch' },
      { label: 'Vision', href: '/#vision' },
      { label: 'Buds', href: '/#buds' },
    ],
  },
  {
    title: 'ストア',
    links: [
      { label: 'すべての商品', href: '/store' },
      { label: '在庫ありの商品', href: '/store?stock=1' },
      { label: '出品する', href: '/furimas/new' },
    ],
  },
  {
    title: 'アカウント',
    links: [
      { label: 'サインイン', href: '/auth/login' },
      { label: 'Lumina IDを作成', href: '/auth/signup' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="support" className="bg-canvas-gray text-[12px] leading-[1.33] text-ink-secondary">
      <div className="mx-auto max-w-content px-4 md:px-10 xl:px-16">
        <div className="space-y-2 border-b border-line/10 py-[17px]">
          <p>1. 下取り価格は対象デバイスの状態と機種によって異なります。表示価格は架空のものです。</p>
          <p>2. バッテリー駆動時間は使用状況や設定によって異なります。</p>
          <p>
            このサイトはデザイン学習用のデモであり、架空のブランド「Lumina」を使用しています。実在する企業・製品とは関係ありません。
          </p>
        </div>

        <nav aria-label="サイトディレクトリ" className="border-b border-line/10 py-5">
          {/* デスクトップ */}
          <div className="hidden grid-cols-3 gap-5 md:grid">
            {DIRECTORY.map((col) => (
              <div key={col.title}>
                <h3 className="mb-2 font-semibold text-ink">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-ink hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* モバイル: アコーディオン */}
          <div className="md:hidden">
            {DIRECTORY.map((col) => (
              <details key={col.title} className="group border-b border-line/10 last:border-0">
                <summary className="flex cursor-pointer list-none items-center justify-between py-2.5 text-[14px] text-ink [&::-webkit-details-marker]:hidden">
                  {col.title}
                  <span className="text-ink-tertiary transition-transform group-open:rotate-45">＋</span>
                </summary>
                <ul className="space-y-2 pb-3 pl-2.5 text-[14px]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </nav>

        <div className="py-4">
          <p className="mb-3">
            その他の購入方法：
            <Link href="/store" className="text-accent-link hover:underline">
              オンラインストア
            </Link>
            をご利用ください。
          </p>
          <div className="flex flex-col gap-2 border-t border-line/10 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <p>Copyright © 2026 Lumina Inc.（架空） All rights reserved.</p>
            <p>架空ブランドによるデザインデモです。</p>
            <div className="flex items-center gap-3">
              <span>表示スタイル</span>
              <ThemeSwitch />
              <span>日本</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
