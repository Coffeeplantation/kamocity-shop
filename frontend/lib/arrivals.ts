// 本日の入荷状況。旬の品と定番品から、日付をシードにして毎日違う品ぞろえを決める。
// （架空の道の駅のため、実際の入荷データではなくデモ用に生成している）

import { ymd, type YMD } from '@/lib/jpCalendar';
import type { PhotoKey } from '@/lib/photos';
import {
  CRAFT_STAPLES,
  FLOWERS_BY_MONTH,
  PRODUCE_STAPLES,
  PRODUCTS,
  SEAFOOD_STAPLES,
  STORE,
  type ProductCategory,
} from '@/lib/storeInfo';

export const ARRIVAL_UPDATE = '08:30';

export type ArrivalTag = 'おすすめ' | '初入荷' | '数量限定' | '入荷少';
export type ArrivalItem = { name: string; tag?: ArrivalTag };
export type ArrivalGroup = { id: 'sea' | 'farm' | 'craft'; title: string; photo: PhotoKey; items: ArrivalItem[]; note?: string };

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: T[], rand: () => number) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seasonal(categories: ProductCategory[], date: YMD): ArrivalItem[] {
  return PRODUCTS.filter((p) => categories.includes(p.category) && p.months.includes(date.m))
    .sort((a, b) => Number(b.peak.includes(date.m)) - Number(a.peak.includes(date.m)))
    .map((p) => ({
      name: p.name,
      tag: p.months[0] === date.m && date.d <= 15 && p.months.length < 12 ? '初入荷' : p.peak.includes(date.m) ? 'おすすめ' : undefined,
    }));
}

function pick(seasonalItems: ArrivalItem[], staples: string[], count: number, rand: () => number) {
  const names = new Set(seasonalItems.map((i) => i.name));
  const extra = shuffle(staples, rand)
    .filter((n) => !names.has(n))
    .map((name) => ({ name }) as ArrivalItem);
  const items = [...seasonalItems, ...extra].slice(0, count);
  // 「おすすめ」は各売場 2 品まで
  let recommended = 0;
  for (const i of items) if (i.tag === 'おすすめ' && ++recommended > 2) i.tag = undefined;
  // 定番品のひとつに「数量限定」
  const limited = items.findIndex((i, idx) => !i.tag && idx >= 1 && rand() < 0.5);
  if (limited >= 0) items[limited] = { ...items[limited], tag: '数量限定' };
  return items;
}

export function arrivalsFor(date: YMD): ArrivalGroup[] | null {
  if (STORE.closedDates.includes(ymd(date))) return null;
  const rand = rng(date.y * 10000 + date.m * 100 + date.d);
  // 7日に1日ほどは海がしけて入荷が少ない
  const rough = rand() < 0.14;

  const sea = pick(seasonal(['水産'], date), SEAFOOD_STAPLES, rough ? 4 : 8, rand);
  if (rough) {
    for (const i of sea.slice(1)) i.tag = '入荷少';
  }

  const farm = pick(seasonal(['野菜・米', '果物'], date), PRODUCE_STAPLES, 9, rand);

  const flowers = (FLOWERS_BY_MONTH[date.m] ?? []).map((name) => ({ name: `${name}（切り花）` }) as ArrivalItem);
  const craft = pick([...seasonal(['加工品'], date), ...flowers], CRAFT_STAPLES, 7, rand);

  return [
    {
      id: 'sea',
      title: '鮮魚・水産物',
      photo: 'freshFish',
      items: sea,
      note: rough ? '海がしけたため、本日は入荷が少なめです。' : '湊町漁港の朝の競りから直送。',
    },
    { id: 'farm', title: '野菜・果物', photo: 'mikanStand', items: farm, note: '町内の農家が今朝収穫したものです。' },
    { id: 'craft', title: '花・加工品', photo: 'flowers', items: craft, note: '干物・つくだ煮は港の加工場の手づくり。' },
  ];
}
