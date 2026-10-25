// 検索エンジン向けの構造化データ（schema.org）。Google の検索結果に「イベント」として出やすくなる。

import { eventsOn } from '@/lib/events';
import { addDays, tokyoNow, ymd } from '@/lib/jpCalendar';
import type { PostedEvent } from '@/lib/slack/eventPost';
import { STORE } from '@/lib/storeInfo';

// この先 60 日のイベント（道の駅のイベントと、Slack・LINE に投稿されたもの）。同じ内容の定例は最初の 30 件まで
export function eventsJsonLd(posted: PostedEvent[]): string {
  const today = tokyoNow().date;
  const site = process.env.SITE_URL || 'http://localhost:3000';
  const list = Array.from({ length: 60 }, (_, i) => addDays(today, i))
    .flatMap((d) =>
      eventsOn(d, posted).map((e) => ({
        '@type': 'Event',
        name: e.title,
        startDate: `${ymd(d)}T${e.start}:00+09:00`,
        endDate: `${ymd(d)}T${e.end}:00+09:00`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        description: e.desc || undefined,
        location: { '@type': 'Place', name: `${STORE.name} ${e.place}`, address: { '@type': 'PostalAddress', addressRegion: '新潟県', addressLocality: '加茂市', addressCountry: 'JP' } },
        organizer: { '@type': 'Organization', name: `道の駅 ${STORE.name}`, url: `${site}/stores` },
        offers: e.fee ? { '@type': 'Offer', price: e.fee.replace(/[^\d]/g, '') || '0', priceCurrency: 'JPY', url: `${site}/stores#events` } : undefined,
      })),
    )
    .slice(0, 30);
  // </script> などで外に抜け出せないよう、< を Unicode エスケープする
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': list }).replace(/</g, '\\u003c');
}
