import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Phrases from '@/components/Phrases';
import BackgroundVideo from '@/components/BackgroundVideo';
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
import { STORE } from '@/lib/storeInfo';

export const metadata: Metadata = {
  title: `道の駅 ${STORE.name}`,
  description: `新潟県加茂市をテーマにした架空の道の駅「${STORE.name}」。今日の入荷と旬、イベント、お知らせ、お店とアクセス。`,
};

// Slack に投稿されたイベントとニュースを取り直すため、最長でも 5 分ごとに作り直す
export const revalidate = 300;

// ヒーローと、今日の情報・お店・アクセスを詰めた 1 枚のパネルだけにして、1 画面半ほどで読み切れるようにしている
const NAV = [
  { id: 'today', label: '今日の加茂' },
  { id: 'shops', label: 'お店' },
  { id: 'access', label: 'アクセス' },
];


const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

export default async function StoresPage() {
  const season = seasonOf(tokyoNow().date.m);
  const posted = await fetchPostedEvents();

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

        {/* 季節の背景動画と、いまの営業・混雑・シャトル・イベント */}
        <section className="relative isolate flex min-h-[380px] items-end overflow-hidden bg-black text-white md:min-h-[420px]">
          <div className="absolute inset-0 -z-10">
            <BackgroundVideo name={season.video} className="animate-hero-zoom" controlClassName="top-5 right-4 md:right-8" />
          </div>
          <div className="video-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className={`${wrap} w-full pb-6 pt-20 md:pb-8`}>
            <Reveal>
              <p className="text-[15px] font-semibold text-white/80 md:text-[17px]">
                新潟県加茂市の{STORE.kind}・{season.label}
              </p>
              <h1 className="display mt-1 text-[clamp(2.75rem,8vw,6rem)]">{STORE.name}</h1>
              <p className="mt-2 max-w-[760px] text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-[1.4] text-white/90">
                <Phrases text={STORE.catchcopy} />
              </p>
            </Reveal>
            <Reveal delay={1} className="mt-5">
              <LiveChips />
            </Reveal>
          </div>
        </section>

        {/* 今日の入荷・イベント・お店・アクセスを 1 枚に */}
        <section id="today" className="bg-aurora relative isolate scroll-mt-14 py-6 md:py-8">
          <div className={wrap}>
            <Reveal className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[24px] font-semibold text-ink md:text-[28px]">今日の、Lumina 加茂。</h2>
              <OpenBadge />
            </Reveal>
            <Reveal delay={1}>
              <TodayBento />
            </Reveal>
          </div>
        </section>

        {/* 架空の施設であることと、写真・動画のクレジット */}
        <div className={`${wrap} border-t border-line/[0.08] py-4 text-[12px] leading-[1.7] text-ink-secondary`}>
          <details>
            <summary className="cursor-pointer">
              「{STORE.name}」はデザイン学習用の架空の道の駅です。詳しくは
              <Link href="/kamo" className="mx-0.5 underline hover:text-ink">
                加茂の天気・バス・行事
              </Link>
              へ。
            </summary>
            <p className="mt-2">
              加茂市に道の駅は実在しません。店舗・営業時間・料金・シャトルバスは架空のものです。加茂市の名所・特産の情報は実在のものをもとにしていますが、お出かけの前に
              <a href={SOURCES.city} target="_blank" rel="noopener noreferrer" className="mx-0.5 underline hover:text-ink">
                加茂市の公式サイト
              </a>
              でご確認ください。写真と動画は季節のイメージで、加茂市内で撮影されたものではありません。
            </p>
            <p className="mt-2">
              写真・動画（Unsplash・Pexels）：
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
