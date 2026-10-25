import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Phrases from '@/components/Phrases';
import Photo from '@/components/Photo';
import BackgroundVideo from '@/components/BackgroundVideo';
import Marquee from '@/components/Marquee';
import Icon from '@/components/Icons';
import LiveChips from '@/components/store/LiveChips';
import SectionNav from '@/components/store/SectionNav';
import OpenBadge from '@/components/store/OpenBadge';
import TodayBento from '@/components/store/TodayBento';
import { PostedEventsProvider } from '@/components/store/PostedEvents';
import { tokyoNow } from '@/lib/jpCalendar';
import { seasonOf, SOURCES } from '@/lib/kamo';
import { PHOTOS, photoPage } from '@/lib/photos';
import { VIDEOS } from '@/lib/videos';
import { fetchPostedEvents } from '@/lib/slack/postedEvents';
import { ACCESS, KINDS, SHOPS, STORE } from '@/lib/storeInfo';

export const metadata: Metadata = {
  title: `道の駅 ${STORE.name}`,
  description: `新潟県加茂市をテーマにした架空の道の駅「${STORE.name}」。今日の入荷と旬、イベント、お知らせ、お店とアクセス。`,
};

// Slack に投稿されたイベントとニュースを取り直すため、最長でも 5 分ごとに作り直す
export const revalidate = 300;

// スクロール 3 画面で読み切れるように、ヒーロー・今日の情報・お店とアクセスの 3 つにまとめている
const NAV = [
  { id: 'today', label: '今日の加茂' },
  { id: 'shops', label: 'お店' },
  { id: 'access', label: 'アクセス' },
];

const MARQUEE = ['桐たんす', '加茂紙', 'ル レクチエ', '和梨', '七谷の新米', 'のっぺ', '雪椿', '加茂山公園', '加茂川', '美人の湯'];

const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

export default async function StoresPage() {
  const { parking } = STORE;
  const season = seasonOf(tokyoNow().date.m);
  const posted = await fetchPostedEvents();
  const shops = SHOPS.filter((s) => s.photo);

  return (
    <PostedEventsProvider events={posted}>
      <div className="bg-canvas-gray">
        {/* ページの先頭のナビ（サイトのヘッダーの代わり）。左端はストアの 2 つの案（いつもの / Starlink 風）、右端はアカウント */}
        <SectionNav
          title={STORE.name}
          items={NAV}
          home={[
            { href: '/store', label: 'ストアへ' },
            { href: '/starlink', label: 'Starlink版へ' },
          ]}
        />

        {/* 1 画面目：季節の背景動画と、いまの営業・混雑・シャトル・イベント */}
        <section className="relative isolate flex min-h-[calc(100svh-52px)] items-end overflow-hidden bg-black text-white">
          <div className="absolute inset-0 -z-10">
            <BackgroundVideo name={season.video} className="animate-hero-zoom" controlClassName="top-5 right-4 md:right-8" />
          </div>
          <div className="video-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className={`${wrap} w-full pb-8 pt-28 md:pb-12`}>
            <Reveal>
              <p className="text-[15px] font-semibold text-white/80 md:text-[19px]">
                新潟県加茂市の{STORE.kind}・{season.label}
              </p>
              <h1 className="display mt-2 text-[clamp(3.5rem,11vw,8.5rem)]">{STORE.name}</h1>
              <p className="mt-4 max-w-[760px] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.35] text-white/90">
                <Phrases text={STORE.catchcopy} />
                <span className="text-white/60"> {season.lead}</span>
              </p>
            </Reveal>
            <Reveal delay={1} className="mt-8">
              <LiveChips />
            </Reveal>
          </div>
        </section>

        {/* 加茂の名物が流れる帯 */}
        <Marquee items={MARQUEE} className="bg-black py-4 text-[17px] font-semibold text-white/90 md:py-5 md:text-[22px]" />

        {/* 2 画面目：今日の入荷・旬・イベント・お知らせ */}
        <section id="today" className="bg-aurora relative isolate scroll-mt-14 py-14 md:py-20">
          <div className={wrap}>
            <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
              <h2 className="display text-[clamp(2rem,4.4vw,3.5rem)] text-ink">
                <Phrases text="今日の、" />
                <span className="text-ink-secondary">
                  <Phrases text="Lumina 加茂。" />
                </span>
              </h2>
              <OpenBadge />
            </Reveal>
            <Reveal delay={1}>
              <TodayBento />
            </Reveal>
          </div>
        </section>

        {/* 3 画面目：お店（横スクロール）と、アクセス・駐車場 */}
        <section id="shops" className="scroll-mt-14 pb-14 pt-4 md:pb-20">
          <div className={wrap}>
            <Reveal className="mb-6 md:mb-8">
              <h2 className="display text-[clamp(2rem,4.4vw,3.5rem)] text-ink">
                <Phrases text={`${SHOPS.length} の店と施設。`} />
                <span className="text-ink-secondary">
                  <Phrases text="桐と紙と、果物のまち。" />
                </span>
              </h2>
            </Reveal>
          </div>
          <ul className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16">
            {shops.map((s) => (
              <li key={s.id} className="w-[72vw] max-w-[300px] shrink-0 snap-start">
                <div className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-card bg-black p-5 text-white">
                  <Photo
                    name={s.photo!}
                    sizes="300px"
                    className="!absolute inset-0 -z-10"
                    imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />
                  <span className="mb-2 w-fit rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-white" style={{ background: KINDS[s.kind].color }}>
                    {KINDS[s.kind].label}
                  </span>
                  <p className="text-[21px] font-semibold leading-[1.2]">{s.name}</p>
                  <p className="mt-1 text-[14px] leading-[1.5] text-white/80">{s.lead}</p>
                  <div className="mt-2">
                    <OpenBadge shop={s.id} tone="dark" size="sm" showDetail={false} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div id="access" className={`${wrap} mt-3 grid scroll-mt-20 grid-cols-1 gap-3 md:grid-cols-3`}>
            {ACCESS.map((a) => (
              <div key={a.mode} className="rounded-card border border-line/[0.08] bg-surface p-5 sm:p-6">
                <p className="flex items-center gap-2 text-[17px] font-semibold text-ink">
                  <Icon name={a.icon} className="h-5 w-5" />
                  {a.mode}
                </p>
                {a.lines.map((l) => (
                  <p key={l} className="mt-1.5 text-[14px] leading-[1.6] text-ink-secondary">
                    {l}
                  </p>
                ))}
              </div>
            ))}
            <div className="rounded-card border border-line/[0.08] bg-surface p-5 sm:p-6 md:col-span-3 md:flex md:items-center md:justify-between md:gap-6">
              <p className="text-[15px] text-ink">
                <span className="font-semibold">駐車場</span>
                <span className="text-ink-secondary">
                  {' '}
                  普通車 {parking.cars} 台・大型車 {parking.large} 台・EV 充電 {parking.ev} 基・{parking.fee}
                </span>
              </p>
              <Link href="/kamo" className="link-chevron mt-2 block shrink-0 text-[15px] md:mt-0">
                加茂の天気・バス・行事 ›
              </Link>
            </div>
          </div>
        </section>

        {/* 架空の施設であることと、写真・動画のクレジット */}
        <div className={`${wrap} border-t border-line/[0.08] py-6 text-[12px] leading-[1.8] text-ink-secondary`}>
          <p>
            「{STORE.name}」はデザイン学習用の架空の道の駅です（加茂市に道の駅は実在しません）。店舗・営業時間・料金・シャトルバスは架空のものです。加茂市の名所・特産の情報は実在のものをもとにしていますが、お出かけの前に
            <a href={SOURCES.city} target="_blank" rel="noopener noreferrer" className="mx-0.5 underline hover:text-ink">
              加茂市の公式サイト
            </a>
            でご確認ください。写真と動画は季節のイメージで、加茂市内で撮影されたものではありません。
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer">写真・動画クレジット（Unsplash・Pexels）</summary>
            <p className="mt-2">
              {Object.values(PHOTOS).map((p, i) => (
                <span key={p.id}>
                  {i > 0 && '、'}
                  <a href={photoPage(p)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {p.alt}（{p.by}）
                  </a>
                </span>
              ))}
              {(['riceMist', 'riceWind', 'maple', 'snowForest'] as const)
                .map((k) => VIDEOS[k])
                .map((v) => (
                  <span key={v.file}>
                    、
                    <a href={`https://www.pexels.com/video/${v.pexelsId}/`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {v.alt}（Pexels の動画）
                    </a>
                  </span>
                ))}
            </p>
          </details>
        </div>
      </div>
    </PostedEventsProvider>
  );
}
