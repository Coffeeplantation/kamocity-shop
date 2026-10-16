import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icons';
import OpenBadge from '@/components/store/OpenBadge';
import HoursTable from '@/components/store/HoursTable';
import FacilityGrid from '@/components/store/FacilityGrid';
import EventCalendar from '@/components/store/EventCalendar';
import NewsList from '@/components/store/NewsList';
import StoreMap from '@/components/store/StoreMap';
import { ACCESS, FAQ, NEARBY, STORE } from '@/lib/storeInfo';
import { formatHours } from '@/lib/openStatus';

export const metadata: Metadata = {
  title: STORE.name,
  description: `${STORE.name}の営業時間、施設案内、イベントカレンダー、お知らせ、アクセス、周辺情報。`,
};

const SECTIONS = [
  { id: 'hours', label: '営業案内' },
  { id: 'facilities', label: '施設' },
  { id: 'events', label: 'イベント' },
  { id: 'news', label: 'お知らせ' },
  { id: 'access', label: 'アクセス' },
  { id: 'nearby', label: '周辺情報' },
  { id: 'faq', label: 'よくある質問' },
];

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <Reveal className="mb-8 md:mb-10">
      <h2 className="text-[32px] font-semibold leading-[1.125] text-ink md:text-[48px] md:leading-[1.08]">
        {title}
        {sub && <span className="text-ink-secondary">{sub}</span>}
      </h2>
    </Reveal>
  );
}

const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

export default function StoresPage() {
  const { parking } = STORE;
  return (
    <div className="bg-canvas-gray">
      {/* ヒーロー */}
      <section className="bg-studio-dark text-[#f5f5f7]">
        <div className={`${wrap} flex min-h-[min(72svh,720px)] flex-col justify-end pb-14 pt-24 md:pb-20`}>
          <Reveal>
            <p className="text-[17px] font-semibold text-[#a1a1a6] md:text-[21px]">Lumina Store・道の駅併設</p>
            <h1 className="mt-2 text-[48px] font-semibold leading-[1.05] md:text-[80px] 2xl:text-[96px]">{STORE.name}</h1>
            <p className="mt-3 max-w-[720px] text-[21px] leading-[1.3] text-[#d2d2d7] md:text-[28px]">{STORE.catchcopy}</p>
            <div className="mt-6">
              <OpenBadge tone="dark" />
            </div>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              {STORE.address}・TEL {STORE.tel}（{STORE.telNote}）
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#access" className="btn-primary">
                アクセス
              </a>
              <a
                href="#events"
                className="btn-secondary !border-accent-linkdark !text-accent-linkdark hover:!bg-accent-linkdark hover:!text-white"
              >
                イベントを見る
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ページ内ナビ */}
      <nav aria-label="ページ内リンク" className="sticky top-11 z-30 border-b border-black/10 bg-[rgba(250,250,252,0.85)] backdrop-blur-xl">
        <ul className={`${wrap} no-scrollbar flex h-[52px] items-center gap-6 overflow-x-auto text-[14px]`}>
          <li className="shrink-0 pr-2 font-semibold text-ink">{STORE.name}</li>
          {SECTIONS.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} className="text-ink-secondary transition-colors hover:text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 営業案内 */}
      <section id="hours" className="scroll-mt-28 py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle title="営業案内。" sub="いつでも、立ち寄りやすく。" />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[18px] bg-white p-6 md:p-8">
              <h3 className="text-[21px] font-semibold text-ink">店舗の営業時間</h3>
              <div className="mt-2">
                <OpenBadge />
              </div>
              <div className="mt-4">
                <HoursTable />
              </div>
              <p className="mt-4 text-[12px] leading-[1.5] text-ink-secondary">
                臨時休業日：{STORE.closedDates.map((d) => d.replaceAll('-', '/')).join('、')}
              </p>
              {Object.keys(STORE.specialHours).length > 0 && (
                <p className="mt-1 text-[12px] leading-[1.5] text-ink-secondary">
                  特別営業：
                  {Object.entries(STORE.specialHours)
                    .map(([d, h]) => `${d.replaceAll('-', '/')} ${formatHours(h)}`)
                    .join('、')}
                </p>
              )}
            </div>

            <div className="rounded-[18px] bg-white p-6 md:p-8">
              <h3 className="text-[21px] font-semibold text-ink">24時間ご利用いただけます</h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink-secondary">営業時間外や休業日も、次の施設は開いています。</p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {(
                  [
                    ['restroom', 'トイレ'],
                    ['ev', 'EV 急速充電'],
                    ['parking', '駐車場'],
                    ['wifi', '無料 Wi-Fi'],
                  ] as const
                ).map(([icon, label]) => (
                  <li key={icon} className="flex flex-col items-start gap-2 rounded-2xl bg-canvas-gray p-4">
                    <Icon name={icon} className="h-7 w-7 text-ink" />
                    <span className="text-[14px] font-semibold text-ink">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[18px] bg-white p-6 md:p-8">
              <h3 className="text-[21px] font-semibold text-ink">駐車場</h3>
              <p className="mt-2 text-[14px] text-ink-secondary">{parking.fee}</p>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ['普通車', parking.cars],
                  ['大型車', parking.large],
                  ['EV 充電', parking.ev],
                  ['身障者用', parking.accessible],
                ].map(([label, n]) => (
                  <div key={label} className="rounded-2xl bg-canvas-gray p-4">
                    <dt className="text-[12px] text-ink-secondary">{label}</dt>
                    <dd className="mt-1 text-[28px] font-semibold tabular-nums text-ink">
                      {n}
                      <span className="ml-0.5 text-[14px] font-normal text-ink-secondary">{label === 'EV 充電' ? '基' : '台'}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 施設案内 */}
      <section id="facilities" className="scroll-mt-28 pb-16 md:pb-24">
        <div className={wrap}>
          <SectionTitle title="施設案内。" sub="買う、休む、充電する。" />
          <FacilityGrid />
        </div>
      </section>

      {/* イベント */}
      <section id="events" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle title="イベントカレンダー。" sub="毎日、なにかが起きている。" />
          <div className="rounded-[24px] bg-canvas-gray p-3 sm:p-4">
            <EventCalendar />
          </div>
        </div>
      </section>

      {/* お知らせ */}
      <section id="news" className="scroll-mt-28 bg-white pb-16 md:pb-24">
        <div className={wrap}>
          <SectionTitle title="お知らせ。" />
          <NewsList limit={4} />
        </div>
      </section>

      {/* アクセス */}
      <section id="access" className="scroll-mt-28 py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle title="アクセス。" sub="車でも、電車でも。" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <StoreMap />
            <div className="rounded-[18px] bg-white p-6 md:p-8">
              <p className="text-[17px] font-semibold text-ink">{STORE.name}</p>
              <p className="mt-1 text-[14px] text-ink-secondary">{STORE.address}</p>
              <dl className="mt-6 space-y-5">
                {ACCESS.map((a) => (
                  <div key={a.mode}>
                    <dt className="text-[14px] font-semibold text-ink">{a.mode}</dt>
                    {a.lines.map((l) => (
                      <dd key={l} className="mt-1 text-[15px] leading-[1.5] text-ink-secondary">
                        {l}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
              <div className="mt-6 border-t border-black/10 pt-5 text-[14px] text-ink-secondary">
                お問い合わせ：<span className="text-ink">TEL {STORE.tel}</span>（{STORE.telNote}）
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 周辺情報 */}
      <section id="nearby" className="scroll-mt-28 pb-16 md:pb-24">
        <div className={wrap}>
          <SectionTitle title="周辺情報。" sub="寄り道の、その先へ。" />
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {NEARBY.map((n) => (
              <li key={n.name} className="overflow-hidden rounded-[18px] bg-white">
                <div
                  className="flex aspect-[16/10] items-end p-5"
                  style={{ background: `linear-gradient(135deg, ${n.color[0]}, ${n.color[1]})` }}
                >
                  <span className="rounded-full bg-white/25 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur">{n.kind}</span>
                </div>
                <div className="p-5">
                  <p className="text-[12px] text-ink-secondary">{n.distance}</p>
                  <h3 className="mt-1 text-[19px] font-semibold text-ink">{n.name}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.5] text-ink-secondary">{n.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle title="よくある質問。" />
          <div className="divide-y divide-black/10 border-y border-black/10">
            {FAQ.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[19px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-ink-tertiary transition-transform group-open:rotate-45" aria-hidden>
                    ＋
                  </span>
                </summary>
                <p className="max-w-[860px] pb-6 text-[17px] leading-[1.6] text-ink-secondary">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-[14px] text-ink-secondary">
            オンラインでのご購入は{' '}
            <Link href="/store" className="link-chevron">
              ストア ›
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
