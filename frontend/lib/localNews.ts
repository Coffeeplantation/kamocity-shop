// 新潟県・加茂市の地域情報（毎日 朝・昼・晩 に、定期実行のエージェントが data/local-news.json を更新する）。
// 更新ルールは data/LOCAL_NEWS_GUIDE.md を参照。

import data from '@/data/local-news.json';

export const NEWS_CATEGORIES = ['イベント', '季節', 'グルメ', '体験', '話題', '防災'] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type LocalNewsItem = {
  title: string;
  summary: string;
  category: NewsCategory;
  area: '加茂市' | '新潟県';
  date?: string; // 開催日など（YYYY-MM-DD）
  source: string;
  url: string;
};

export type LocalNews = { updatedAt: string; slot: '朝' | '昼' | '晩'; items: LocalNewsItem[] };

export const LOCAL_NEWS = data as LocalNews;

export const CATEGORY_COLOR: Record<NewsCategory, string> = {
  イベント: '#c4003f',
  季節: '#1a7f37',
  グルメ: '#a34700',
  体験: '#7a3ea8',
  話題: '#0066cc',
  防災: '#d70015',
};

export function formatUpdatedAt(iso: string) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  return parts;
}
