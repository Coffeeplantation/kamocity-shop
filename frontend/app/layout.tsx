import type { Metadata } from 'next';
import { Barlow, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { DEFAULT_THEME, THEME_KEY } from '@/lib/theme';

// SF Pro（Apple 専用で Web 利用不可）に最も近い Inter を自己ホストし、日本語はヒラギノ角ゴに近い Noto Sans JP を使う。
// Noto Sans JP は next/font での取得に不具合があるため、Google Fonts の CSS を直接読み込む。
// Mac / iOS では globals.css の指定により本来のシステムフォントが優先される。
// opsz 軸を読み込み、大きな見出しでは SF Pro Display のように字間が締まった字形に自動で切り替える。
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-inter', display: 'swap' });
// NVIDIA 風テーマ用。NVIDIA Sans（専用書体）や以前の DIN Pro に近い、DIN 系の Barlow を使う。
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-barlow', display: 'swap' });

// 保存された表示スタイルを、最初の描画より前に html へ反映する（切り替え時のちらつき防止）
const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');document.documentElement.dataset.theme=t==='apple'?'apple':'${DEFAULT_THEME}'}catch(e){}`;

export const metadata: Metadata = {
  title: { default: 'Lumina（日本）', template: '%s - Lumina（日本）' },
  description: 'Lumina Phone、Lumina Book、Lumina Pad、Lumina Watch などの架空製品を紹介するデザインデモ。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-theme={DEFAULT_THEME} className={`${inter.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ルートレイアウトなので全ページで読み込まれる（このルールは Pages Router 向け） */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface">
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
          <BackToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
