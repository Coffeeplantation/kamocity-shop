'use client';

import { crowdAt, crowdLevel } from '@/lib/crowd';
import { toMinutes } from '@/lib/jpCalendar';
import { eventsOn } from '@/lib/events';
import { fmt, stationStatus } from '@/lib/hours';
import { nextDepartures, routeById } from '@/lib/shuttle';
import { StatusText } from '@/components/store/OpenBadge';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { usePostedEvents } from '@/components/store/PostedEvents';

// ヒーロー上の「いま」の情報（営業状況・混雑予想・次のシャトル・今日のイベント）
export default function LiveChips({ base = '' }: { base?: string }) {
  const now = useTokyoNow();
  const posted = usePostedEvents();
  const chip =
    'group flex min-h-[76px] flex-col justify-between rounded-chip border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur-xl transition-colors hover:bg-white/20';
  const label = 'text-[12px] font-semibold text-white/70';

  if (!now) {
    return (
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[76px] animate-pulse rounded-chip bg-white/10" />
        ))}
      </div>
    );
  }

  const status = stationStatus(now, false);
  const crowd = crowdAt(now);
  const level = crowd && status.open ? crowdLevel(crowd.value) : null;
  const bus = nextDepartures(routeById('from-station'), now, 1)[0];
  const events = eventsOn(now.date, posted);
  const upcoming = events.find((e) => toMinutes(e.end) > now.minutes);

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      <a href={`${base}#shops`} className={chip}>
        <span className={label}>営業状況</span>
        <StatusText status={status} tone="dark" />
      </a>
      <a href={`${base}#today`} className={chip}>
        <span className={label}>いまの混雑（予想）</span>
        {level ? (
          <span className="flex items-center gap-1.5 text-[14px] font-semibold text-white">
            <span className="h-2 w-2 rounded-full" style={{ background: level.color }} aria-hidden />
            {level.label}
          </span>
        ) : (
          // 営業していないことは隣の「営業状況」に出ているので、ここでは繰り返さない
          <span className="text-[14px] text-white/80">開館中に表示</span>
        )}
      </a>
      <a href={`${base}#access`} className={chip}>
        <span className={label}>次のシャトル（加茂駅前発）</span>
        {bus ? (
          <span className="text-[14px] text-white">
            <span className="font-semibold tabular-nums">{bus.time}</span>
            <span className="text-white/70">・{bus.inMinutes === 0 ? 'まもなく発車' : `あと${bus.inMinutes}分`}</span>
          </span>
        ) : (
          <span className="text-[14px] text-white/80">本日の運行は終了</span>
        )}
      </a>
      <a href={`${base}#today`} className={chip}>
        <span className={label}>今日のイベント</span>
        <span className="line-clamp-1 text-[14px] text-white">
          {events.length === 0 ? (
            <span className="text-white/80">予定はありません</span>
          ) : (
            <>
              <span className="font-semibold">{events.length}件</span>
              {upcoming && <span className="text-white/70">・{fmt(upcoming.start)} {upcoming.title}</span>}
            </>
          )}
        </span>
      </a>
    </div>
  );
}
