import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Lumina IDを作成' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
