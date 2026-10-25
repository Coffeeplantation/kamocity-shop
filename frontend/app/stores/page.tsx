import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Phrases from '@/components/Phrases';
import Photo from '@/components/Photo';
import BackgroundVideo from '@/components/BackgroundVideo';
import Icon from '@/components/Icons';
import LiveChips from '@/components/store/LiveChips';
import SectionNav from '@/components/store/SectionNav';
import OpenBadge from '@/components/store/OpenBadge';
import EventFeed from '@/components/store/EventFeed';
import EventCalendar from '@/components/store/EventCalendar';
import LinePhotos from '@/components/store/LinePhotos';
import KamoMap from '@/components/store/KamoMap';
import LocalNews from '@/components/store/LocalNews';
import ShareBar from '@/components/store/ShareBar';
import KamoEvents from '@/components/kamo/KamoEvents';
import { PostedEventsProvider } from '@/components/store/PostedEvents';
import { tokyoNow } from '@/lib/jpCalendar';
import { KAMO_SPOTS, mapUrl, seasonOf, SOURCES } from '@/lib/kamo';
import { PHOTOS, photoPage } from '@/lib/photos';
import { VIDEOS } from '@/lib/videos';
import { fetchPostedEvents } from '@/lib/slack/postedEvents';
import { EVENT_POST_TEMPLATE } from '@/lib/slack/eventPost';
import { eventsJsonLd } from '@/lib/seo';
import { ACCESS, KINDS, SHOPS, STORE } from '@/lib/storeInfo';

const description = `新潟県加茂市の道の駅「${STORE.name}」。アメリカンフラワー教室の開催案内を中心に、イベントのカレンダー、館内の写真、加茂の祭りやニュース、地図とアクセス。`;

export const metadata: Metadata = {
  title: { absolute: `アメリカンフラワー教室とイベント｜道の駅 ${STORE.name}` },
  description,
  alternates: { canonical: '/stores' },
  // LINE・X・Facebook でシェアしたときの見え方
  openGraph: { title: `道の駅 ${STORE.name}｜アメリカンフラワー教室とイベント`, description, url: '/stores', type: 'website', locale: 'ja_JP', siteName: `道の駅 ${STORE.name}` },
  twitter: { card: 'summary_large_image', title: `道の駅 ${STORE.name}`, description },
};

// Slack・LINE に投稿されたイベントを取り直すため、最長でも 5 分ごとに作り直す
export const revalidate = 300;

// 上段：道の駅のイベント（更新履歴とカレンダー）と写真がこのサイトの中心。下段：地域のイベント・ニュース・地域の情報・アクセス・施設
const NAV = [
  { id: 'events', label: 'イベント' },
  { id: 'photos', label: '写真' },
  { id: 'festivals', label: '地域のイベント' },
  { id: 'news', label: 'ニュース' },
  { id: 'around', label: '地域の情報' },
  { id: 'access', label: 'アクセス' },
  { id: 'shops', label: '施設' },
];

// 見出しと本文の大きさ・幅は、読みやすさで知られるサイト（Apple・Airbnb など）にならい、
// 本文は 1 行 40 字前後（max-w-[720px]）、セクションの上下は広めにとって区切りをはっきりさせる
const h2 = 'display text-[clamp(1.875rem,4vw,3rem)] text-ink';
const lead = 'mt-3 max-w-[720px] text-[17px] leading-[1.7] text-ink-secondary';
const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

function Heading({ main, sub, text }: { main: string; sub: string; text?: string }) {
  return (
    <Reveal className="mb-6 md:mb-8">
      <h2 className={h2}>
        <Phrases text={main} />
        <span className="text-ink-secondary">
          <Phrases text={sub} />
        </span>
      </h2>
      {text && <p className={lead}>{text}</p>}
    </Reveal>
  );
}

export default async function StoresPage() {
  const { parking } = STORE;
  const season = seasonOf(tokyoNow().date.m);
  const posted = await fetchPostedEvents();
  const shops = SHOPS.filter((s) => s.photo);

  return (
    <PostedEventsProvider events={posted}>
      {/* Google の検索結果にイベントとして出すための構造化データ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventsJsonLd(posted) }} />
      <div className="bg-canvas-gray">
        {/* ページの先頭のナビ（サイトのヘッダーの代わり）。左端はストアページへ（ストアページからは「← メインページ」で戻る）、右端はアカウント */}
        <SectionNav title={STORE.name} items={NAV} home={[{ href: '/store', label: 'ストア →' }]} />

        {/* 季節の背景動画と、いまの営業・混雑・シャトル・イベント。イベントがすぐ見えるよう、画面の 2/3 ほどの高さにしている */}
        <section className="relative isolate flex min-h-[64svh] items-end overflow-hidden bg-black text-white">
          <div className="absolute inset-0 -z-10">
            <BackgroundVideo name={season.video} className="animate-hero-zoom" controlClassName="top-5 right-4 md:right-8" />
          </div>
          <div className="video-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className={`${wrap} w-full pb-8 pt-24 md:pb-10`}>
            <Reveal>
              <p className="text-[15px] font-semibold text-white/80 md:text-[17px]">
                新潟県加茂市の{STORE.kind}・{season.label}
              </p>
              <h1 className="display mt-2 text-[clamp(3rem,9vw,7rem)]">{STORE.name}</h1>
              <p className="mt-3 max-w-[720px] text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.4] text-white/90">
                <Phrases text="アメリカンフラワー教室と、季節のイベント。" />
                <span className="text-white/60"> {season.lead}</span>
              </p>
            </Reveal>
            <Reveal delay={1} className="mt-6">
              <LiveChips />
            </Reveal>
          </div>
        </section>

        {/* 道の駅のイベント：左に更新履歴（次回の教室が先頭）、右にカレンダー。地域の祭りや見頃は下の「地域のイベント」に分けている */}
        <section id="events" className="scroll-mt-14 py-12 md:py-16">
          <div className={wrap}>
            <Heading main="教室と、" sub="イベント。" text={`${STORE.name}で開くアメリカンフラワー教室・体験・マルシェ。新しいお知らせから順に載せています。気になるイベントを押すと、参加の案内が開きます。`} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <Reveal delay={1} className="lg:col-span-7">
                <EventFeed />
              </Reveal>
              <Reveal delay={2} className="lg:col-span-5">
                <div className="lg:sticky lg:top-20">
                  <EventCalendar compact />
                </div>
              </Reveal>
            </div>
            <ShareBar className="mt-6" />
            <details className="mt-4 text-[13px] text-ink-secondary">
              <summary className="cursor-pointer">スタッフの方へ：Slack・LINE からイベントを載せる</summary>
              <p className="mt-2 leading-[1.7]">
                Slack のイベント用チャンネル、または LINE 公式アカウントに、下の形で送るとカレンダーと更新履歴に載ります（LINE で外すときは「イベント取り消し」）。
              </p>
              <pre className="mt-2 w-fit whitespace-pre-wrap rounded-chip bg-surface px-4 py-3 font-sans text-[13px] leading-[1.7] text-ink">{EVENT_POST_TEMPLATE}</pre>
            </details>
          </div>
        </section>

        {/* LINE で届き、管理者が承認した写真。並べ方と 1 枚ずつの見せ方は管理画面（/admin/photos）で選ぶ */}
        <section id="photos" className="scroll-mt-14 pb-12 md:pb-16">
          <div className={wrap}>
            <Heading main="いまの、" sub="館内から。" text="教室の作品や、季節の館内の様子。LINE で届いた写真を、確認してから載せています。" />
            <LinePhotos space="stores" heading={false} emptyNote="LINE で届いた写真が、確認のあとここに並びます。" />
          </div>
        </section>

        {/* ---- 下段：地域のイベント・ニュース・地域の情報 ---- */}

        {/* 地域のイベント（鯉のぼり・雪椿まつり・リス園の開園など、まちの行事と見頃）。道の駅で開くイベント（上）とは分けている */}
        <section id="festivals" className="scroll-mt-14 bg-surface/40 py-12 md:py-16">
          <div className={wrap}>
            <Heading main="地域の、" sub="イベント。" text="祭り・見頃・リス園の開園など、加茂のまちの行事。道の駅で開くイベントは、ページの上の「教室と、イベント。」へ。" />
            <KamoEvents />
          </div>
        </section>

        {/* 加茂市・新潟県のニュースと、季節（果物・お米）のたより。事件・事故の見出しは載せない */}
        <section id="news" className="scroll-mt-14 py-12 md:py-16">
          <div className={wrap}>
            <Heading main="加茂と新潟の、" sub="ニュース。" />
            <LocalNews group="local" limit={5} note={false} />
            <h3 className="mb-4 mt-10 text-[24px] font-semibold text-ink md:text-[28px]">
              季節のたより。<span className="text-ink-secondary">果物と、お米。</span>
            </h3>
            <LocalNews group="season" limit={5} />
          </div>
        </section>

        {/* 地域の情報（周辺の見どころ） */}
        <section id="around" className="scroll-mt-14 pb-12 md:pb-16">
          <div className={wrap}>
            <Heading main="加茂の、" sub="見どころ。" />
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {KAMO_SPOTS.map((s) => (
                <li key={s.name} className="flex flex-col overflow-hidden rounded-card bg-surface">
                  {s.photo && <Photo name={s.photo} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/9]" />}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[12px] font-semibold text-ink-secondary">{s.kind}</p>
                    <p className="mt-1 text-[19px] font-semibold text-ink">{s.name}</p>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-secondary">{s.desc}</p>
                    {s.access && <p className="mt-2 text-[13px] text-ink">{s.access}</p>}
                    <a href={mapUrl(s.map)} target="_blank" rel="noopener noreferrer" className="link-chevron mt-auto pt-3 text-[13px]">
                      地図で見る ›
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* アクセス：加茂駅の東口から穀町商店街・加茂山公園までの地図と、車・電車・バス・駐車場 */}
        <section id="access" className="scroll-mt-14 pb-12 md:pb-16">
          <div className={wrap}>
            <Heading main="地図と、" sub="アクセス。" />
            <KamoMap />
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
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
          </div>
        </section>

        {/* 施設の情報（館内のお店と施設。横スクロール） */}
        <section id="shops" className="scroll-mt-14 pb-12 md:pb-16">
          <div className={wrap}>
            <Heading main={`${SHOPS.length} の店と施設。`} sub="桐と紙と、果物のまち。" />
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
                  {/* 道の駅全体と同じ状況（ヒーローに出ている）なら出さず、定休日などの違いだけ出す */}
                  <div className="mt-2 empty:hidden">
                    <OpenBadge shop={s.id} tone="dark" size="sm" showDetail={false} onlyIfDifferent />
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
