import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// SF Pro（Apple 専用で Web 利用不可）に最も近い Inter を自己ホストし、日本語はヒラギノ角ゴに近い Noto Sans JP を使う。
// Noto Sans JP は next/font での取得に不具合があるため、Google Fonts の CSS を直接読み込む。
// Mac / iOS では globals.css の指定により本来のシステムフォントが優先される。
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Lumina（日本）', template: '%s - Lumina（日本）' },
  description: 'Lumina Phone、Lumina Book、Lumina Pad、Lumina Watch などの架空製品を紹介するデザインデモ。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ルートレイアウトなので全ページで読み込まれる（このルールは Pages Router 向け） */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-accent px-4 py-2 text-[14px] text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-2"
        >
          本文へ移動
        </a>
        <AuthProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
