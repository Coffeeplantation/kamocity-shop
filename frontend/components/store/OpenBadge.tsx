'use client';

import { shopStatus, stationStatus, type Status } from '@/lib/hours';
import { SHOPS } from '@/lib/storeInfo';
import { useTokyoNow } from '@/components/store/useTokyoNow';

const COLORS: Record<Status['state'], { dot: string; light: string; dark: string }> = {
  open: { dot: 'bg-[#30d158]', light: 'text-[#1a7f37]', dark: 'text-[#30d158]' },
  '24h': { dot: 'bg-[#30d158]', light: 'text-[#1a7f37]', dark: 'text-[#30d158]' },
  closing: { dot: 'bg-[#ff9f0a]', light: 'text-[#b25000]', dark: 'text-[#ffb340]' },
  before: { dot: 'bg-[#ff9f0a]', light: 'text-[#b25000]', dark: 'text-[#ffb340]' },
  after: { dot: 'bg-[#ff453a]', light: 'text-[#d70015]', dark: 'text-[#ff6961]' },
  closed: { dot: 'bg-[#ff453a]', light: 'text-[#d70015]', dark: 'text-[#ff6961]' },
};

export function StatusText({
  status,
  tone = 'light',
  size = 'md',
  showDetail = true,
}: {
  status: Status;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md';
  showDetail?: boolean;
}) {
  const c = COLORS[status.state];
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-1.5 ${size === 'sm' ? 'text-[12px]' : 'text-[14px]'}`} role="status">
      <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot} ${status.open ? 'shadow-[0_0_0_3px_rgba(48,209,88,0.18)]' : ''}`} aria-hidden />
      <span className={`font-semibold ${tone === 'dark' ? c.dark : c.light}`}>{status.label}</span>
      {showDetail && status.detail && <span className={tone === 'dark' ? 'text-white/70' : 'text-ink-secondary'}>・{status.detail}</span>}
    </span>
  );
}

export function StatusSkeleton({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return <span className={`inline-block h-4 w-32 animate-pulse rounded-full ${tone === 'dark' ? 'bg-white/15' : 'bg-black/[0.06]'}`} />;
}

// shop を省略すると道の駅全体の営業状況
export default function OpenBadge({ shop, tone = 'light', size = 'md', showDetail = true }: { shop?: string; tone?: 'light' | 'dark'; size?: 'sm' | 'md'; showDetail?: boolean }) {
  const now = useTokyoNow();
  if (!now) return <StatusSkeleton tone={tone} />;
  const target = shop ? SHOPS.find((s) => s.id === shop) : undefined;
  const status = target ? shopStatus(target, now) : stationStatus(now);
  return <StatusText status={status} tone={tone} size={size} showDetail={showDetail} />;
}
