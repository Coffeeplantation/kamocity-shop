'use client';

import { useEffect, useState } from 'react';
import { formatHours, tokyoNow, WEEKDAYS } from '@/lib/openStatus';
import { STORE } from '@/lib/storeInfo';

// 曜日ごとの営業時間。今日の行を強調する（日本時間）。
export default function HoursTable() {
  const [todayWd, setTodayWd] = useState<number | null>(null);
  useEffect(() => setTodayWd(tokyoNow().wd), []);

  // 月曜はじまりで表示
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <dl className="divide-y divide-black/10">
      {order.map((wd) => {
        const isToday = wd === todayWd;
        return (
          <div key={wd} className={`flex items-center justify-between py-3 text-[17px] ${isToday ? 'font-semibold text-ink' : 'text-ink'}`}>
            <dt className="flex items-center gap-2">
              {WEEKDAYS[wd]}曜日
              {isToday && <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">今日</span>}
            </dt>
            <dd className="tabular-nums">{formatHours(STORE.hours[wd])}</dd>
          </div>
        );
      })}
    </dl>
  );
}
