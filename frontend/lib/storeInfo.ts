// 架空の道の駅「Lumina 加茂」のデータ。営業時間・店舗・旬・イベント・お知らせ・交通などはすべてここで管理する。
// 新潟県加茂市に道の駅は実在しない（2026年10月時点）。施設・店名・電話番号・シャトルバスは架空のもの。
// 一方、加茂市の特産・名所・季節の情報は、加茂市・新潟県・にいがた観光ナビなどの公開情報にもとづく（lib/kamo.ts も参照）。
//   果物の時期：加茂市のふるさと納税「令和8年産フルーツ特集」の発送時期（桃 7〜8月、和梨 8月中旬〜12月、ル レクチエ 11月下旬〜12月中旬）
//   特産：桐箪笥・加茂建具・加茂紙・加茂縞・岳炭、モモ・ナシ・ル レクチエ。地酒は市内 3 蔵（マスカガミ・加茂錦・雪椿）

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
  name: 'Lumina 加茂',
  kind: '道の駅（架空）',
  catchcopy: '雪椿と桐のまちの、みんなの寄り道。',
  address: '新潟県加茂市（架空の施設のため、所在地はありません）',
  tel: '0000-00-0000',
  telNote: '受付 9:00〜18:00（架空の番号です）',
  email: 'info@lumina.example',
  // 全館休業日（24時間施設を除く）
  closedDates: ['2026-12-31', '2027-01-01'],
  // 全館の短縮営業日。各店舗の営業時間をこの範囲に収める
  specialHours: {
    '2027-01-02': { open: '10:00', close: '17:00' },
    '2027-01-03': { open: '10:00', close: '17:00' },
  } as Record<string, { open: string; close: string }>,
  parking: { cars: 140, large: 10, ev: 4, accessible: 4, temporary: 180, fee: '無料（24時間利用可・冬期は除雪）' },
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
    schedule: { weekday: H('10:00', '19:00'), holiday: H('09:00', '19:00') },
    lead: '最新の Lumina を、手に取って。',
    desc: 'すべての製品を実際に試せる直営ストア。購入・下取り・初期設定のお手伝いまで。',
    pos: { x: 448, y: 238 },
  },
  {
    id: 'marche',
    no: 2,
    name: '朝どれ市 ななたに',
    kind: 'buy',
    icon: 'market',
    area: '物産館 1F',
    schedule: { weekday: H('09:00', '17:00'), holiday: H('08:30', '17:00') },
    closure: { weekday: 2, nth: [3] },
    lead: '朝どれ野菜と、加茂の果物。',
    desc: '市内の農家が毎朝持ち込む直売所。夏は桃と和梨、冬は洋梨ル レクチエが並びます。生産者の名前入り。',
    photo: 'vegetableStand',
    pos: { x: 528, y: 238 },
  },
  {
    id: 'kiri',
    no: 3,
    name: '桐と木工の店',
    kind: 'buy',
    icon: 'craft',
    area: '物産館 1F',
    schedule: { weekday: H('10:00', '17:00'), holiday: H('09:30', '17:00') },
    closure: { weekday: 3 },
    lead: '桐たんすのまちの、小さな桐。',
    desc: '加茂は国の伝統的工芸品「加茂桐箪笥」の産地。職人の技でつくる桐の小箱・米びつ・まな板や、加茂建具の木工小物を集めました。',
    pos: { x: 608, y: 238 },
  },
  {
    id: 'washi',
    no: 4,
    name: '紙と手しごと',
    kind: 'buy',
    icon: 'craft',
    area: '物産館 2F',
    schedule: { weekday: H('10:00', '17:00'), holiday: H('10:00', '17:00') },
    closure: { weekday: 3 },
    lead: '加茂紙と、加茂縞と、鯉のぼり。',
    desc: '手すき和紙「加茂紙」のはがきや便箋、加茂縞の布小物、加茂川の鯉のぼりにちなんだ雑貨。地酒と「かも汁」もこちら。',
    photo: 'pottery',
    pos: { x: 608, y: 318 },
  },
  {
    id: 'shokudo',
    no: 5,
    name: '食事処 あわがたけ',
    kind: 'eat',
    icon: 'bowl',
    area: '食堂棟 1F',
    schedule: { weekday: H('11:00', '15:00'), holiday: H('10:30', '16:00') },
    closure: { weekday: 3 },
    lastOrder: 30,
    lead: '新潟のふだんの味を、ていねいに。',
    desc: '七谷の新米と、新潟の郷土料理「のっぺ」が看板。春は山菜、秋はきのこの季節の膳も。',
    photo: 'tempuraSet',
    menu: [
      { name: 'のっぺ定食（七谷米ごはん付き）', price: 1200 },
      { name: '鮭の焼き漬け定食', price: 1350 },
      { name: '山菜そば', price: 950, months: [4, 5, 6] },
      { name: 'きのこの天ぷらそば', price: 1100, months: [9, 10, 11] },
    ],
    pos: { x: 712, y: 196 },
  },
  {
    id: 'sumibi',
    no: 6,
    name: '炭火焼き屋台',
    kind: 'eat',
    icon: 'grill',
    area: '屋外広場',
    schedule: { weekday: null, holiday: H('10:00', '15:00') },
    note: '土日祝のみ営業・雨天休業',
    lead: '加茂の炭で、じっくり焼く。',
    desc: '加茂の特産「岳炭（だけずみ）」を使った屋台。焼きおにぎりや季節の串を、その場で焼き上げます。',
    photo: 'ayu',
    menu: [
      { name: '七谷米の焼きおにぎり（2個）', price: 400 },
      { name: '鮎の塩焼き', price: 600, months: [6, 7, 8, 9] },
      { name: '焼きとうもろこし', price: 450, months: [7, 8, 9] },
      { name: '焼き鳥（3本）', price: 500 },
    ],
    pos: { x: 560, y: 430 },
  },
  {
    id: 'cafe',
    no: 7,
    name: 'カフェ 加茂川テラス',
    kind: 'eat',
    icon: 'cafe',
    area: '食堂棟 2F',
    schedule: { weekday: H('09:00', '18:00'), holiday: H('08:30', '18:00') },
    lastOrder: 30,
    lead: '粟ヶ岳をのぞむ、いちばんの特等席。',
    desc: '加茂の果物を主役にしたカフェ。夏は桃、秋は和梨、冬はル レクチエのスイーツを。',
    photo: 'coffee',
    menu: [
      { name: '加茂ブレンド', price: 480 },
      { name: '白桃のパフェ', price: 980, months: [7, 8] },
      { name: '和梨のスカッシュ', price: 550, months: [8, 9, 10] },
      { name: 'ル レクチエのタルト', price: 680, months: [11, 12] },
    ],
    pos: { x: 772, y: 196 },
  },
  {
    id: 'softcream',
    no: 8,
    name: 'ソフトクリーム こりす',
    kind: 'eat',
    icon: 'icecream',
    area: '食堂棟 1F',
    schedule: { weekday: H('10:00', '17:00'), holiday: H('09:30', '17:30') },
    lead: '道の駅に来たら、やっぱりこれ。',
    desc: '加茂山リス園にちなんだソフトクリーム店。季節の果物ソフトは、朝どれ市の果物でつくります。',
    photo: 'softServe',
    menu: [
      { name: 'ミルク', price: 400 },
      { name: '白桃ソフト', price: 480, months: [7, 8] },
      { name: '和梨ソフト', price: 480, months: [9, 10] },
      { name: 'ル レクチエソフト', price: 500, months: [11, 12] },
    ],
    pos: { x: 712, y: 276 },
  },
  {
    id: 'bakery',
    no: 9,
    name: 'こめとこむぎ',
    kind: 'eat',
    icon: 'bread',
    area: '食堂棟 1F',
    schedule: { weekday: H('08:00', '16:00'), holiday: H('08:00', '16:00') },
    closure: { weekday: 1 },
    note: '売り切れ次第終了',
    lead: '朝 8 時、焼きたての香り。',
    desc: '七谷米の米粉を使ったパン工房。もちもちの米粉食パンと、季節の果物のデニッシュが人気です。',
    photo: 'bread',
    pos: { x: 772, y: 276 },
  },
  {
    id: 'footbath',
    no: 10,
    name: '雪椿の足湯',
    kind: 'play',
    icon: 'footbath',
    area: '川辺テラス横',
    schedule: { weekday: H('09:00', '18:00'), holiday: H('09:00', '18:00') },
    note: '無料・タオル販売あり（100円）・冬期は 17:00 まで',
    lead: '川風にあたりながら、ひと休み。',
    desc: '加茂川を眺める無料の足湯。温泉にゆっくり浸かるなら、バスで約 17 分の「美人の湯」へ。',
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
    note: '電動アシスト 2時間 1,000円・返却 17:30 まで・12〜3月は休止',
    lead: '加茂川沿いを、まちなかへ。',
    desc: '加茂山公園や商店街、青海神社を巡る起点。季節のおすすめコースの地図をお渡しします。ヘルメット無料貸出。',
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
    lead: '紙をすく。桐を削る。',
    desc: '加茂紙の紙すきでつくるはがき、桐の端材を使った箸やコースターづくりなど、加茂の手しごとを体験できます。',
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
    schedule: { weekday: H('10:00', '18:00'), holiday: H('10:00', '18:00') },
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
    lead: '加茂の観光・交通の案内所。',
    desc: '加茂山公園や美人の湯などの観光案内、かもんバスの乗り方、道路・積雪情報のご案内。最新情報は加茂市の公式サイトもご確認ください。',
    pos: { x: 528, y: 318 },
  },
];

// 24時間の施設・設備（地図と施設一覧に表示）
export type Amenity = { id: string; label: string; icon: IconName; hours: string; desc: string; map?: { x: number; y: number; label: string } };

export const AMENITIES: Amenity[] = [
  { id: 'wc', label: 'トイレ', icon: 'restroom', hours: '24時間', desc: '多目的トイレ・オストメイト・ベビーチェア完備。', map: { x: 236, y: 330, label: 'WC' } },
  { id: 'wc2', label: 'トイレ（川辺テラス）', icon: 'restroom', hours: '24時間', desc: '川辺テラス側にもトイレがあります。', map: { x: 760, y: 420, label: 'WC' } },
  { id: 'ev', label: 'EV 急速充電', icon: 'ev', hours: '24時間', desc: '急速充電器 4 基（CHAdeMO）。', map: { x: 330, y: 590, label: 'EV' } },
  { id: 'wifi', label: '無料 Wi-Fi', icon: 'wifi', hours: '24時間', desc: '館内・駐車場の一部（Lumina_Free）。' },
  { id: 'baby', label: 'ベビールーム', icon: 'baby', hours: '9:00〜19:00', desc: '授乳室 3 室、おむつ替え台、給湯器。' },
  { id: 'aed', label: 'AED', icon: 'aed', hours: '24時間', desc: '物産館入口とトイレ棟に設置。' },
  { id: 'locker', label: 'コインロッカー', icon: 'locker', hours: '8:00〜20:00', desc: '大型の荷物も入るロッカー 30 台。' },
  { id: 'wheelchair', label: '車いす貸出', icon: 'accessible', hours: '9:00〜18:00', desc: '観光案内カウンターで無料貸出（4 台）。' },
  { id: 'deck', label: '川辺テラス', icon: 'deck', hours: '24時間', desc: '加茂川と粟ヶ岳を一望。春は鯉のぼりの季節がおすすめ。', map: { x: 900, y: 250, label: '川辺テラス' } },
  { id: 'bus', label: 'シャトルバス乗り場', icon: 'bus', hours: '運行時間内', desc: '加茂駅・臨時駐車場 P3 行きの無料シャトル（架空）。', map: { x: 404, y: 470, label: 'BUS' } },
];

// ---------- 旬カレンダー ----------

export type ProductCategory = '野菜・米' | '果物' | '山の幸' | '加工品';

export type Product = { name: string; category: ProductCategory; months: number[]; peak: number[]; note: string; photo?: PhotoKey };

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const PRODUCTS: Product[] = [
  // 果物（加茂市の特産。時期は出荷時期の目安）
  { name: '桃（白桃・黄桃）', category: '果物', months: [7, 8], peak: [8], note: '夏の加茂の果物。7〜8月に出荷' },
  { name: '和梨（幸水）', category: '果物', months: [8, 9], peak: [8], note: '8月中旬から。和梨のシーズンの始まり' },
  { name: '和梨（豊水）', category: '果物', months: [8, 9], peak: [9], note: '8月下旬〜9月上旬。甘みと酸味のバランス' },
  { name: '和梨（あきづき）', category: '果物', months: [9, 10], peak: [9], note: '9月中旬から。大玉でシャリっと' },
  { name: '和梨（新高）', category: '果物', months: [10], peak: [10], note: '10月上旬。ずっしり重い大玉' },
  { name: '和梨（新興）', category: '果物', months: [10, 11, 12], peak: [11], note: '10月下旬から。日持ちがよく、さわやかな甘み' },
  { name: 'ル レクチエ', category: '果物', months: [11, 12], peak: [12], note: '新潟の洋梨。追熟させてから、11月下旬〜12月中旬に' },
  // 野菜・米
  { name: '新米（コシヒカリ）', category: '野菜・米', months: [9, 10, 11], peak: [10], note: '加茂の水源地・七谷の田んぼから', photo: 'riceField' },
  { name: '枝豆', category: '野菜・米', months: [7, 8, 9], peak: [8], note: '新潟の夏の定番。朝もぎを' },
  { name: 'なす', category: '野菜・米', months: [6, 7, 8, 9], peak: [7, 8], note: '新潟はなすの作付けが多い県。焼きなすや漬物に' },
  { name: '大根', category: '野菜・米', months: [11, 12, 1, 2], peak: [12, 1], note: '雪の季節に甘くなる冬の主役' },
  { name: 'さつまいも', category: '野菜・米', months: [9, 10, 11, 12], peak: [10, 11], note: 'ほくほくの焼きいも用も', photo: 'sweetPotato' },
  // 山の幸
  { name: '山菜（ぜんまい・わらび）', category: '山の幸', months: [4, 5, 6], peak: [5], note: '雪どけのあとの、春の山の味' },
  { name: 'たけのこ', category: '山の幸', months: [5, 6], peak: [5], note: '春の煮物と、たけのこご飯に' },
  { name: 'きのこ', category: '山の幸', months: [9, 10, 11], peak: [10], note: '原木しいたけ、なめこ、舞茸' },
  // 加工品
  { name: '加茂の地酒', category: '加工品', months: ALL, peak: [12, 1, 2], note: '市内 3 つの蔵元の酒。冬は新酒の季節' },
  { name: 'かも汁（缶）', category: '加工品', months: ALL, peak: [], note: '加茂の名物の汁物。ふるさと納税の返礼品にも' },
  { name: '笹団子', category: '加工品', months: ALL, peak: [5, 6], note: '新潟の定番のおやつ。端午の節句のころに' },
];

// 入荷情報で使う定番品（季節を問わず並ぶもの）
export const MOUNTAIN_STAPLES = ['原木しいたけ', 'なめこ', '舞茸', 'こんにゃく', '平飼い卵', '手づくり味噌', '米粉', '切り餅'];
export const PRODUCE_STAPLES = ['長ねぎ', 'ほうれん草', 'じゃがいも', '玉ねぎ', 'にんじん', '小松菜', 'しょうが', '七谷米（精米）'];
export const CRAFT_STAPLES = ['加茂の地酒', 'かも汁（缶）', '笹団子', '加茂紙のはがき', '桐のまな板', '岳炭（木炭）'];
export const FLOWERS_BY_MONTH: Record<number, string[]> = {
  1: ['水仙', '葉牡丹'],
  2: ['菜の花', 'チューリップ'],
  3: ['雪椿（枝もの）', 'チューリップ'],
  4: ['雪椿（枝もの）', 'ラナンキュラス'],
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
  posted?: boolean; // Slack に投稿されたイベント
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
    title: '写真ウォーク：加茂山公園の光をとらえる',
    category: 'session',
    weekdays: [6],
    start: '10:00',
    end: '11:30',
    place: '観光案内カウンター前 集合',
    desc: 'Lumina Phone のカメラで、季節の加茂山公園を撮りに出かけます（バスで移動）。',
    reservation: true,
    fee: '無料',
  },
  {
    title: '加茂紙の紙すき体験',
    category: 'kids',
    weekdays: [0, 6],
    start: '10:30',
    end: '11:30',
    place: '体験工房',
    desc: '和紙をすいて、押し花入りのはがきをつくります。乾かしてからお渡しします（後日郵送も可）。',
    reservation: true,
    fee: '800円',
  },
  {
    title: '桐の箸づくり',
    category: 'kids',
    weekdays: [0, 6],
    start: '13:30',
    end: '14:30',
    place: '体験工房',
    desc: '桐たんすづくりで出る端材を削って、自分だけの箸に。小学生以上（低学年は保護者と一緒に）。',
    reservation: true,
    fee: '1,000円',
  },
  {
    title: '週末マルシェ',
    category: 'market',
    weekdays: [0],
    start: '09:00',
    end: '15:00',
    place: '屋外広場',
    desc: '市内の農家・職人・お菓子屋さんが集まる青空市。売り切れ次第終了です。',
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
    title: '新米と和梨の収穫祭',
    category: 'special',
    start: '09:00',
    end: '15:00',
    place: '屋外広場・館内全体',
    desc: '七谷の新米の試食、新高・新興梨の詰め放題、岳炭の炭火焼き。雨天決行。',
  },
  {
    date: '2026-11-03',
    title: '文化の日 桐と紙の手しごと市',
    category: 'special',
    start: '10:00',
    end: '16:00',
    place: '物産館 2F・体験棟',
    desc: '桐の木工と加茂紙の作り手が集まる一日だけの市。紙すき・箸づくりの体験は予約なしで参加できます。',
  },
  {
    date: '2026-11-28',
    title: 'ル レクチエ解禁フェア',
    category: 'special',
    start: '09:00',
    end: '17:00',
    place: '朝どれ市・カフェ',
    desc: '追熟を終えたル レクチエの販売開始。食べごろの見分け方の説明と、カフェの限定タルト。',
  },
  {
    date: '2026-12-19',
    title: '冬の灯り 点灯式',
    category: 'special',
    start: '17:00',
    end: '18:00',
    place: '屋外広場',
    desc: '雪椿をかたどったイルミネーションが灯ります。温かい甘酒のふるまいあり（なくなり次第終了）。',
  },
];

// ---------- お知らせ ----------

export type NewsCategory = 'お知らせ' | 'イベント' | '施設' | '商品' | '交通';

export type News = { date: string; category: NewsCategory; title: string; body: string; important?: boolean };

export const NEWS: News[] = [
  {
    date: '2026-10-15',
    category: 'イベント',
    title: '10月24日（土）「新米と和梨の収穫祭」を開催します',
    body: '七谷の新米の試食や、新高・新興梨の詰め放題を行います。当日は臨時駐車場（P3）からシャトルバスを 10 分間隔で運行します。',
  },
  {
    date: '2026-10-12',
    category: '施設',
    title: '冬期の営業と除雪について',
    body: '12月〜3月は足湯を 17:00 までに短縮し、レンタサイクルを休止します。駐車場は早朝に除雪しますが、大雪の日は一部区画を閉鎖することがあります。',
    important: true,
  },
  {
    date: '2026-10-08',
    category: '商品',
    title: '朝どれ市に新高梨と新米が並び始めました',
    body: '大玉の新高梨と、七谷の新米（コシヒカリ）の販売を始めました。10月下旬からは日持ちのよい新興梨も入荷予定です。',
  },
  {
    date: '2026-10-01',
    category: '商品',
    title: 'ル レクチエのご予約を受け付けています',
    body: '11月下旬からの販売分の予約を朝どれ市で受け付けています。贈答用の箱詰め・発送もご相談ください。',
  },
  {
    date: '2026-09-25',
    category: 'お知らせ',
    title: '年末年始の営業について',
    body: '12月31日と1月1日は全館休業いたします。1月2日・3日は全店 10:00〜17:00 の短縮営業です。トイレ・EV 充電・駐車場は通常どおり 24 時間ご利用いただけます。',
    important: true,
  },
  {
    date: '2026-09-18',
    category: '施設',
    title: '体験工房に「桐の箸づくり」が加わりました',
    body: '桐たんすの端材を使った箸づくりを、土日祝の午後に開催します。ご予約は観光案内カウンターで。',
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

// 加茂駅 ⇄ 道の駅のシャトルバス（架空・無料）。土日祝は臨時駐車場（P3）からも運行。
export const SHUTTLE_ROUTES: ShuttleRoute[] = [
  { id: 'from-station', from: '加茂駅前', to: '道の駅', weekday: { first: '08:40', last: '18:40', every: 30 }, holiday: { first: '08:30', last: '18:30', every: 20 } },
  { id: 'to-station', from: '道の駅', to: '加茂駅前', weekday: { first: '09:00', last: '19:00', every: 30 }, holiday: { first: '08:50', last: '19:10', every: 20 } },
  { id: 'from-p3', from: '臨時駐車場 P3', to: '道の駅', weekday: null, holiday: { first: '09:00', last: '16:00', every: 10 } },
];

export const ACCESS: { mode: string; icon: IconName; lines: string[] }[] = [
  { mode: '車', icon: 'parking', lines: ['北陸自動車道 三条燕IC から加茂市街地まで約 25 分', '冬は積雪・路面凍結にご注意ください'] },
  { mode: '電車', icon: 'bus', lines: ['JR信越本線 加茂駅から無料シャトルバス（架空）で約 8 分'] },
  { mode: '市内の移動', icon: 'bus', lines: ['加茂市のコミュニティバス「かもんバス」が便利です', '七谷線は加茂駅前から美人の湯前まで約 17 分'] },
];

// 車での所要時間の目安（道の駅は架空のため、市街地からのおおよその時間）
export const DRIVE_TIMES = [
  { from: '三条燕IC', minutes: 25 },
  { from: '加茂駅', minutes: 8 },
  { from: '加茂山公園', minutes: 8 },
  { from: '加茂七谷温泉 美人の湯', minutes: 20 },
];

// ---------- 周辺情報（実在。詳しくは /kamo と lib/kamo.ts） ----------

export const NEARBY: { name: string; kind: string; distance: string; desc: string; photo: PhotoKey; href: string }[] = [
  { name: '加茂山公園', kind: '公園', distance: '加茂駅から徒歩 5 分', desc: '雪椿の群生地。リス園と、紅葉のモミジ谷・彫刻の森。', photo: 'autumnHouse', href: '/kamo#spots' },
  { name: '加茂川', kind: '景観', distance: 'まちの中心', desc: '春は約 500 匹の鯉のぼり、夏は大花火大会の舞台。', photo: 'koinobori', href: '/kamo#events' },
  { name: '加茂七谷温泉 美人の湯', kind: '日帰り温泉', distance: '加茂駅前からバスで約 17 分', desc: '粟ヶ岳のふもとの日帰り温泉。毎月第2・第4水曜定休。', photo: 'footBath', href: '/kamo#bus' },
  { name: '冬鳥越スキーガーデン', kind: 'スキー・そり', distance: '冬季（積雪による）', desc: '県央地域で唯一のスキー場。そり専用コースも。', photo: 'snowRoad', href: '/kamo#spots' },
];

// ---------- 加茂の手しごと・名産（実在） ----------

export const KAMO_CRAFTS: { name: string; kind: string; desc: string; source: string }[] = [
  {
    name: '加茂桐箪笥',
    kind: '国の伝統的工芸品',
    desc: '約 220 年受け継がれてきた技。加茂は日本有数の桐たんすの産地です。',
    source: 'https://www.pref.niigata.lg.jp/sec/sanjou_kikaku/20230215-meister.html',
  },
  {
    name: '加茂紙',
    kind: '手すき和紙',
    desc: '商店街の中に紙すき場がある、加茂の手すき和紙。はがきなどのおみやげにも。',
    source: 'https://www.pref.niigata.lg.jp/site/miryokutankenki/kamojiru.html',
  },
  {
    name: 'ル レクチエ',
    kind: '洋梨',
    desc: '新潟を代表する洋梨。ほとんどが加茂市・三条市・新潟市南区など信濃川沿いでつくられています。',
    source: 'https://www.furusato-tax.jp/feature/detail/15209/16927',
  },
  {
    name: '加茂の地酒',
    kind: '日本酒',
    desc: '市内にはマスカガミ・加茂錦・雪椿の 3 つの蔵元があります。',
    source: 'https://www.furusato-tax.jp/product/detail/15209/6773158',
  },
];

// ---------- 道の駅の機能 ----------

export const STATION_FUNCTIONS: { title: string; icon: IconName; lead: string; points: string[] }[] = [
  {
    title: '休憩',
    icon: 'rest',
    lead: '24時間、だれでも無料で。',
    points: ['駐車場 普通車 140 台・大型車 10 台', '24時間トイレ・ベビールーム', 'EV 急速充電 4 基'],
  },
  {
    title: '情報発信',
    icon: 'megaphone',
    lead: '道路と、まちの「いま」を。',
    points: ['道路・積雪・気象情報のデジタルサイネージ', '加茂市・新潟のニュースを 1日3回 更新', '道の駅スタンプ'],
  },
  {
    title: '地域連携',
    icon: 'leaf',
    lead: '作り手と旅人をつなぐ。',
    points: ['市内の農家・桐の職人・和紙の作り手が出品', '体験工房と週末マルシェ', 'まちなかを巡るレンタサイクル'],
  },
  {
    title: '防災・雪',
    icon: 'shield',
    lead: '雪の日も、もしものときも。',
    points: ['冬期は駐車場を毎朝除雪', '非常用発電で 72 時間給電', '災害時は一時避難所として開放'],
  },
];

// ---------- よくある質問 ----------

export const FAQ = [
  { q: 'この道の駅は実在しますか？', a: 'いいえ。「Lumina 加茂」はデザイン学習用の架空の道の駅です。加茂市の名所・特産・行事・バス時刻は実在の情報をもとにしていますが、最新の情報は加茂市の公式サイトでご確認ください。' },
  { q: '駐車場は無料ですか？', a: 'はい、無料です。普通車 140 台・大型車 10 台を 24 時間ご利用いただけます。土日祝の混雑時は臨時駐車場（P3・180 台）と無料シャトルバスをご利用ください。' },
  { q: '冬でも営業していますか？', a: '年末年始（12/31・1/1）を除いて営業しています。12月〜3月は足湯の時間短縮とレンタサイクルの休止があります。大雪の日は、来場前に道路情報をご確認ください。' },
  { q: 'ル レクチエはいつ買えますか？', a: '例年 11月下旬〜12月中旬です。収穫後に追熟させてから並べるため、販売開始日は年によって前後します。予約・発送は朝どれ市で承ります。' },
  { q: '入荷情報はいつ更新されますか？', a: '毎朝 8 時 30 分ごろに更新します。天候や収穫の状況によって、入荷が少ない日や遅れる日があります。' },
  { q: 'イベントや体験の予約は必要ですか？', a: '「要予約」と表示されたものは事前予約が必要です。空きがあれば当日参加も可能です。それ以外は予約不要です。' },
  { q: '美人の湯へはどう行けばいいですか？', a: '加茂駅前から、かもんバス 七谷線で「美人の湯前」まで約 17 分です。美人の湯は毎月第2・第4水曜が定休日です。時刻は加茂ローカルのページをご覧ください。' },
  { q: '使える支払い方法は？', a: '現金、各種クレジットカード、電子マネー、QR コード決済がご利用いただけます。炭火焼き屋台と週末マルシェの一部は現金のみです。' },
];
