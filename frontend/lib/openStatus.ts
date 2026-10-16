import { Facility, Hours, STORE, ymd } from '@/lib/storeInfo';

export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 閲覧者のタイムゾーンに関係なく、店舗のある日本時間で判定する
export function tokyoNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  return {
    y: Number(get('year')),
    m: Number(get('month')),
    d: Number(get('day')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
  };
}

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

function addDays(y: number, m: number, d: number, n: number) {
  const dt = new Date(y, m - 1, d + n);
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate(), wd: dt.getDay() };
}

export function hoursFor(f: Facility | 'store', y: number, m: number, d: number, wd: number): Hours {
  if (f === 'store' || f.hours === 'store') return STORE.specialHours[ymd(y, m, d)] ?? STORE.hours[wd];
  return f.hours;
}

export function isClosedDay(y: number, m: number, d: number) {
  return STORE.closedDates.includes(ymd(y, m, d));
}

export type OpenStatus = { open: boolean; label: string; detail: string };

export function openStatus(f: Facility | 'store', now = tokyoNow()): OpenStatus {
  const today = hoursFor(f, now.y, now.m, now.d, now.wd);
  if (today === '24h') return { open: true, label: '利用可能', detail: '24時間' };

  const closedToday = isClosedDay(now.y, now.m, now.d) && (f === 'store' || f.hours !== '24h');
  if (today && !closedToday) {
    const o = toMin(today.open);
    const c = toMin(today.close);
    if (now.minutes >= o && now.minutes < c) {
      const soon = c - now.minutes <= 30;
      return { open: true, label: soon ? 'まもなく終了' : '営業中', detail: `${today.close}まで` };
    }
    if (now.minutes < o) return { open: false, label: '営業時間外', detail: `本日 ${today.open}から` };
  }

  // 次の営業日を探す（最大14日）
  for (let i = 1; i <= 14; i++) {
    const n = addDays(now.y, now.m, now.d, i);
    const h = hoursFor(f, n.y, n.m, n.d, n.wd);
    if (h && h !== '24h' && !isClosedDay(n.y, n.m, n.d)) {
      const when = i === 1 ? '明日' : `${n.m}月${n.d}日（${WEEKDAYS[n.wd]}）`;
      return { open: false, label: closedToday ? '本日休業' : '営業時間外', detail: `${when} ${h.open}から` };
    }
  }
  return { open: false, label: '休業中', detail: '' };
}

export function formatHours(h: Hours) {
  if (h === '24h') return '24時間';
  if (!h) return '休業';
  return `${h.open}〜${h.close}`;
}
