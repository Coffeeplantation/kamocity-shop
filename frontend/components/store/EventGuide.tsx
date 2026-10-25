'use client';

import { useEffect } from 'react';
import { eventIcs } from '@/lib/events';
import { fmt } from '@/lib/hours';
import { WEEKDAYS, weekday, ymd, type YMD } from '@/lib/jpCalendar';
import { EVENT_CATEGORIES, type StoreEvent } from '@/lib/storeInfo';

// イベントを押したときに出す「参加の案内」。日時・場所・料金・定員・持ち物と、申し込み方法を 1 枚にまとめる。
// 申し込み方法に URL があればそのリンク、なければ LINE 公式アカウント（NEXT_PUBLIC_LINE_FRIEND_URL）を案内する。

const LINE_URL = process.env.NEXT_PUBLIC_LINE_FRIEND_URL;
// 投稿された文面のリンクは http(s) だけを使う（javascript: などは載せない）
// カレンダーアプリ用のファイル（.ics）を保存する
export function downloadIcs(e: StoreEvent, date: YMD) {
  const blob = new Blob([eventIcs(e, date)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lumina-${ymd(date)}-${e.start.replace(':', '')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const safeUrl = (s?: string) => s?.match(/https?:\/\/[^\s<>"']+/)?.[0];

export default function EventGuide({ event: e, date: d, onClose }: { event: StoreEvent; date: YMD; onClose: () => void }) {
  useEffect(() => {
    const key = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cat = EVENT_CATEGORIES[e.category];
  const url = safeUrl(e.apply);
  const applyText = e.apply?.replace(url ?? '', '').trim();
  const rows: [string, string | undefined][] = [
    ['日時', `${d.m}月${d.d}日（${WEEKDAYS[weekday(d)]}） ${fmt(e.start)}〜${fmt(e.end)}`],
    ['場所', e.place],
    ['参加費', e.fee],
    ['定員', e.capacity],
    ['持ち物', e.bring],
    ['予約', e.reservation ? '必要です' : 'いりません（当日そのままどうぞ）'],
  ];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="event-guide-title" className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-6" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[28px] bg-surface p-6 shadow-2xl sm:rounded-[28px] sm:p-8" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: cat.color }}>
            <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
            {cat.label}
          </p>
          <button type="button" onClick={onClose} aria-label="閉じる" className="-mr-2 -mt-2 h-10 w-10 rounded-full text-[22px] text-ink-secondary hover:bg-canvas-gray">
            ×
          </button>
        </div>
        <h2 id="event-guide-title" className="mt-1 text-[26px] font-semibold leading-[1.25] text-ink">
          {e.title}
        </h2>
        {e.desc && <p className="mt-3 text-[15px] leading-[1.7] text-ink">{e.desc}</p>}

        <dl className="mt-5 divide-y divide-line/[0.08] rounded-chip bg-canvas-gray px-4">
          {rows
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="flex gap-4 py-3 text-[15px]">
                <dt className="w-16 shrink-0 text-ink-secondary">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
        </dl>

        <h3 className="mt-6 text-[17px] font-semibold text-ink">参加のしかた</h3>
        <p className="mt-1.5 text-[15px] leading-[1.7] text-ink-secondary">
          {applyText ||
            (!e.reservation
              ? '予約はいりません。開始時間までに会場へお越しください。'
              : url || LINE_URL
                ? '予約が必要です。下のボタンからお申し込みください。'
                : '予約が必要です。館内の受付でお申し込みください。')}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">
              申し込む
            </a>
          ) : (
            e.reservation &&
            LINE_URL && (
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">
                LINE で申し込む
              </a>
            )
          )}
          <button type="button" onClick={() => downloadIcs(e, d)} className="btn-secondary">
            カレンダーに追加
          </button>
        </div>
      </div>
    </div>
  );
}
