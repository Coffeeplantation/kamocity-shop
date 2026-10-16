'use client';

import Photo from '@/components/Photo';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { ARRIVAL_UPDATE, arrivalsFor, type ArrivalTag } from '@/lib/arrivals';
import { fmt } from '@/lib/hours';
import { addDays, formatMD, toMinutes } from '@/lib/jpCalendar';

const TAG_STYLE: Record<ArrivalTag, string> = {
  おすすめ: 'bg-[#e3004f] text-white',
  初入荷: 'bg-[#0071e3] text-white',
  数量限定: 'bg-[#1d1d1f] text-white',
  入荷少: 'border border-[#b25000] text-[#b25000]',
};

// 本日の入荷状況（むなかた等の道の駅サイトにならい、売場ごとに掲載）
export default function Arrivals() {
  const now = useTokyoNow();
  if (!now) return <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-[460px] animate-pulse rounded-[22px] bg-white" />)}</div>;

  // 更新前（8:30 まで）は前日の入荷を参考として表示
  const beforeUpdate = now.minutes < toMinutes(ARRIVAL_UPDATE);
  const date = beforeUpdate ? addDays(now.date, -1) : now.date;
  const groups = arrivalsFor(date);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
        <span className="font-semibold text-ink">{formatMD(date)}</span>
        {beforeUpdate ? (
          <span className="rounded-full bg-[#fff4e5] px-3 py-1 text-[#b25000]">本日分は {fmt(ARRIVAL_UPDATE)} ごろ更新します。いまは前日の入荷を表示しています。</span>
        ) : (
          <span className="flex items-center gap-1.5 text-ink-secondary">
            <span className="h-2 w-2 rounded-full bg-[#30d158]" aria-hidden />
            {fmt(ARRIVAL_UPDATE)} 更新
          </span>
        )}
      </div>

      {!groups ? (
        <p className="rounded-[22px] bg-white px-6 py-12 text-center text-[17px] text-ink-secondary">全館休業日のため、入荷はありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {groups.map((g) => (
            <article key={g.id} className="flex flex-col overflow-hidden rounded-[22px] bg-white">
              <div className="relative">
                <Photo name={g.photo} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[16/9]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" aria-hidden />
                <h3 className="absolute bottom-4 left-5 text-[24px] font-semibold text-white">{g.title}</h3>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li key={i.name} className="flex items-center gap-1.5 rounded-full bg-canvas-gray py-1.5 pl-3.5 pr-2 text-[15px] text-ink">
                      {i.name}
                      {i.tag ? (
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_STYLE[i.tag]}`}>{i.tag}</span>
                      ) : (
                        <span className="w-1.5" aria-hidden />
                      )}
                    </li>
                  ))}
                </ul>
                {g.note && <p className="mt-auto pt-5 text-[13px] leading-[1.5] text-ink-secondary">{g.note}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="mt-4 text-[12px] leading-[1.6] text-ink-secondary">
        ※ 入荷状況は漁や天候によって変わります。売り切れの際はご容赦ください。数量限定品はお一人様あたりの購入数を制限する場合があります。
      </p>
    </div>
  );
}
