// Slack に投稿された「イベント」のメッセージを読み取り、道の駅のイベントとして扱える形にする。
// サーバー・ブラウザのどちらでも使える（Slack への通信はしない）。
//
// 書き方（1 行目に【イベント】とタイトル。日付・時間・場所は必須、ほかは省略可）：
//
//   【イベント】秋の収穫祭
//   日付：10/24
//   時間：9:00〜16:00
//   場所：屋外広場
//   内容：新米の試食と、桐の小物づくり。
//   種類：マルシェ        … セッション / 体験 / マルシェ / サポート / 特別（省略すると「特別イベント」）
//   予約：要              … 「要」または「必要」で要予約
//   料金：500円

import { ymd, type YMD } from '@/lib/jpCalendar';
import type { EventCategory, StoreEvent } from '@/lib/storeInfo';

export type PostedEvent = StoreEvent & { date: string; posted: true };

export const EVENT_POST_TEMPLATE = ['【イベント】タイトル', '日付：10/24', '時間：9:00〜16:00', '場所：屋外広場', '内容：説明（省略可）', '種類：マルシェ（省略可）', '予約：要（省略可）', '料金：無料（省略可）'].join('\n');

const CATEGORY_WORDS: [RegExp, EventCategory][] = [
  [/セッション|講座|教室/, 'session'],
  [/体験|キッズ|子ども|こども|ワークショップ/, 'kids'],
  [/マルシェ|市|即売/, 'market'],
  [/サポート|点検|相談/, 'support'],
];

// 全角の数字・記号を半角に
const half = (s: string) =>
  s.replace(/[０-９：／－]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[〜～―ー−]/g, '-');

function field(lines: string[], ...names: string[]) {
  for (const l of lines) {
    const m = l.match(/^\s*[*_]?([^：:]{1,6})[*_]?\s*[：:]\s*(.+)$/);
    if (m && names.includes(m[1].trim())) return m[2].trim();
  }
  return '';
}

// 「10/24」「10月24日」「2026-10-24」「2026/10/24」。年がなければ投稿日から見て次に来る日付にする
export function parsePostDate(raw: string, postedAt: YMD): YMD | null {
  const s = half(raw);
  let m = s.match(/(\d{4})\s*[-/年]\s*(\d{1,2})\s*[-/月]\s*(\d{1,2})/);
  if (m) return valid({ y: +m[1], m: +m[2], d: +m[3] });
  m = s.match(/(\d{1,2})\s*[/月]\s*(\d{1,2})/);
  if (!m) return null;
  const date = { y: postedAt.y, m: +m[1], d: +m[2] };
  // 投稿日より 2 か月以上前なら、翌年のこと（12 月に「1/10」と書いた場合など）
  if (date.m * 100 + date.d < (postedAt.m - 2) * 100 + postedAt.d) date.y += 1;
  return valid(date);
}

function valid(date: YMD): YMD | null {
  const t = new Date(Date.UTC(date.y, date.m - 1, date.d));
  return t.getUTCMonth() === date.m - 1 && t.getUTCDate() === date.d ? date : null;
}

// 「9:00〜16:00」「9時〜16時30分」
function parseTimes(raw: string): { start: string; end: string } | null {
  const s = half(raw).replace(/(\d{1,2})時(\d{1,2})分?/g, '$1:$2').replace(/(\d{1,2})時/g, '$1:00');
  const m = s.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const t = (h: string, mm: string) => `${h.padStart(2, '0')}:${mm}`;
  const start = t(m[1], m[2]);
  const end = t(m[3], m[4]);
  return start < end && +m[1] < 24 && +m[3] <= 24 ? { start, end } : null;
}

export function parseEventPost(text: string, postedAt: YMD): PostedEvent | null {
  // Slack の書式（<URL|表示名>・太字など）を外す
  const plain = text
    .replace(/<([^|>]+)\|([^>]+)>/g, '$2')
    .replace(/<([^>]+)>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  const lines = plain.split('\n').map((l) => l.trim()).filter(Boolean);
  const head = lines[0]?.match(/^[*_]?【\s*イベント\s*】\s*(.+?)[*_]?$/);
  if (!head) return null;

  const date = parsePostDate(field(lines, '日付', '日にち', '開催日'), postedAt);
  const times = parseTimes(field(lines, '時間', '時刻'));
  const place = field(lines, '場所', '会場');
  if (!date || !times || !place) return null;

  const kind = field(lines, '種類', '分類');
  const category = kind.includes('特別') ? 'special' : (CATEGORY_WORDS.find(([re]) => re.test(kind))?.[1] ?? 'special');
  const r = field(lines, '予約');
  const reservation = /^(要|必要|あり)/.test(r) && !/不要|なし/.test(r);
  const fee = field(lines, '料金', '参加費') || undefined;

  return {
    title: head[1].slice(0, 60),
    date: ymd(date),
    ...times,
    place: place.slice(0, 40),
    desc: field(lines, '内容', '説明', '詳細').slice(0, 200),
    category,
    reservation,
    fee,
    posted: true,
  };
}
