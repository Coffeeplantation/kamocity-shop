'use client';

import { useEffect, useState } from 'react';
import Photo from '@/components/Photo';
import Icon from '@/components/Icons';
import { StatusSkeleton, StatusText } from '@/components/store/OpenBadge';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { closureLabel, formatHours, hoursOn, shopStatus } from '@/lib/hours';
import { AMENITIES, KINDS, SHOPS, STORE, type ShopKind } from '@/lib/storeInfo';

type Filter = ShopKind | 'all';

function Trees({ points }: { points: [number, number, number][] }) {
  return (
    <g aria-hidden>
      {points.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x + 2} cy={y + 3} r={r} fill="#000" opacity="0.06" />
          <circle cx={x} cy={y} r={r} fill={i % 2 ? '#b5d1a6' : '#a5c795'} />
        </g>
      ))}
    </g>
  );
}

function Building({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y + 6} width={w} height={h} rx="18" fill="#000" opacity="0.08" filter="url(#soft)" />
      <rect x={x} y={y} width={w} height={h} rx="18" fill="#ffffff" stroke="#e3e3e8" />
      <text x={x + 14} y={y + 24} fontSize="13" fontWeight="600" fill="#86868b">
        {label}
      </text>
    </g>
  );
}

function Pill({ x, y, label, dark }: { x: number; y: number; label: string; dark?: boolean }) {
  const w = Math.max(34, label.length * (/[^\x00-\x7F]/.test(label) ? 13 : 8.5) + 16);
  return (
    <g aria-hidden>
      <rect x={x - w / 2} y={y - 12} width={w} height={24} rx="12" fill={dark ? '#1d1d1f' : '#ffffff'} stroke={dark ? 'none' : '#d2d2d7'} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={dark ? '#ffffff' : '#1d1d1f'}>
        {label}
      </text>
    </g>
  );
}

export default function SiteMap() {
  const now = useTokyoNow();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<string | null>(null);

  // 店舗カードの「地図で見る」から選択
  useEffect(() => {
    const onSelect = (e: Event) => {
      setFilter('all');
      setSelected((e as CustomEvent<string>).detail);
    };
    window.addEventListener('sitemap:select', onSelect);
    return () => window.removeEventListener('sitemap:select', onSelect);
  }, []);

  const shop = SHOPS.find((s) => s.id === selected) ?? null;
  const visible = (k: ShopKind) => filter === 'all' || filter === k;
  const select = (id: string) => setSelected((cur) => (cur === id ? null : id));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
      <div className="overflow-hidden rounded-card bg-surface">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-4 sm:px-5" role="group" aria-label="地図の表示を絞り込む">
          {(['all', 'buy', 'eat', 'play', 'service'] as Filter[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={filter === k}
              onClick={() => setFilter(k)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
                filter === k ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'
              }`}
            >
              {k !== 'all' && <span className="h-2 w-2 rounded-full" style={{ background: KINDS[k].color }} />}
              {k === 'all' ? 'すべて' : KINDS[k].label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar mt-2 overflow-x-auto">
        <svg viewBox="0 0 1000 640" className="h-auto w-full min-w-[720px] select-none md:min-w-0" role="group" aria-label={`${STORE.name} 園内マップ`}>
          <defs>
            <linearGradient id="map-sea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#cfeaf8" />
              <stop offset="1" stopColor="#9ccfee" />
            </linearGradient>
            <pattern id="map-wave" width="44" height="18" patternUnits="userSpaceOnUse">
              <path d="M0 9c11-7 11 7 22 0s11 7 22 0" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" />
            </pattern>
            <pattern id="map-stall" width="20" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 0v26M0 34v26" stroke="#fff" strokeWidth="2" />
            </pattern>
            <pattern id="map-plank" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M0 0v12" stroke="#d8c39f" strokeWidth="1.5" />
            </pattern>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* 地面・加茂川 */}
          <rect width="1000" height="640" fill="#edf1e8" />
          <path d="M826 0H1000V640H770C800 560 778 480 806 420C834 360 806 300 826 240C846 180 816 90 826 0Z" fill="url(#map-sea)" />
          <path d="M826 0H1000V640H770C800 560 778 480 806 420C834 360 806 300 826 240C846 180 816 90 826 0Z" fill="url(#map-wave)" />
          <text x="930" y="560" textAnchor="middle" fontSize="15" fontWeight="600" letterSpacing="6" fill="#3d8dbf">加茂川</text>

          {/* 川の向こうの粟ヶ岳（遠景） */}
          <g aria-hidden>
            <path d="M846 120L900 52L934 88L968 40L1000 78V120Z" fill="#c9d8c5" />
            <path d="M956 54L968 40L980 56Z" fill="#fff" opacity="0.8" />
            <text x="924" y="138" textAnchor="middle" fontSize="12" fill="#5b7a5b">粟ヶ岳 方面</text>
          </g>

          {/* 道路 */}
          <rect x="0" y="0" width="40" height="640" fill="#ffffff" />
          <path d="M20 0V640" stroke="#d2d2d7" strokeWidth="2" strokeDasharray="12 12" />
          <rect x="0" y="616" width="790" height="24" fill="#ffffff" />
          <path d="M40 628H780" stroke="#d2d2d7" strokeWidth="2" strokeDasharray="12 12" />
          <rect x="372" y="478" width="44" height="140" fill="#ffffff" />
          <text x="470" y="633" fontSize="12" fill="#86868b">道の駅通り</text>

          {/* 歩道・広場 */}
          <rect x="230" y="370" width="510" height="110" rx="20" fill="#f6f2ea" />
          <rect x="420" y="390" width="300" height="76" rx="16" fill="#efe6d4" />
          <text x="434" y="410" fontSize="13" fontWeight="600" fill="#a08c6a">屋外広場</text>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${600 + i * 40} 424)`} aria-hidden>
              <path d="M-14 10L0 -6L14 10Z" fill={i === 1 ? '#ffd6a5' : '#fff'} stroke="#d9c7a7" />
            </g>
          ))}

          {/* 駐車場 */}
          <rect x="60" y="490" width="296" height="116" rx="16" fill="#e2e4e9" />
          <rect x="72" y="502" width="272" height="92" fill="url(#map-stall)" opacity="0.9" />
          <Pill x={140} y={474} label="P1 普通車 128台" dark />
          <rect x="60" y="44" width="150" height="136" rx="16" fill="#e2e4e9" />
          <path d="M80 70L190 160M80 110L150 160M120 70L190 126M160 70L190 92" stroke="#fff" strokeWidth="2" />
          <Pill x={135} y={30} label="P2 大型車 12台" dark />
          <g transform="translate(640 586)" aria-hidden>
            <rect x="0" y="-14" width="132" height="28" rx="14" fill="#fff" stroke="#d2d2d7" strokeDasharray="4 3" />
            <text x="66" y="5" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6e6e73">臨時P3（土日祝）→</text>
          </g>

          {/* 建物 */}
          <Building x={410} y={196} w={250} h={160} label="物産館" />
          <Building x={680} y={150} w={140} h={170} label="食堂棟" />
          <Building x={258} y={172} w={92} h={80} label="体験棟" />
          <Building x={204} y={302} w={66} h={58} label="" />
          <rect x="844" y="214" width="116" height="80" rx="10" fill="#ecdcbf" />
          <rect x="844" y="214" width="116" height="80" rx="10" fill="url(#map-plank)" />
          <rect x="822" y="350" width="78" height="46" rx="12" fill="#c6e4f5" stroke="#d8c39f" strokeWidth="5" />

          <Trees
            points={[
              [96, 250, 18], [140, 232, 14], [118, 296, 16], [70, 330, 13], [168, 290, 11], [100, 380, 15], [150, 420, 12],
              [380, 150, 14], [350, 120, 11], [690, 360, 12], [730, 470, 14], [760, 440, 10], [250, 440, 12], [300, 300, 10],
            ]}
          />

          {/* 設備 */}
          {AMENITIES.filter((a) => a.map).map((a) => (
            <Pill key={a.id} x={a.map!.x} y={a.map!.y} label={a.map!.label} />
          ))}
          <g transform="translate(70 404)" aria-hidden>
            <circle r="16" fill="#fff" stroke="#d2d2d7" />
            <path d="M0 -10L5 4H-5Z" fill="#1d1d1f" />
            <text y="13" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1d1d1f">N</text>
          </g>

          {/* 店舗の番号 */}
          {SHOPS.map((s) => {
            const on = selected === s.id;
            const dim = !visible(s.kind);
            return (
              <g
                key={s.id}
                transform={`translate(${s.pos.x} ${s.pos.y})`}
                role="button"
                tabIndex={dim ? -1 : 0}
                aria-label={`${s.no} ${s.name}`}
                aria-pressed={on}
                onClick={() => !dim && select(s.id)}
                onKeyDown={(e) => {
                  if (!dim && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    select(s.id);
                  }
                }}
                className={`cursor-pointer outline-none transition-opacity [&:focus-visible>circle:last-of-type]:stroke-[#0071e3] ${dim ? 'pointer-events-none opacity-20' : ''}`}
              >
                {on && <circle r="26" fill={KINDS[s.kind].color} opacity="0.18" className="animate-ping [transform-box:fill-box] [transform-origin:center]" />}
                <circle r={on ? 20 : 15} fill={KINDS[s.kind].color} stroke="#fff" strokeWidth="3" className="transition-all duration-200" />
                <text y={on ? 5.5 : 4.5} textAnchor="middle" fontSize={on ? 15 : 13} fontWeight="700" fill="#fff" pointerEvents="none">
                  {s.no}
                </text>
              </g>
            );
          })}
        </svg>
        </div>
        <p className="px-5 pb-4 pt-1 text-[12px] text-ink-secondary">
          ※ 園内マップはイメージです。番号を選ぶと店舗の情報を表示します。<span className="md:hidden">地図は横にスクロールできます。</span>
        </p>
      </div>

      {/* 詳細と一覧 */}
      <div className="flex flex-col gap-5">
        {shop ? (
          <article className="overflow-hidden rounded-card bg-surface">
            {shop.photo ? (
              <Photo name={shop.photo} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[16/9]" />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-studio-gray">
                <Icon name={shop.icon} className="h-12 w-12 text-ink" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: KINDS[shop.kind].color }}>
                    {shop.no}・{KINDS[shop.kind].label}・{shop.area}
                  </p>
                  <h3 className="mt-1 text-[24px] font-semibold leading-[1.2] text-ink">{shop.name}</h3>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="閉じる" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-gray text-ink-secondary hover:text-ink">
                  ×
                </button>
              </div>
              <div className="mt-3">{now ? <StatusText status={shopStatus(shop, now)} /> : <StatusSkeleton />}</div>
              <dl className="mt-3 space-y-1 text-[14px]">
                <div className="flex gap-2">
                  <dt className="text-ink-secondary">本日</dt>
                  <dd className="text-ink">{now ? formatHours(hoursOn(shop, now.date)) : '—'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 text-ink-secondary">定休日</dt>
                  <dd className="text-ink">{closureLabel(shop)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[15px] leading-[1.55] text-ink-secondary">{shop.desc}</p>
              {shop.note && <p className="mt-2 text-[13px] text-ink-secondary">{shop.note}</p>}
            </div>
          </article>
        ) : (
          <div className="rounded-card bg-surface p-6">
            <p className="text-[21px] font-semibold text-ink">番号を選んでください。</p>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-secondary">地図や下の一覧から選ぶと、営業時間といまの状況を表示します。</p>
          </div>
        )}

        <ol className="grid grid-cols-1 gap-1 rounded-card bg-surface p-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {SHOPS.filter((s) => visible(s.kind)).map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => select(s.id)}
                aria-pressed={selected === s.id}
                className={`flex w-full items-center gap-2.5 rounded-ctl px-3 py-2 text-left text-[14px] transition-colors ${selected === s.id ? 'bg-canvas-gray font-semibold' : 'hover:bg-canvas-gray'}`}
              >
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: KINDS[s.kind].color }}>
                  {s.no}
                </span>
                <span className="truncate text-ink">{s.name}</span>
                {now && <span className={`ml-auto h-2 w-2 shrink-0 rounded-full ${shopStatus(s, now).open ? 'bg-[#30d158]' : 'bg-hairline'}`} aria-hidden />}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
