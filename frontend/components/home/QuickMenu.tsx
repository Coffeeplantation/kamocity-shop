import Link from 'next/link';
import Icon from '@/components/Icons';
import type { IconName } from '@/lib/storeInfo';

// 道の駅サイトのトップにある「目的別メニュー」。店舗ページの各セクションへ直接移動する
const ITEMS: { label: string; sub: string; href: string; icon: IconName }[] = [
  { label: '本日の入荷', sub: '朝 8:30 更新', href: '/stores#arrivals', icon: 'fish' },
  { label: '旬カレンダー', sub: '今月の味', href: '/stores#season', icon: 'leaf' },
  { label: '買う・食べる', sub: '14 の店と施設', href: '/stores#shops', icon: 'market' },
  { label: '営業時間', sub: '今日の状況', href: '/stores#hours', icon: 'store' },
  { label: '園内マップ', sub: 'どこに、なにが', href: '/stores#map', icon: 'deck' },
  { label: '混雑・シャトル', sub: '空いている時間', href: '/stores#crowd', icon: 'bus' },
  { label: 'イベント', sub: '毎日開催', href: '/stores#events', icon: 'megaphone' },
  { label: 'お知らせ', sub: '最新の情報', href: '/stores#news', icon: 'info' },
  { label: 'アクセス', sub: '車でも、電車でも', href: '/stores#access', icon: 'parking' },
  { label: 'よくある質問', sub: 'お問い合わせ', href: '/stores#faq', icon: 'support' },
  { label: '美人の湯バス', sub: '加茂駅から 17 分', href: '/kamo#bus', icon: 'bus' },
  { label: '加茂の行事', sub: '今月の加茂', href: '/kamo#events', icon: 'leaf' },
];

export default function QuickMenu() {
  return (
    <nav aria-label="目的から探す" className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
      <ul className="flex gap-3 md:grid md:grid-cols-6 xl:grid-cols-12">
        {ITEMS.map((i) => (
          <li key={i.href} className="w-[132px] shrink-0 md:w-auto">
            <Link
              href={i.href}
              className="group flex h-full flex-col items-center rounded-tile bg-surface px-3 py-5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas-gray text-ink transition-colors group-hover:bg-ink group-hover:text-on-ink">
                <Icon name={i.icon} className="h-6 w-6" />
              </span>
              <span className="mt-3 text-[15px] font-semibold text-ink">{i.label}</span>
              <span className="mt-0.5 text-[12px] text-ink-secondary">{i.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
