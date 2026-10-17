// 新潟県加茂市の実在のローカル情報。2026年10月時点で、加茂市公式サイト・にいがた観光ナビなど公的な情報をもとにまとめた。
// 日程・時刻・営業情報は変わることがあるため、画面では必ず出典（公式ページ）へのリンクを添える。

import { holidayName, weekday, ymd, type YMD } from '@/lib/jpCalendar';

export const KAMO = {
  name: '加茂市',
  pref: '新潟県',
  lat: 37.666,
  lon: 139.04,
  cityHall: { name: '加茂市役所', address: '〒959-1392 新潟県加茂市幸町2-3-5', tel: '0256-52-0080' },
  station: 'JR信越本線 加茂駅',
};

export const SOURCES = {
  city: 'https://www.city.kamo.niigata.jp/',
  bus: 'https://www.city.kamo.niigata.jp/docs/66618.html',
  busPdf: 'https://www.city.kamo.niigata.jp/docs/56203.html',
  bijinnoyu: 'https://www.bijinnoyu.jp/',
  bijinnoyuAccess: 'https://www.bijinnoyu.jp/access/',
  kamoyama: 'https://www.city.kamo.niigata.jp/kankoubunka/shisetsu/kamoyama-park/',
  kankouKamoyama: 'https://niigata-kankou.or.jp/blog/detail_324.html',
  koinobori: 'https://niigata-kankou.or.jp/feature/carp_streamer',
  yukitsubaki: 'https://niigata-kankou.or.jp/event/detail_1914.html',
  hanabi: 'https://niigata-kankou.or.jp/event/detail_1917.html',
  gourmet: 'https://www.pref.niigata.lg.jp/site/miryokutankenki/kamojiru.html',
  zensaku: 'https://www.pref.niigata.lg.jp/site/miryokutankenki/zensaku-chaya.html',
  tansu: 'https://www.pref.niigata.lg.jp/sec/sanjou_kikaku/20230215-meister.html',
};

// ---------- かもんバス 七谷線（加茂駅前 ⇄ 美人の湯前） ----------
// 出典：加茂市公共交通時刻表 R8.6.1 改正版（加茂市 環境課）。weekdayOnly は「平日のみ運行」。

export type BusTrip = { no: number; from: string; to: string; weekdayOnly?: boolean };

export const BUS_TIMETABLE_REVISION = '令和8年6月1日改正';

// 加茂駅前 発 → 美人の湯前 着（七谷線 美人の湯方面行）
export const TO_BIJINNOYU: BusTrip[] = [
  { no: 1, from: '7:30', to: '7:47', weekdayOnly: true },
  { no: 2, from: '8:31', to: '8:48' },
  { no: 3, from: '9:39', to: '9:56' },
  { no: 4, from: '11:02', to: '11:19' },
  { no: 5, from: '11:52', to: '12:09' },
  { no: 6, from: '12:54', to: '13:11' },
  { no: 7, from: '13:41', to: '13:58' },
  { no: 8, from: '14:58', to: '15:15' },
  { no: 9, from: '15:35', to: '15:52' },
  { no: 10, from: '17:01', to: '17:18' },
  { no: 11, from: '17:43', to: '18:00' },
  { no: 12, from: '18:41', to: '18:58' },
];

// 美人の湯前 発 → 加茂駅前 着（七谷線 市役所方面行）
export const FROM_BIJINNOYU: BusTrip[] = [
  { no: 1, from: '6:41', to: '7:02', weekdayOnly: true },
  { no: 2, from: '7:09', to: '7:30', weekdayOnly: true },
  { no: 3, from: '9:30', to: '9:51' },
  { no: 4, from: '10:13', to: '10:34' },
  { no: 5, from: '11:40', to: '12:01' },
  { no: 6, from: '12:38', to: '12:59' },
  { no: 7, from: '13:33', to: '13:54' },
  { no: 8, from: '14:24', to: '14:45' },
  { no: 9, from: '15:56', to: '16:17' },
  { no: 10, from: '16:19', to: '16:40' },
  { no: 11, from: '17:37', to: '17:58' },
  { no: 12, from: '18:37', to: '18:58' },
  { no: 13, from: '19:29', to: '19:50' },
];

// 年末（12/31）は全便運休。年始（1/1〜3）は七谷線の 1・2・4・6・8・10・12 便が運休
const NEW_YEAR_CANCELLED = [1, 2, 4, 6, 8, 10, 12];

export const isKamoWeekday = (date: YMD) => {
  const wd = weekday(date);
  return wd !== 0 && wd !== 6 && holidayName(date) === null;
};

export function tripsOn(trips: BusTrip[], date: YMD): BusTrip[] {
  const key = ymd(date).slice(5);
  if (key === '12-31') return [];
  const newYear = key === '01-01' || key === '01-02' || key === '01-03';
  const weekdayOk = isKamoWeekday(date);
  return trips.filter((t) => (!t.weekdayOnly || weekdayOk) && !(newYear && NEW_YEAR_CANCELLED.includes(t.no)));
}

export function busNote(date: YMD): string | null {
  const key = ymd(date).slice(5);
  if (key === '12-31') return '12月31日は全便運休です。';
  if (key === '01-01' || key === '01-02' || key === '01-03') return '年始（1/1〜3）は一部の便が運休します。';
  if (!isKamoWeekday(date)) return '土日祝は平日のみの便が運休します。';
  return null;
}

// ---------- 年間行事 ----------

export type KamoEvent = {
  title: string;
  months: number[]; // 開催・見頃の月
  when: string; // 時期の表記
  place: string;
  desc: string;
  date2026?: { start: string; end: string }; // 2026 年の公表日程（分かっているもののみ）
  source: string;
};

export const KAMO_EVENTS: KamoEvent[] = [
  {
    title: '雪椿まつり',
    months: [4],
    when: '例年 4月上旬〜中旬',
    place: '加茂山公園ほか',
    desc: '雪椿の群生地・加茂山公園で開かれる春の祭り。2026年で第60回。',
    date2026: { start: '2026-04-04', end: '2026-04-19' },
    source: SOURCES.yukitsubaki,
  },
  {
    title: '加茂川を泳ぐ鯉のぼり',
    months: [4, 5],
    when: '例年 4月〜5月',
    place: '加茂川',
    desc: '加茂川の上空に、およそ 500 匹の鯉のぼりが泳ぐ春の風物詩。河川敷から間近に見られる。',
    date2026: { start: '2026-04-24', end: '2026-05-26' },
    source: SOURCES.koinobori,
  },
  {
    title: '青海神社 春季祭礼（加茂まつり）',
    months: [5],
    when: '毎年 5月21日を中心に',
    place: '青海神社・市街地',
    desc: '三社の神輿による御神幸行列が町を練り歩く。前宵祭・大祭・太々神楽の 3 日間。',
    source: SOURCES.city,
  },
  {
    title: '越後加茂川夏祭り 大花火大会',
    months: [8],
    when: '例年 8月中旬',
    place: '加茂川河川敷',
    desc: '約 1,000 発。中州からの噴水花火、二尺玉、橋を縦断する大ナイアガラが名物。',
    date2026: { start: '2026-08-14', end: '2026-08-14' },
    source: SOURCES.hanabi,
  },
  {
    title: '青海神社 秋季例大祭',
    months: [8, 9],
    when: '例年 8月31日〜9月2日',
    place: '青海神社周辺',
    desc: '祭礼露店と奉納花火（20:00〜20:30）。最終日は太々神楽。',
    date2026: { start: '2026-08-31', end: '2026-09-02' },
    source: SOURCES.city,
  },
  {
    title: '加茂山公園の紅葉',
    months: [10, 11],
    when: '例年 10月下旬〜11月',
    place: '加茂山公園（モミジ谷・彫刻の森）',
    desc: '赤いじゅうたんのようなモミジ谷と、紅葉の中に彫刻が並ぶ坂道。散策は 1 時間ほど。',
    source: SOURCES.kankouKamoyama,
  },
  {
    title: '加茂山リス園・甘味処「椿の家」',
    months: [4, 5, 6, 7, 8, 9, 10, 11],
    when: '例年 4月〜11月',
    place: '加茂山公園',
    desc: 'シマリスに会えるリス園と、名物「こりすまんじゅう」の甘味処（4月〜11月末・不定休）。',
    source: SOURCES.kankouKamoyama,
  },
  {
    title: '冬鳥越スキーガーデン',
    months: [12, 1, 2, 3],
    when: '冬季（積雪状況による）',
    place: '冬鳥越',
    desc: '県央地域で唯一のスキー場。初心者向けゲレンデと、全長 50m のそり専用コース。',
    source: 'https://www.pref.niigata.lg.jp/sec/sanjou_kikaku/kikakukennoutopikkusu202201.html',
  },
];

// ---------- 見どころ ----------

export type KamoSpot = { name: string; kind: string; desc: string; points: string[]; access?: string; source: string };

export const KAMO_SPOTS: KamoSpot[] = [
  {
    name: '加茂山公園',
    kind: '公園',
    desc: '市街地にありながら、噴水の音と野鳥の声だけが聞こえる静かな公園。',
    points: ['加茂山リス園（シマリス）', 'モミジ谷・彫刻の森（16 点の彫刻）', '小林幸子「雪椿」の歌碑', '加茂市民俗資料館'],
    access: '加茂駅から徒歩 5 分',
    source: SOURCES.kankouKamoyama,
  },
  {
    name: '加茂七谷温泉 美人の湯',
    kind: '日帰り温泉',
    desc: '粟ヶ岳のふもとの日帰り温泉。地元の野菜を使った食事処もある。2021年4月にリニューアル。',
    points: ['定休日：毎月 第2・第4 水曜', 'かもんバス 七谷線「美人の湯前」下車すぐ', '料金・営業時間は公式サイトで確認'],
    access: '加茂駅前からバスで約 17 分',
    source: SOURCES.bijinnoyu,
  },
  {
    name: '青海神社',
    kind: '神社',
    desc: '加茂山公園のそばにある神社。春の加茂まつりと、秋の例大祭の舞台。',
    points: ['春季祭礼（5月21日中心）', '秋季例大祭・奉納花火（8月末〜9月初め）'],
    access: '加茂山公園のすぐ近く',
    source: SOURCES.city,
  },
  {
    name: '加茂川',
    kind: '景観',
    desc: '町の真ん中を流れる川。春は鯉のぼり、夏は大花火大会の会場になる。',
    points: ['鯉のぼり 約 500 匹（春）', '大花火大会・大ナイアガラ（夏）'],
    source: SOURCES.koinobori,
  },
  {
    name: '善作茶屋',
    kind: '甘味・茶屋',
    desc: '明治初期創業、加茂市黒水の茶屋。清水で冷やした「ところてん」を酢醤油で。',
    points: ['看板はところてん', '駄菓子・ラムネも'],
    access: 'かもんバス 七谷線「善作前」',
    source: SOURCES.zensaku,
  },
  {
    name: '冬鳥越スキーガーデン',
    kind: 'スキー・そり',
    desc: '県央地域で唯一のスキー場。市指定文化財の木造電車「モハ1」も見どころ。',
    points: ['ファミリーゲレンデ', 'そり専用コース 50m', '県内最古の木造電車「モハ1」'],
    source: 'https://www.pref.niigata.lg.jp/sec/sanjou_kikaku/kikakukennoutopikkusu202201.html',
  },
];

// ---------- 名物・おみやげ ----------

export const KAMO_MEIBUTSU: { name: string; kind: string; desc: string; source: string }[] = [
  { name: '加茂桐箪笥', kind: '伝統的工芸品', desc: '約 220 年受け継がれてきた技。材料選びから仕上げまで約 80 の工程を一貫して手がける職人もいる。', source: SOURCES.tansu },
  { name: '加茂紙', kind: '和紙', desc: '商店街の中に紙漉き場がある、加茂の手すき和紙。はがきなどのおみやげにも。', source: SOURCES.gourmet },
  { name: 'こりすまんじゅう', kind: '和菓子', desc: '加茂山公園の甘味処「椿の家」の名物。リス園のおともに。', source: SOURCES.kankouKamoyama },
  { name: 'チョコまん・かりん糖', kind: 'おやつ', desc: '地元で親しまれている加茂のおやつ。駅近くのおみやげ店でも。', source: SOURCES.gourmet },
  { name: 'ところてん', kind: '甘味', desc: '善作茶屋の看板。清水で冷やして、酢醤油でいただく。', source: SOURCES.zensaku },
];

// ---------- 豆知識 ----------

export const KAMO_TRIVIA: { title: string; body: string }[] = [
  { title: '990万年前の魚', body: '七谷地区で見つかった「カモナナタニムカシイトヨ」の化石が、加茂市民俗資料館に展示されています。' },
  { title: '鯉のぼり 500 匹', body: '春の加茂川には、およそ 500 匹の鯉のぼりが一斉に泳ぎます。' },
  { title: '桐たんすのまち', body: '加茂は日本有数の桐たんすの産地。加茂桐箪笥は国の伝統的工芸品です。' },
  { title: '「雪椿」の歌碑', body: '加茂山公園には、雪椿の群生地にちなんで小林幸子さんの「雪椿」の歌碑があります。' },
];
