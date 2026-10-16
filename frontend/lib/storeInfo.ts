// 架空の道の駅「Lumina 湊町」のデータ。営業時間・店舗・旬・イベント・お知らせ・交通などはすべてここで管理する。
// 住所・電話番号・地名・店名はすべて実在しない架空のもの。

import type { PhotoKey } from '@/lib/photos';

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
  | 'locker'
  | 'fish'
  | 'bread'
  | 'craft'
  | 'bowl'
  | 'icecream'
  | 'grill'
  | 'footbath'
  | 'bike'
  | 'workshop'
  | 'bus'
  | 'deck'
  | 'aed'
  | 'shield'
  | 'leaf'
  | 'megaphone'
  | 'rest';

// ---------- 基本情報 ----------

export type DayHours = { open: string; close: string } | null; // null = 営業なし

export const STORE = {
  name: 'Lumina 湊町',
  catchcopy: '海と街のあいだにある、みんなの寄り道。',
  address: '〒000-0000 架空県湊町港通り1-1',
  tel: '0000-00-0000',
  telNote: '受付 9:00〜18:00',
  email: 'info@lumina.example',
  // 全館休業日（24時間施設を除く）
  closedDates: ['2026-12-31', '2027-01-01'],
  // 全館の短縮営業日。各店舗の営業時間をこの範囲に収める
  specialHours: {
    '2027-01-02': { open: '10:00', close: '18:00' },
    '2027-01-03': { open: '10:00', close: '18:00' },
  } as Record<string, { open: string; close: string }>,
  parking: { cars: 128, large: 12, ev: 6, accessible: 4, temporary: 220, fee: '無料（24時間利用可）' },
};

// ---------- 店舗・施設 ----------

export type Schedule = { weekday: DayHours; holiday: DayHours } | '24h';
// 定休日。nth を省略すると毎週。祝日に当たる場合はその翌日（平日）が休み。
export type Closure = { weekday: number; nth?: number[] };
export type ShopKind = 'buy' | 'eat' | 'play' | 'service';

export const KINDS: Record<ShopKind, { label: string; color: string }> = {
  buy: { label: '買う', color: '#0071e3' },
  eat: { label: '食べる', color: '#e8590c' },
  play: { label: '遊ぶ・体験', color: '#1a7f37' },
  service: { label: 'サービス', color: '#6e6e73' },
};

export type MenuItem = { name: string; price: number; note?: string; months?: number[] };

export type Shop = {
  id: string;
  no: number;
  name: string;
  kind: ShopKind;
  icon: IconName;
  area: string;
  schedule: Schedule;
  closure?: Closure;
  lastOrder?: number; // 閉店の何分前がラストオーダーか
  note?: string;
  lead: string;
  desc: string;
  photo?: PhotoKey;
  menu?: MenuItem[];
  pos: { x: number; y: number }; // 園内マップ上の位置（1000×640）
};

const H = (open: string, close: string): DayHours => ({ open, close });

export const SHOPS: Shop[] = [
  {
    id: 'lumina-store',
    no: 1,
    name: 'Lumina Store',
    kind: 'buy',
    icon: 'store',
    area: '物産館 1F',
    schedule: { weekday: H('10:00', '20:00'), holiday: H('09:00', '20:00') },
    lead: '最新の Lumina を、手に取って。',
    desc: 'すべての製品を実際に試せる直営ストア。購入・下取り・初期設定のお手伝いまで。',
    pos: { x: 448, y: 238 },
  },
  {
    id: 'marche',
    no: 2,
    name: '湊町マルシェ',
    kind: 'buy',
    icon: 'market',
    area: '物産館 1F',
    schedule: { weekday: H('09:00', '17:00'), holiday: H('08:30', '17:00') },
    closure: { weekday: 2, nth: [3] },
    lead: '朝どれ野菜と、旬の果物。',
    desc: '町内の約 180 軒の農家が毎朝持ち込む直売所。生産者の名前入りで並びます。',
    photo: 'vegetableStand',
    pos: { x: 528, y: 238 },
  },
  {
    id: 'fish',
    no: 3,
    name: '浜の台所',
    kind: 'buy',
    icon: 'fish',
    area: '物産館 1F',
    schedule: { weekday: H('09:00', '17:00'), holiday: H('08:00', '17:00') },
    closure: { weekday: 2 },
    lead: '今朝、港に揚がった魚を。',
    desc: '湊町漁港の朝の競りで仕入れる鮮魚店。下処理・三枚おろしは無料で承ります。',
    photo: 'fishCounter',
    pos: { x: 608, y: 238 },
  },
  {
    id: 'gallery',
    no: 4,
    name: '器と手仕事',
    kind: 'buy',
    icon: 'craft',
    area: '物産館 2F',
    schedule: { weekday: H('10:00', '17:00'), holiday: H('10:00', '17:00') },
    closure: { weekday: 3 },
    lead: '港町の作家がつくる、毎日の道具。',
    desc: '地元の窯元や木工作家の器、藍染め、干物用の竹ざるまで。',
    photo: 'pottery',
    pos: { x: 608, y: 318 },
  },
  {
    id: 'shiosai',
    no: 5,
    name: '海鮮食堂 潮騒',
    kind: 'eat',
    icon: 'bowl',
    area: '食堂棟 1F',
    schedule: { weekday: H('11:00', '15:00'), holiday: H('10:30', '16:00') },
    closure: { weekday: 3 },
    lastOrder: 30,
    lead: '港の朝獲れを、丼いっぱいに。',
    desc: '浜の台所から直送の魚介を使う食堂。休日は開店前から行列ができます。',
    photo: 'kaisendon',
    menu: [
      { name: '潮騒丼（ウニ・イクラ・カニ）', price: 2980, note: '1日20食' },
      { name: '港の海鮮丼', price: 1800 },
      { name: '漁師の天ぷら定食', price: 1450 },
      { name: 'サーモンといくらの親子丼', price: 1650 },
    ],
    pos: { x: 712, y: 196 },
  },
  {
    id: 'hamayaki',
    no: 6,
    name: '浜焼き屋台',
    kind: 'eat',
    icon: 'grill',
    area: '屋外広場',
    schedule: { weekday: null, holiday: H('10:00', '15:00') },
    note: '土日祝のみ営業・雨天休業',
    lead: '炭火の香りと、潮風と。',
    desc: '広場の屋台で、殻付き牡蠣や鮎をその場で焼き上げます。',
    photo: 'grilledOysters',
    menu: [
      { name: '焼き牡蠣（3個）', price: 900, months: [11, 12, 1, 2, 3] },
      { name: '鮎の塩焼き', price: 600, months: [6, 7, 8, 9] },
      { name: '港の干物焼き', price: 700 },
      { name: 'イカの丸焼き', price: 650 },
    ],
    pos: { x: 560, y: 430 },
  },
  {
    id: 'cafe',
    no: 7,
    name: 'ハーバーカフェ',
    kind: 'eat',
    icon: 'cafe',
    area: '食堂棟 2F',
    schedule: { weekday: H('08:00', '19:00'), holiday: H('08:00', '19:00') },
    lastOrder: 30,
    lead: '海を眺める、いちばんの特等席。',
    desc: '全席オーシャンビュー。地元焙煎所の豆と、湊町の果物を使ったスイーツ。',
    photo: 'coffee',
    menu: [
      { name: '湊町ブレンド', price: 480 },
      { name: 'みかんのスカッシュ', price: 550 },
      { name: '季節のフルーツタルト', price: 620 },
    ],
    pos: { x: 772, y: 196 },
  },
  {
    id: 'softcream',
    no: 8,
    name: 'ソフトクリーム しおかぜ',
    kind: 'eat',
    icon: 'icecream',
    area: '食堂棟 1F',
    schedule: { weekday: H('10:00', '17:00'), holiday: H('09:30', '18:00') },
    lead: '道の駅に来たら、やっぱりこれ。',
    desc: '町内の牧場の生乳でつくる濃厚ソフト。ひとつまみの藻塩をかけた「塩バニラ」が名物。',
    photo: 'softServe',
    menu: [
      { name: '牧場ミルク', price: 400 },
      { name: '塩バニラ', price: 450 },
      { name: '抹茶ミックス', price: 450 },
    ],
    pos: { x: 712, y: 276 },
  },
  {
    id: 'bakery',
    no: 9,
    name: 'こむぎと港',
    kind: 'eat',
    icon: 'bread',
    area: '食堂棟 1F',
    schedule: { weekday: H('08:00', '16:00'), holiday: H('08:00', '16:00') },
    closure: { weekday: 1 },
    note: '売り切れ次第終了',
    lead: '朝 8 時、焼きたての香り。',
    desc: '地元産小麦と湊町の塩でつくるパン工房。しらすのフォカッチャが人気です。',
    photo: 'bread',
    pos: { x: 772, y: 276 },
  },
  {
    id: 'footbath',
    no: 10,
    name: '潮見の足湯',
    kind: 'play',
    icon: 'footbath',
    area: '展望デッキ横',
    schedule: { weekday: H('09:00', '18:00'), holiday: H('09:00', '18:00') },
    note: '無料・タオル販売あり（100円）',
    lead: '海を見ながら、ひと休み。',
    desc: '町の源泉を引いた無料の足湯。ドライブの疲れをほぐしてください。',
    photo: 'footBath',
    pos: { x: 860, y: 372 },
  },
  {
    id: 'cycle',
    no: 11,
    name: 'レンタサイクル',
    kind: 'play',
    icon: 'bike',
    area: 'エントランス',
    schedule: { weekday: H('09:00', '17:00'), holiday: H('09:00', '17:00') },
    note: '電動アシスト 2時間 1,000円・返却 17:30 まで',
    lead: '灯台まで、海沿いを走ろう。',
    desc: '灯台公園や朝市を巡る海沿いのサイクリングロードの起点。ヘルメット無料貸出。',
    photo: 'bicycle',
    pos: { x: 372, y: 418 },
  },
  {
    id: 'workshop',
    no: 12,
    name: '体験工房',
    kind: 'play',
    icon: 'workshop',
    area: '体験棟',
    schedule: { weekday: H('10:00', '16:00'), holiday: H('10:00', '16:00') },
    closure: { weekday: 3 },
    note: '要予約（空きがあれば当日可）',
    lead: '干物づくりも、器の絵付けも。',
    desc: '漁師に教わる干物づくり、地元の窯元と楽しむ絵付けなど、季節の体験を毎日開催。',
    photo: 'potteryColorful',
    pos: { x: 300, y: 214 },
  },
  {
    id: 'care',
    no: 13,
    name: 'Lumina Care',
    kind: 'service',
    icon: 'support',
    area: '物産館 1F',
    schedule: { weekday: H('10:00', '19:00'), holiday: H('10:00', '19:00') },
    note: '予約優先',
    lead: '修理も、データ移行も、ここで。',
    desc: '画面やバッテリーの交換、点検、機種変更時のデータ移行をお手伝いします。',
    pos: { x: 448, y: 318 },
  },
  {
    id: 'info',
    no: 14,
    name: '観光案内カウンター',
    kind: 'service',
    icon: 'info',
    area: '物産館 1F',
    schedule: { weekday: H('09:00', '18:00'), holiday: H('09:00', '18:00') },
    note: '道の駅スタンプはこちら',
    lead: '道路・観光・交通の案内所。',
    desc: '周辺の観光・宿泊・交通のご案内、道路情報の提供、道の駅スタンプの押印。',
    pos: { x: 528, y: 318 },
  },
];

// 24時間の施設・設備（地図と施設一覧に表示）
export type Amenity = { id: string; label: string; icon: IconName; hours: string; desc: string; map?: { x: number; y: number; label: string } };

export const AMENITIES: Amenity[] = [
  { id: 'wc', label: 'トイレ', icon: 'restroom', hours: '24時間', desc: '多目的トイレ・オストメイト・ベビーチェア完備。', map: { x: 236, y: 330, label: 'WC' } },
  { id: 'wc2', label: 'トイレ（展望デッキ）', icon: 'restroom', hours: '24時間', desc: '展望デッキ側にもトイレがあります。', map: { x: 760, y: 420, label: 'WC' } },
  { id: 'ev', label: 'EV 急速充電', icon: 'ev', hours: '24時間', desc: '急速充電器 6 基（CHAdeMO）。', map: { x: 330, y: 590, label: 'EV' } },
  { id: 'wifi', label: '無料 Wi-Fi', icon: 'wifi', hours: '24時間', desc: '館内・駐車場の一部（Lumina_Free）。' },
  { id: 'baby', label: 'ベビールーム', icon: 'baby', hours: '9:00〜20:00', desc: '授乳室 4 室、おむつ替え台、給湯器。' },
  { id: 'aed', label: 'AED', icon: 'aed', hours: '24時間', desc: '物産館入口とトイレ棟に設置。' },
  { id: 'locker', label: 'コインロッカー', icon: 'locker', hours: '8:00〜21:00', desc: '大型の荷物も入るロッカー 40 台。' },
  { id: 'wheelchair', label: '車いす貸出', icon: 'accessible', hours: '9:00〜18:00', desc: '観光案内カウンターで無料貸出（4 台）。' },
  { id: 'deck', label: '展望デッキ', icon: 'deck', hours: '24時間', desc: '港と灯台を一望。夕日の名所です。', map: { x: 900, y: 250, label: '展望デッキ' } },
  { id: 'bus', label: 'シャトルバス乗り場', icon: 'bus', hours: '運行時間内', desc: '湊町駅・臨時駐車場 P3 行きの無料シャトル。', map: { x: 404, y: 470, label: 'BUS' } },
];

// ---------- 旬カレンダー ----------

export type ProductCategory = '野菜・米' | '果物' | '水産' | '加工品';

export type Product = { name: string; category: ProductCategory; months: number[]; peak: number[]; note: string; photo?: PhotoKey };

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const PRODUCTS: Product[] = [
  { name: '新米（コシヒカリ）', category: '野菜・米', months: [9, 10, 11], peak: [10], note: '海風が育てる、甘みの強いお米', photo: 'riceField' },
  { name: 'さつまいも', category: '野菜・米', months: [9, 10, 11, 12, 1], peak: [10, 11], note: '砂地で育つ、ほくほくの紅あずま', photo: 'sweetPotato' },
  { name: 'きのこ', category: '野菜・米', months: [9, 10, 11, 12], peak: [10, 11], note: '山側の農家が原木で育てる椎茸' },
  { name: '大根', category: '野菜・米', months: [11, 12, 1, 2, 3], peak: [12, 1], note: '寒さで甘くなる冬の主役' },
  { name: '春キャベツ', category: '野菜・米', months: [3, 4, 5], peak: [4], note: 'やわらかく、生でもおいしい' },
  { name: 'トマト', category: '野菜・米', months: [5, 6, 7, 8, 9], peak: [7, 8], note: '完熟で収穫する、濃い味のトマト' },
  { name: 'みかん', category: '果物', months: [10, 11, 12, 1, 2], peak: [11, 12], note: '段々畑で育つ、湊町いちばんの名産', photo: 'mikanStand' },
  { name: '柿', category: '果物', months: [10, 11, 12], peak: [10, 11], note: '甘柿の富有柿と、干し柿用の渋柿', photo: 'persimmon' },
  { name: 'いちご', category: '果物', months: [12, 1, 2, 3, 4, 5], peak: [2, 3], note: 'ハウスで育つ大粒の紅ほっぺ' },
  { name: '梨', category: '果物', months: [8, 9, 10], peak: [9], note: 'みずみずしい幸水と豊水' },
  { name: '秋鮭', category: '水産', months: [9, 10, 11], peak: [10], note: '川を上る前の、脂ののった秋鮭' },
  { name: '戻りガツオ', category: '水産', months: [9, 10, 11], peak: [10], note: '脂がのった秋のカツオはたたきで' },
  { name: 'しらす', category: '水産', months: [3, 4, 5, 9, 10, 11], peak: [4, 10], note: '朝獲れの生しらすは数量限定' },
  { name: '牡蠣', category: '水産', months: [11, 12, 1, 2, 3], peak: [1, 2], note: '湾内で育つ、身の詰まった真牡蠣', photo: 'grilledOysters' },
  { name: '鮎', category: '水産', months: [6, 7, 8, 9], peak: [7, 8], note: '清流育ちの天然鮎', photo: 'ayu' },
  { name: '真鯛', category: '水産', months: [3, 4, 5], peak: [4], note: '春の産卵前の「桜鯛」' },
  { name: '干物', category: '加工品', months: ALL, peak: [11, 12, 1, 2], note: '港の天日干し。冬は北風でよく締まる', photo: 'saltedSalmon' },
  { name: '干し柿', category: '加工品', months: [11, 12, 1], peak: [12], note: '軒先で寒風にさらす冬の風物詩', photo: 'hoshigaki' },
];

// 入荷情報で使う定番品（季節を問わず並ぶもの）
export const SEAFOOD_STAPLES = ['真アジ', 'ゴマサバ', 'カマス', 'ヤリイカ', 'マダコ', 'ホウボウ', 'ヒラメ', 'サザエ', 'イサキ', 'メバル', 'カワハギ', 'ワラサ'];
export const PRODUCE_STAPLES = ['長ねぎ', 'ほうれん草', 'じゃがいも', '玉ねぎ', 'にんじん', '平飼い卵', '小松菜', 'しょうが'];
export const CRAFT_STAPLES = ['地酒「湊の灯」', '手づくり味噌', 'いかの塩辛', '藻塩', 'しらすのつくだ煮', '竹ざる'];
export const FLOWERS_BY_MONTH: Record<number, string[]> = {
  1: ['水仙', '葉牡丹'],
  2: ['菜の花', 'チューリップ'],
  3: ['チューリップ', 'スイートピー'],
  4: ['カーネーション', 'ラナンキュラス'],
  5: ['カーネーション', 'バラ'],
  6: ['あじさい', 'トルコキキョウ'],
  7: ['ひまわり', 'トルコキキョウ'],
  8: ['ひまわり', 'リンドウ'],
  9: ['コスモス', 'リンドウ'],
  10: ['コスモス', '小菊'],
  11: ['小菊', 'シクラメン'],
  12: ['シクラメン', '千両'],
};

// ---------- イベント ----------

export type EventCategory = 'session' | 'kids' | 'market' | 'support' | 'special';

export const EVENT_CATEGORIES: Record<EventCategory, { label: string; color: string }> = {
  session: { label: 'セッション', color: '#0071e3' },
  kids: { label: '体験・キッズ', color: '#a838d8' },
  market: { label: 'マルシェ', color: '#1a7f37' },
  support: { label: 'サポート', color: '#c93400' },
  special: { label: '特別イベント', color: '#e3004f' },
};

export type StoreEvent = {
  title: string;
  category: EventCategory;
  start: string;
  end: string;
  place: string;
  desc: string;
  reservation?: boolean;
  fee?: string;
};

export type EventRule = StoreEvent & { weekdays?: number[]; nthWeekday?: { n: number; weekday: number } };

export const EVENT_RULES: EventRule[] = [
  {
    title: 'はじめての Lumina Phone',
    category: 'session',
    weekdays: [1, 3, 5],
    start: '11:00',
    end: '11:45',
    place: 'フォーラム',
    desc: '基本操作から便利な設定まで。買い替えたばかりの方におすすめです。',
    reservation: true,
    fee: '無料',
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
    fee: '無料',
  },
  {
    title: '漁師に教わる 干物づくり体験',
    category: 'kids',
    weekdays: [0, 6],
    start: '10:30',
    end: '12:00',
    place: '体験工房',
    desc: 'アジを開いて、塩をして、天日に干すまで。できた干物はお持ち帰りいただけます。',
    reservation: true,
    fee: '1,500円',
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
    fee: '無料',
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
    place: 'Lumina Care',
    desc: 'お使いのデバイスのバッテリー状態を無料で点検します。予約不要。',
    fee: '無料',
  },
];

export const SPECIAL_EVENTS: (StoreEvent & { date: string })[] = [
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
    fee: '無料',
  },
  {
    date: '2026-11-23',
    title: '勤労感謝の日 下取り増額デー',
    category: 'special',
    start: '10:00',
    end: '20:00',
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

// ---------- お知らせ ----------

export type NewsCategory = 'お知らせ' | 'イベント' | '施設' | '商品' | '交通';

export type News = { date: string; category: NewsCategory; title: string; body: string; important?: boolean };

export const NEWS: News[] = [
  {
    date: '2026-10-15',
    category: 'イベント',
    title: '10月24日（土）「秋の収穫祭 × Lumina」を開催します',
    body: '新米の試食や港の海鮮焼きのほか、Lumina Phone で撮影した「湊町の秋」写真コンテストの表彰式を行います。当日は臨時駐車場（P3）からシャトルバスを 10 分間隔で運行します。',
  },
  {
    date: '2026-10-12',
    category: '交通',
    title: '港通り（町道1号線）の舗装工事に伴う通行規制のお知らせ',
    body: '10月20日〜11月7日の平日 9:00〜17:00、港通りの一部が片側交互通行になります。北側の臨港道路からのご来場をおすすめします。',
    important: true,
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
    title: '湊町マルシェに新米と早生みかんが並び始めました',
    body: '地元農家の新米（コシヒカリ）と、今季最初の早生みかんの販売を始めました。数量限定のため売り切れの際はご容赦ください。',
  },
  {
    date: '2026-09-25',
    category: 'お知らせ',
    title: '年末年始の営業について',
    body: '12月31日と1月1日は全館休業いたします。1月2日・3日は全店 10:00〜18:00 の短縮営業です。トイレ・EV 充電・駐車場は通常どおり 24 時間ご利用いただけます。',
    important: true,
  },
  {
    date: '2026-09-18',
    category: '施設',
    title: 'ベビールームをリニューアルしました',
    body: '授乳スペースを 2 室から 4 室に拡張し、給湯器と離乳食用の電子レンジを新設しました。',
  },
];

// ---------- 交通・駐車場 ----------

export type ShuttleRoute = {
  id: string;
  from: string;
  to: string;
  weekday: { first: string; last: string; every: number } | null;
  holiday: { first: string; last: string; every: number } | null;
};

// 湊町駅 ⇄ 道の駅のシャトルバス（無料）。土日祝は臨時駐車場（P3）からも運行。
export const SHUTTLE_ROUTES: ShuttleRoute[] = [
  { id: 'from-station', from: '湊町駅 東口', to: '道の駅', weekday: { first: '08:40', last: '19:40', every: 20 }, holiday: { first: '08:30', last: '19:45', every: 15 } },
  { id: 'to-station', from: '道の駅', to: '湊町駅 東口', weekday: { first: '09:00', last: '20:00', every: 20 }, holiday: { first: '08:45', last: '20:00', every: 15 } },
  { id: 'from-p3', from: '臨時駐車場 P3', to: '道の駅', weekday: null, holiday: { first: '09:00', last: '17:00', every: 10 } },
];

export const ACCESS: { mode: string; icon: IconName; lines: string[] }[] = [
  { mode: '車', icon: 'parking', lines: ['湊町IC から約 5 分', '港通りを海方向へ直進、灯台交差点を右折'] },
  { mode: '電車', icon: 'bus', lines: ['湊町駅 東口から無料シャトルバスで 9 分', '徒歩の場合は約 15 分'] },
  { mode: '路線バス', icon: 'bus', lines: ['「港通り」バス停下車 徒歩 1 分'] },
];

export const DRIVE_TIMES = [
  { from: '湊町IC', minutes: 5 },
  { from: '海浜中央IC', minutes: 18 },
  { from: '湊空港', minutes: 35 },
  { from: '青葉市 中心部', minutes: 50 },
];

// ---------- 周辺情報 ----------

export const NEARBY: { name: string; kind: string; distance: string; desc: string; photo: PhotoKey }[] = [
  { name: '湊町灯台公園', kind: '公園', distance: '自転車で 10 分', desc: '夜明けと夕暮れの灯台が美しい岬の公園。', photo: 'lighthouseDawn' },
  { name: '港の朝市', kind: 'グルメ', distance: '徒歩 5 分', desc: '毎朝 6 時から。獲れたての魚介をその場で味わえます。', photo: 'harbor' },
  { name: '海沿いサイクリングロード', kind: 'アクティビティ', distance: '道の駅が起点', desc: '灯台まで続く全長 12km の平坦な海沿いの道。', photo: 'bicycle' },
  { name: '黄金の田園', kind: '景観', distance: '車で 8 分', desc: '秋には一面が金色に。新米の産地を見渡す展望所。', photo: 'riceField' },
];

// ---------- 道の駅の機能 ----------

export const STATION_FUNCTIONS: { title: string; icon: IconName; lead: string; points: string[] }[] = [
  {
    title: '休憩',
    icon: 'rest',
    lead: '24時間、だれでも無料で。',
    points: ['駐車場 普通車 128 台・大型車 12 台', '24時間トイレ・ベビールーム', 'EV 急速充電 6 基'],
  },
  {
    title: '情報発信',
    icon: 'megaphone',
    lead: '道路と、まちの「いま」を。',
    points: ['道路・気象情報のデジタルサイネージ', '観光・宿泊・交通の案内', '道の駅スタンプ'],
  },
  {
    title: '地域連携',
    icon: 'leaf',
    lead: '生産者と旅人をつなぐ。',
    points: ['約 180 軒の農家・漁師が出荷', '体験工房と週末マルシェ', '町内を巡るレンタサイクル'],
  },
  {
    title: '防災',
    icon: 'shield',
    lead: 'もしものときの拠点に。',
    points: ['非常用発電で 72 時間給電', '飲料水・食料を 1,000 人 × 3 日分備蓄', '災害時は一時避難所として開放'],
  },
];

// ---------- よくある質問 ----------

export const FAQ = [
  { q: '駐車場は無料ですか？', a: 'はい、無料です。普通車 128 台・大型車 12 台を 24 時間ご利用いただけます。土日祝の混雑時は臨時駐車場（P3・220 台）と無料シャトルバスをご利用ください。' },
  { q: '混雑する時間帯は？', a: '土日祝の 11 時〜14 時が最も混み合います。このページの「混雑予想」で時間帯ごとの目安をご確認いただけます。午前 10 時前か 15 時以降がおすすめです。' },
  { q: '入荷情報はいつ更新されますか？', a: '毎朝 8 時 30 分ごろに更新します。漁や天候の状況によって、入荷が少ない日や遅れる日があります。' },
  { q: 'イベントや体験の予約は必要ですか？', a: '「要予約」と表示されたものは事前予約が必要です。空きがあれば当日参加も可能です。それ以外は予約不要です。' },
  { q: 'ペットを連れて入れますか？', a: '館内はお連れいただけませんが、屋外広場・展望デッキ・テラス席はリードを着用のうえご利用いただけます。' },
  { q: '使える支払い方法は？', a: '現金、各種クレジットカード、電子マネー、QR コード決済がご利用いただけます。浜焼き屋台とマルシェの一部は現金のみです。' },
  { q: '道の駅スタンプはどこで押せますか？', a: '物産館 1F の観光案内カウンター（9:00〜18:00）で押印できます。時間外は入口横のスタンプ台をご利用ください。' },
];
