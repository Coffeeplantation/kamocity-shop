'use client';

import { useEffect, useState } from 'react';
import { tokyoNow, type TokyoNow } from '@/lib/jpCalendar';

// 日本時間の「今」。30秒ごとに更新し、サーバー描画とのずれを避けるためマウント後に値を返す。
// 確認用に URL へ ?now=2026-10-24T11:30 を付けると、その日時（日本時間）に固定できる。
export function useTokyoNow(intervalMs = 30_000): TokyoNow | null {
  const [now, setNow] = useState<TokyoNow | null>(null);
  useEffect(() => {
    const fixed = new URLSearchParams(window.location.search).get('now');
    const m = fixed?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (m) {
      setNow({ date: { y: +m[1], m: +m[2], d: +m[3] }, minutes: +m[4] * 60 + +m[5] });
      return;
    }
    const tick = () => setNow(tokyoNow());
    tick();
    const t = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}
