// 架空の店舗「Lumina 湊町」の情報。営業時間・施設・イベント・お知らせ・周辺情報・FAQ はすべてここで管理する。
// 住所・電話番号・地名は実在しない架空のもの。

export type Hours = { open: string; close: string } | '24h' | null; // null = 休業

export type Facility = {
  key: string;
  name: string;
  desc: string;
  hours: Hours | 'store'; // 'store' = 店舗の営業時間に従う
  icon: IconName;
};

export type IconName =
  | 'store'
  | 'support'
  | 'cafe'
  | 'market'
  | 'ev'
  | 'parking'
  | 'wifi'
  | 'restroom'
  | 'baby'
  | 'info'
  | 'accessible'
  | 'locker';

export const STORE = {
  name: 'Lumina 湊町',
  catchcopy: '海と街のあいだにある、みんなの寄り道。',
  address: '〒000-0000 架空県湊町港通り1-1',
  tel: '0000-00-0000',
  telNote: '受付 10:00〜18:00',
  // 曜日ごとの営業時間（0 = 日曜）
  hours: [
    { open: '09:00', close: '20:00' },
    { open: '10:00', close: '21:00' },
    { open: '10:00', close: '21:00' },
    { open: '10:00', close: '21:00' },
    { open: '10:00', close: '21:00' },
    { open: '10:00', close: '21:00' },
    { open: '09:00', close: '21:00' },
  ] as Hours[],
  // 臨時休業日（YYYY-MM-DD）
  closedDates: ['2026-12-31', '2027-01-01'],
  // 特別営業時間（YYYY-MM-DD → 時間）。店舗の営業時間に従う施設にも適用される
  specialHours: {
    '2027-01-02': { open: '10:00', close: '18:00' },
    '2027-01-03': { open: '10:00', close: '18:00' },
  } as Record<string, Hours>,
  parking: { cars: 128, large: 12, ev: 6, accessible: 4, fee: '無料（24時間利用可）' },
};

export const FACILITIES: Facility[] = [
  { key: 'store', name: 'Lumina Store', desc: '全製品を実際に手に取って試せます。購入・下取りもこちらで。', hours: 'store', icon: 'store' },
  { key: 'support', name: 'Lumina Care カウンター', desc: '修理・バッテリー交換・データ移行のご相談。予約優先。', hours: { open: '10:00', close: '19:00' }, icon: 'support' },
  { key: 'cafe', name: 'ハーバーカフェ', desc: '地元の焙煎所の豆と、湊町産のフルーツを使ったスイーツ。', hours: { open: '08:00', close: '20:00' }, icon: 'cafe' },
  { key: 'market', name: '湊町マルシェ（直売所）', desc: '朝どれ野菜、港の干物、地域の工芸品。生産者の顔が見える売場です。', hours: { open: '09:00', close: '17:00' }, icon: 'market' },
  { key: 'ev', name: 'EV 急速充電', desc: '急速充電器 6 基。どなたでもご利用いただけます。', hours: '24h', icon: 'ev' },
  { key: 'restroom', name: 'トイレ', desc: '24時間開放。多目的トイレ・オストメイト対応。', hours: '24h', icon: 'restroom' },
  { key: 'baby', name: 'ベビールーム', desc: '授乳室・おむつ替えシート・給湯器を備えています。', hours: { open: '09:00', close: '21:00' }, icon: 'baby' },
  { key: 'info', name: '観光案内カウンター', desc: '周辺の観光・交通案内、パンフレットの配布。', hours: { open: '09:00', close: '18:00' }, icon: 'info' },
  { key: 'wifi', name: '無料 Wi-Fi', desc: '館内・駐車場の一部で接続できます（Lumina_Free）。', hours: '24h', icon: 'wifi' },
  { key: 'locker', name: 'コインロッカー', desc: '大型の荷物も入るロッカーを 40 台ご用意。', hours: { open: '08:00', close: '21:00' }, icon: 'locker' },
];

export type EventCategory = 'session' | 'kids' | 'market' | 'support' | 'special';

export const EVENT_CATEGORIES: Record<EventCategory, { label: string; color: string }> = {
  session: { label: 'セッション', color: '#0071e3' },
  kids: { label: 'キッズ', color: '#bf5af2' },
  market: { label: 'マルシェ', color: '#34c759' },
  support: { label: 'サポート', color: '#ff9f0a' },
  special: { label: '特別イベント', color: '#ff375f' },
};

export type StoreEvent = {
  title: string;
  category: EventCategory;
  start: string;
  end: string;
  place: string;
  desc: string;
  reservation?: boolean;
};

type Rule = StoreEvent & { weekdays?: number[]; nthWeekday?: { n: number; weekday: number } };

// 毎週・毎月の定期イベント（どの月を表示してもカレンダーが埋まる）
const RULES: Rule[] = [
  {
    title: 'はじめての Lumina Phone',
    category: 'session',
    weekdays: [1, 3, 5],
    start: '11:00',
    end: '11:45',
    place: 'フォーラム',
    desc: '基本操作から便利な設定まで。買い替えたばかりの方におすすめです。',
    reservation: true,
  },
  {
    title: '写真ウォーク：湊町の光をとらえる',
    category: 'session',
    weekdays: [6],
    start: '10:00',
    end: '11:30',
    place: '店舗前広場 集合',
    desc: 'Lumina Phone のカメラで、港の朝の光を撮りに出かけます。',
    reservation: true,
  },
  {
    title: 'キッズ プログラミング',
    category: 'kids',
    weekdays: [0, 6],
    start: '13:00',
    end: '14:00',
    place: 'フォーラム',
    desc: '小学生向け。ロボットを動かしながら、プログラミングの考え方を学びます。',
    reservation: true,
  },
  {
    title: '週末マルシェ',
    category: 'market',
    weekdays: [0],
    start: '09:00',
    end: '15:00',
    place: '屋外広場',
    desc: '地元の農家・漁師・作家が集まる青空市。売り切れ次第終了です。',
  },
  {
    title: 'バッテリー無料点検デー',
    category: 'support',
    nthWeekday: { n: 2, weekday: 3 },
    start: '10:00',
    end: '18:00',
    place: 'Lumina Care カウンター',
    desc: 'お使いのデバイスのバッテリー状態を無料で点検します。予約不要。',
  },
];

// 日付指定の特別イベント
const SPECIALS: (StoreEvent & { date: string })[] = [
  {
    date: '2026-10-24',
    title: '秋の収穫祭 × Lumina',
    category: 'special',
    start: '09:00',
    end: '16:00',
    place: '屋外広場・館内全体',
    desc: '新米の試食、港の海鮮焼き、写真コンテストの表彰式。雨天決行。',
  },
  {
    date: '2026-11-03',
    title: '文化の日 ナイトフォト講座',
    category: 'special',
    start: '17:30',
    end: '19:00',
    place: '灯台公園 集合',
    desc: 'ナイトモードで灯台と星空を撮影します。三脚の貸し出しあり。',
    reservation: true,
  },
  {
    date: '2026-11-23',
    title: '勤労感謝の日 下取り増額デー',
    category: 'special',
    start: '10:00',
    end: '21:00',
    place: 'Lumina Store',
    desc: '対象デバイスの下取り額を 1 日限定で 10% 上乗せします。',
  },
  {
    date: '2026-12-19',
    title: 'ホリデー イルミネーション点灯式',
    category: 'special',
    start: '17:00',
    end: '18:00',
    place: '屋外広場',
    desc: '地元の高校吹奏楽部の演奏とともに、港のイルミネーションが灯ります。',
  },
];

export function ymd(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function eventsOn(y: number, m: number, d: number): StoreEvent[] {
  const date = new Date(y, m - 1, d);
  const wd = date.getDay();
  const nth = Math.ceil(d / 7);
  const key = ymd(y, m, d);
  if (STORE.closedDates.includes(key)) return [];
  const list: StoreEvent[] = [];
  for (const r of RULES) {
    if (r.weekdays?.includes(wd) || (r.nthWeekday && r.nthWeekday.weekday === wd && r.nthWeekday.n === nth)) list.push(r);
  }
  for (const s of SPECIALS) if (s.date === key) list.push(s);
  return list.sort((a, b) => a.start.localeCompare(b.start));
}

export type NewsCategory = 'お知らせ' | 'イベント' | '施設' | '商品' | '交通';

export type News = { date: string; category: NewsCategory; title: string; body: string };

export const NEWS: News[] = [
  {
    date: '2026-10-15',
    category: 'イベント',
    title: '10月24日（土）「秋の収穫祭 × Lumina」を開催します',
    body: '新米の試食や港の海鮮焼きのほか、Lumina Phone で撮影した「湊町の秋」写真コンテストの表彰式を行います。雨天決行、入場無料です。',
  },
  {
    date: '2026-10-12',
    category: '交通',
    title: '港通り（町道1号線）の舗装工事に伴う通行規制のお知らせ',
    body: '10月20日〜11月7日の平日 9:00〜17:00、港通りの一部が片側交互通行になります。北側の臨港道路からのご来店をおすすめします。',
  },
  {
    date: '2026-10-08',
    category: '施設',
    title: 'EV 急速充電器を 2 基増設し、6 基になりました',
    body: '駐車場東側に急速充電器を 2 基増設しました。24 時間どなたでもご利用いただけます。',
  },
  {
    date: '2026-10-01',
    category: '商品',
    title: '湊町マルシェに新米と秋の干物が入荷しました',
    body: '地元農家の新米（コシヒカリ）と、港で今朝揚がった魚の干物を販売中です。数量限定のため売り切れの際はご容赦ください。',
  },
  {
    date: '2026-09-25',
    category: 'お知らせ',
    title: '年末年始の営業時間について',
    body: '12月31日と1月1日は全館休業いたします。1月2日〜3日は 10:00〜18:00 の短縮営業です。トイレと EV 充電は通常どおり 24 時間ご利用いただけます。',
  },
  {
    date: '2026-09-18',
    category: '施設',
    title: 'ベビールームをリニューアルしました',
    body: '授乳スペースを 2 室から 4 室に拡張し、給湯器と離乳食用の電子レンジを新設しました。',
  },
];

export const NEARBY = [
  { name: '湊町灯台公園', kind: '公園', distance: '徒歩 8 分', desc: '夕日と灯台の景色が人気。夜はライトアップされます。', color: ['#ff9f0a', '#ff375f'] },
  { name: '港の朝市', kind: 'グルメ', distance: '徒歩 5 分', desc: '毎朝 6 時から。獲れたての魚介をその場で味わえます。', color: ['#30b0c7', '#0071e3'] },
  { name: '湊町市立美術館', kind: '文化', distance: '車で 6 分', desc: '港町の歴史と現代アートを展示。毎週月曜休館。', color: ['#bf5af2', '#5e5ce6'] },
  { name: '潮見の湯', kind: '温泉', distance: '車で 12 分', desc: '海を見下ろす露天風呂。ドライブの疲れを癒やして。', color: ['#34c759', '#30b0c7'] },
];

export const ACCESS = [
  { mode: '車', lines: ['湊町インターから約 5 分', '港通りを海方向へ直進、灯台交差点を右折'] },
  { mode: '電車', lines: ['湊町駅 東口から徒歩 12 分', '駅前から無料シャトルバスあり（20 分間隔）'] },
  { mode: 'バス', lines: ['「港通り」バス停下車 徒歩 1 分'] },
];

export const FAQ = [
  { q: '駐車場は無料ですか？', a: 'はい、無料です。普通車 128 台・大型車 12 台を 24 時間ご利用いただけます。' },
  { q: 'イベントの予約は必要ですか？', a: '「要予約」と表示されたイベントは事前予約が必要です。空きがあれば当日参加も可能です。それ以外は予約不要です。' },
  { q: '修理の持ち込みはできますか？', a: 'Lumina Care カウンターで受け付けています。予約優先のため、事前にご予約いただくと待ち時間が少なくなります。' },
  { q: 'ペットを連れて入れますか？', a: '館内はお連れいただけませんが、屋外広場とテラス席はリードを着用のうえご利用いただけます。' },
  { q: '使える支払い方法は？', a: '現金、各種クレジットカード、電子マネー、QR コード決済がご利用いただけます。マルシェの一部店舗は現金のみです。' },
  { q: '営業時間外でも利用できる施設は？', a: 'トイレ、EV 急速充電、駐車場、無料 Wi-Fi は 24 時間ご利用いただけます。' },
];
