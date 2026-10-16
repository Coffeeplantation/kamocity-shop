'use client';

import { useEffect, useState } from 'react';
import { OpenStatus, openStatus } from '@/lib/openStatus';
import { FACILITIES } from '@/lib/storeInfo';

// 現在の営業状況（1分ごとに更新）。サーバー描画とのずれを避けるため、表示はマウント後に行う。
export function useOpenStatus(facilityKey?: string) {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const f = facilityKey ? FACILITIES.find((x) => x.key === facilityKey) ?? 'store' : 'store';
    const update = () => setStatus(openStatus(f));
    update();
    const t = window.setInterval(update, 60_000);
    return () => window.clearInterval(t);
  }, [facilityKey]);
  return status;
}

export default function OpenBadge({
  facility,
  tone = 'light',
  size = 'md',
}: {
  facility?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md';
}) {
  const s = useOpenStatus(facility);
  const text = size === 'sm' ? 'text-[12px]' : 'text-[14px]';
  if (!s) return <span className={`inline-block h-5 w-28 animate-pulse rounded-full ${tone === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />;
  const color = s.open ? (s.label === 'まもなく終了' ? 'text-[#b64400]' : 'text-[#1a7f37]') : 'text-[#d70015]';
  const darkColor = s.open ? 'text-[#30d158]' : 'text-[#ff6961]';
  return (
    <span className={`inline-flex items-center gap-1.5 ${text}`} role="status">
      <span className={`h-2 w-2 rounded-full ${s.open ? 'bg-[#30d158]' : 'bg-[#ff453a]'}`} aria-hidden />
      <span className={`font-semibold ${tone === 'dark' ? darkColor : color}`}>{s.label}</span>
      {s.detail && <span className={tone === 'dark' ? 'text-[#a1a1a6]' : 'text-ink-secondary'}>・{s.detail}</span>}
    </span>
  );
}
