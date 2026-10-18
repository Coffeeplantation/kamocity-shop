// 加茂市・新潟のニュースを、各社が公開している RSS から取得する（サーバー側で実行する）。
// 見出し・配信元・日時・リンクだけを使い、本文は転載しない。
//
// 配信元ごとの利用条件にあわせて、表示先を分けている。
//   site  … サイトに掲載してよいもの（加茂市の公式 RSS、Google ニュース ※Google ニュースと各配信元の表記が必要）
//   slack … 個人の Slack 通知（RSS リーダー的な個人利用）だけで使うもの
//           Bing ニュースは「個人的・非商業的な RSS アグリゲーターでの表示」以外の利用を禁じているため、サイトには載せない。
//           Yahoo!ニュースの RSS も、サイト掲載の条件を確認できていないため Slack のみ。

export type NewsItem = { title: string; link: string; publisher: string; date: string | null };
export type FeedId = 'city' | 'googleKamo' | 'googleNiigata' | 'yahooNiigata' | 'bingKamo';
export type Feed = {
  id: FeedId;
  label: string;
  credit: string; // 画面・通知に出す出典表記
  home: string; // 出典のリンク先
  url: string;
  use: 'site' | 'slack';
  keep?: RegExp; // この語を含む見出しだけ残す
  drop?: RegExp; // この語を含む見出しは除く（同名の他地域など）
};

const google = (q: string) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ja&gl=JP&ceid=JP:ja`;

// 岐阜県の「美濃加茂市」が「加茂市」の検索に混ざるので除く
const OTHER_KAMO = /美濃加茂|岐阜/;

export const FEEDS: Feed[] = [
  {
    id: 'city',
    label: '加茂市からのお知らせ',
    credit: '新潟県加茂市 新着情報',
    home: 'https://www.city.kamo.niigata.jp/whats_new/',
    url: 'https://www.city.kamo.niigata.jp/whats_new/rss.xml',
    use: 'site',
  },
  {
    id: 'googleKamo',
    label: '加茂市のニュース',
    credit: 'Google ニュース「加茂市 新潟」',
    home: google('加茂市 新潟 -美濃加茂').replace('/rss/', '/'),
    url: google('加茂市 新潟 -美濃加茂'),
    use: 'site',
    drop: OTHER_KAMO,
  },
  {
    id: 'googleNiigata',
    label: '新潟県のニュース',
    credit: 'Google ニュース「新潟県」',
    home: google('新潟県').replace('/rss/', '/'),
    url: google('新潟県'),
    use: 'site',
  },
  {
    id: 'yahooNiigata',
    label: 'Yahoo!ニュース（新潟）',
    credit: 'Yahoo!ニュース 地域',
    home: 'https://news.yahoo.co.jp/categories/local',
    url: 'https://news.yahoo.co.jp/rss/categories/local.xml',
    use: 'slack',
    keep: /新潟|加茂/,
  },
  {
    id: 'bingKamo',
    label: 'Bing ニュース（加茂市）',
    credit: 'Bing ニュース「加茂市」（Microsoft）',
    home: 'https://www.bing.com/news/search?q=%E5%8A%A0%E8%8C%82%E5%B8%82',
    url: 'https://www.bing.com/news/search?q=%E5%8A%A0%E8%8C%82%E5%B8%82&format=rss',
    use: 'slack',
    drop: OTHER_KAMO,
  },
];

// 1日3回（朝・昼・夕）の更新にあわせて、取得結果は最大 8 時間使い回す。cron が来たら 'news' タグで取り直す
export const NEWS_REVALIDATE = 8 * 60 * 60;

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, '')
    .trim();
}

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
};

// Bing のリンクはクリック計測用の URL なので、元記事の URL を取り出す
function unwrapLink(link: string) {
  try {
    const u = new URL(link);
    if (u.hostname.endsWith('bing.com') && u.searchParams.get('url')) return u.searchParams.get('url')!;
  } catch {
    // そのまま使う
  }
  return link;
}

function parseItem(xml: string, feed: Feed): NewsItem | null {
  let title = tag(xml, 'title');
  const link = unwrapLink(tag(xml, 'link'));
  if (!title || !link.startsWith('http')) return null;

  // 配信元：Google は <source>、Yahoo・Bing は見出し末尾の（配信元）や <News:Source>
  let publisher = tag(xml, 'source') || tag(xml, 'News:Source');
  if (feed.id.startsWith('google') && publisher && title.endsWith(` - ${publisher}`)) title = title.slice(0, -(publisher.length + 3));
  if (feed.id === 'yahooNiigata') {
    const m = title.match(/^(.*)（([^（）]+)）$/) ?? title.match(/^(.*)\(([^()]+)\)$/);
    if (m) [title, publisher] = [m[1].trim(), m[2]];
  }
  if (feed.id === 'city') publisher = '加茂市';

  const raw = tag(xml, 'pubDate') || tag(xml, 'dc:date');
  const t = raw ? new Date(raw) : null;
  return { title, link, publisher: publisher || feed.credit, date: t && !Number.isNaN(t.getTime()) ? t.toISOString() : null };
}

export async function fetchFeed(feed: Feed, limit = 6): Promise<NewsItem[]> {
  const res = await fetch(feed.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LuminaKamoNews/1.0)' },
    next: { revalidate: NEWS_REVALIDATE, tags: ['news'] },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${feed.id}: HTTP ${res.status}`);
  const xml = await res.text();
  const seen = new Set<string>();
  const items: NewsItem[] = [];
  for (const block of xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? []) {
    const item = parseItem(block, feed);
    if (!item || seen.has(item.title)) continue;
    if (feed.keep && !feed.keep.test(item.title)) continue;
    if (feed.drop && feed.drop.test(item.title)) continue;
    seen.add(item.title);
    items.push(item);
  }
  return items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, limit);
}

export type FeedResult = { feed: Feed; items: NewsItem[]; ok: boolean };

// 1 つの配信元が落ちていても、ほかは表示する
export async function fetchNews(use: 'site' | 'all', limit = 6): Promise<FeedResult[]> {
  const feeds = FEEDS.filter((f) => use === 'all' || f.use === 'site');
  return Promise.all(
    feeds.map((feed) =>
      fetchFeed(feed, limit)
        .then((items) => ({ feed, items, ok: true }))
        .catch(() => ({ feed, items: [], ok: false })),
    ),
  );
}

// 「10月18日 9:05」の形（日本時間）
export function newsTime(iso: string | null) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}
