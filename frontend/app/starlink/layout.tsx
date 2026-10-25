import './starlink.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'ストア（Starlink 風）', description: 'Lumina の製品を、starlink.com 風の黒い全画面レイアウトで紹介するストアのページ。' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
