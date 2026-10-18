'use client';

import { useTokyoNow } from '@/components/store/useTokyoNow';
import { isBijinClosed } from '@/lib/kamo';

// 美人の湯の「今日は定休日かどうか」（第2・第4 水曜）
export default function BijinStatus() {
  const now = useTokyoNow(60 * 60_000);
  if (!now) return <span className="inline-block h-5 w-40 animate-pulse rounded-full bg-canvas-gray align-middle" />;
  const closed = isBijinClosed(now.date);
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${closed ? 'text-[#d70015]' : 'text-[#1a7f37]'}`}>
      <span className={`h-2 w-2 rounded-full ${closed ? 'bg-[#ff453a]' : 'bg-[#30d158]'}`} aria-hidden />
      {closed ? '今日は定休日です' : '今日は定休日ではありません'}
    </span>
  );
}
