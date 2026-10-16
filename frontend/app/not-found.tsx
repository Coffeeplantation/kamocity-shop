import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoMark } from '@/components/Devices';

export const metadata: Metadata = { title: 'ページが見つかりません' };

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-44px)] flex-col items-center justify-center bg-studio-light px-4 text-center">
      <LogoMark className="h-12 w-12 text-ink" />
      <h1 className="mt-6 text-[40px] font-semibold leading-[1.1] text-ink md:text-[56px]">ページが見つかりません。</h1>
      <p className="mt-3 text-[17px] text-ink-secondary md:text-[21px]">お探しのページは移動または削除された可能性があります。</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3.5">
        <Link href="/" className="btn-primary">
          ホームへ
        </Link>
        <Link href="/store" className="btn-secondary">
          ストアで探す
        </Link>
      </div>
    </div>
  );
}
