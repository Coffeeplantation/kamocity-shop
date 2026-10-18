import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'ストア', description: 'Lumina のストア。出品された商品を検索・購入できます。' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
