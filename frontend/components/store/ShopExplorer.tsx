'use client';

import { useEffect, useState } from 'react';
import Photo from '@/components/Photo';
import Icon from '@/components/Icons';
import { LogoMark } from '@/components/Devices';
import { StatusSkeleton, StatusText } from '@/components/store/OpenBadge';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { closureLabel, formatHours, hoursOn, shopStatus } from '@/lib/hours';
import { KINDS, SHOPS, type Shop, type ShopKind } from '@/lib/storeInfo';

const TABS: ShopKind[] = ['buy', 'eat', 'play', 'service'];

export function showOnMap(id: string) {
  window.dispatchEvent(new CustomEvent('sitemap:select', { detail: id }));
  document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ShopArt({ shop }: { shop: Shop }) {
  if (shop.photo) return <Photo name={shop.photo} sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" className="aspect-[4/3]" />;
  const isBrand = shop.id === 'lumina-store' || shop.id === 'care';
  return (
    <div className={`flex aspect-[4/3] flex-col items-center justify-center gap-3 ${isBrand ? 'bg-studio-dark text-[#f5f5f7]' : 'bg-studio-gray text-ink'}`}>
      {isBrand ? <LogoMark className="h-14 w-14" /> : <Icon name={shop.icon} className="h-14 w-14" />}
      <span className="text-[17px] font-semibold">{shop.name}</span>
    </div>
  );
}

const monthsLabel = (months: number[]) => `${months[0]}〜${months[months.length - 1]}月`;

export default function ShopExplorer() {
  const [tab, setTab] = useState<ShopKind>('buy');
  const now = useTokyoNow();

  // #buy / #eat / #play / #service で開くタブを指定できる
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1) as ShopKind;
      if (TABS.includes(h)) {
        setTab(h);
        document.getElementById('shops')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const list = SHOPS.filter((s) => s.kind === tab);

  return (
    <div>
      <div role="tablist" aria-label="施設の種類" className="mx-auto mb-8 grid grid-cols-4 gap-1 rounded-full bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:flex sm:w-fit">
        {TABS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            aria-controls="shop-panel"
            onClick={() => setTab(k)}
            className={`whitespace-nowrap rounded-full px-1 py-2 text-[13px] transition-colors sm:px-7 sm:text-[15px] ${tab === k ? 'bg-ink font-semibold text-white' : 'text-ink hover:bg-canvas-gray'}`}
          >
            {KINDS[k].label}
            <span className={`ml-1.5 hidden text-[12px] sm:inline ${tab === k ? 'text-white/60' : 'text-ink-tertiary'}`}>{SHOPS.filter((s) => s.kind === k).length}</span>
          </button>
        ))}
      </div>

      <ul id="shop-panel" role="tabpanel" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => {
          const today = now ? hoursOn(s, now.date) : null;
          const seasonMonth = now?.date.m;
          return (
            <li key={s.id} id={`shop-${s.id}`} className="flex scroll-mt-32 flex-col overflow-hidden rounded-[22px] bg-white">
              <div className="relative">
                <ShopArt shop={s} />
                <span
                  className="absolute left-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[14px] font-semibold text-white shadow-md"
                  style={{ background: KINDS[s.kind].color }}
                >
                  {s.no}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[12px] font-semibold" style={{ color: KINDS[s.kind].color }}>
                  {KINDS[s.kind].label}・{s.area}
                </p>
                <h3 className="mt-1 text-[24px] font-semibold leading-[1.2] text-ink">{s.name}</h3>
                <p className="mt-2 text-[17px] font-semibold leading-[1.35] text-ink">{s.lead}</p>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-secondary">{s.desc}</p>

                {s.menu && (
                  <ul className="mt-4 divide-y divide-black/[0.06] rounded-2xl bg-canvas-gray px-4 text-[14px]">
                    {s.menu.map((m) => {
                      const off = m.months && seasonMonth !== undefined && !m.months.includes(seasonMonth);
                      return (
                        <li key={m.name} className={`flex items-baseline justify-between gap-3 py-2.5 ${off ? 'text-ink-tertiary' : 'text-ink'}`}>
                          <span>
                            {m.name}
                            {m.note && <span className="ml-1.5 text-[12px] text-[#e3004f]">{m.note}</span>}
                            {m.months && <span className="ml-1.5 text-[12px] text-ink-tertiary">{off ? `${monthsLabel(m.months)}限定` : '季節限定'}</span>}
                          </span>
                          <span className="shrink-0 tabular-nums">¥{m.price.toLocaleString()}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <dl className="mt-5 space-y-1.5 border-t border-black/10 pt-4 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="sr-only">いまの状況</dt>
                    <dd>{now ? <StatusText status={shopStatus(s, now)} size="sm" /> : <StatusSkeleton />}</dd>
                  </div>
                  <div className="flex gap-2 text-ink-secondary">
                    <dt className="shrink-0">本日</dt>
                    <dd className="text-ink">{now ? formatHours(today) : '—'}</dd>
                  </div>
                  <div className="flex gap-2 text-ink-secondary">
                    <dt className="shrink-0">定休日</dt>
                    <dd>{closureLabel(s)}</dd>
                  </div>
                  {s.note && <dd className="text-ink-secondary">{s.note}</dd>}
                </dl>
                <button type="button" onClick={() => showOnMap(s.id)} className="link-chevron mt-4 self-start text-[14px]">
                  地図で見る ›
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
