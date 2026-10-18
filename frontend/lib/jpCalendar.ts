// 日付計算と日本の祝日判定。
// 祝日は「国民の祝日に関する法律」の規則（ハッピーマンデー、春分・秋分の近似式、振替休日、国民の休日）で計算する。
// 2022〜2099 年を対象とする（東京五輪に伴う 2020・2021 年の特例移動は考慮しない）。

export type YMD = { y: number; m: number; d: number };

const pad = (n: number) => String(n).padStart(2, '0');

export const ymd = ({ y, m, d }: YMD) => `${y}-${pad(m)}-${pad(d)}`;

export function parseYmd(s: string): YMD {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
}

// タイムゾーンの影響を受けないよう UTC で日付だけを扱う
export function weekday({ y, m, d }: YMD) {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays({ y, m, d }: YMD, n: number): YMD {
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export const sameDay = (a: YMD, b: YMD) => a.y === b.y && a.m === b.m && a.d === b.d;

export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function formatMD(date: YMD) {
  return `${date.m}月${date.d}日（${WEEKDAYS[weekday(date)]}）`;
}

function nthMonday(y: number, m: number, n: number) {
  const first = weekday({ y, m, d: 1 });
  return 1 + ((1 - first + 7) % 7) + (n - 1) * 7;
}

const vernalEquinox = (y: number) => Math.floor(20.8431 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
const autumnalEquinox = (y: number) => Math.floor(23.2488 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));

const cache = new Map<number, Map<string, string>>();

function baseHolidays(y: number) {
  const hit = cache.get(y);
  if (hit) return hit;
  const map = new Map<string, string>();
  const set = (m: number, d: number, name: string) => map.set(`${pad(m)}-${pad(d)}`, name);
  set(1, 1, '元日');
  set(1, nthMonday(y, 1, 2), '成人の日');
  set(2, 11, '建国記念の日');
  set(2, 23, '天皇誕生日');
  set(3, vernalEquinox(y), '春分の日');
  set(4, 29, '昭和の日');
  set(5, 3, '憲法記念日');
  set(5, 4, 'みどりの日');
  set(5, 5, 'こどもの日');
  set(7, nthMonday(y, 7, 3), '海の日');
  set(8, 11, '山の日');
  set(9, nthMonday(y, 9, 3), '敬老の日');
  set(9, autumnalEquinox(y), '秋分の日');
  set(10, nthMonday(y, 10, 2), 'スポーツの日');
  set(11, 3, '文化の日');
  set(11, 23, '勤労感謝の日');
  cache.set(y, map);
  return map;
}

const baseName = (date: YMD) => baseHolidays(date.y).get(`${pad(date.m)}-${pad(date.d)}`) ?? null;

export function holidayName(date: YMD): string | null {
  const base = baseName(date);
  if (base) return base;
  // 振替休日: 日曜の祝日以降で、最初の祝日でない日
  for (let k = 1; k <= 7; k++) {
    const prev = addDays(date, -k);
    if (!baseName(prev)) break;
    if (weekday(prev) === 0) return '振替休日';
  }
  // 国民の休日: 前日と翌日が祝日に挟まれた平日
  if (weekday(date) !== 0 && baseName(addDays(date, -1)) && baseName(addDays(date, 1))) return '国民の休日';
  return null;
}

export const isHoliday = (date: YMD) => holidayName(date) !== null;

// 土日祝は「休日」扱い
export type DayType = 'weekday' | 'holiday';
export function dayType(date: YMD): DayType {
  const wd = weekday(date);
  return wd === 0 || wd === 6 || isHoliday(date) ? 'holiday' : 'weekday';
}

// 月の中で何回目のその曜日か（第n○曜日）
export const nthOfMonth = (date: YMD) => Math.ceil(date.d / 7);

// 店舗のある日本時間の「今」
export function tokyoNow(at = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const date: YMD = { y: get('year'), m: get('month'), d: get('day') };
  return { date, minutes: get('hour') * 60 + get('minute') };
}
export type TokyoNow = ReturnType<typeof tokyoNow>;

export const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const fromMinutes = (n: number) => `${Math.floor(n / 60)}:${pad(n % 60)}`;
