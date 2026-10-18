import Link from 'next/link';
import { ReactNode } from 'react';
import Reveal from '@/components/Reveal';
import PlayScene from '@/components/PlayScene';
import Phone3DLazy from '@/components/Phone3DLazy';
import PhoneHighlights from '@/components/PhoneHighlights';
import StoreRow from '@/components/StoreRow';
import ProductStrip from '@/components/ProductStrip';
import ProductCards from '@/components/ProductCards';
import TodayAtStore from '@/components/store/TodayAtStore';
import { Buds, Card, Headset, Laptop, LogoMark, PhonePair, Tablet, Watch } from '@/components/Devices';
import Photo from '@/components/Photo';
import Phrases from '@/components/Phrases';
import Icon from '@/components/Icons';
import LiveChips from '@/components/store/LiveChips';
import Arrivals from '@/components/store/Arrivals';
import NewsList from '@/components/store/NewsList';
import QuickMenu from '@/components/home/QuickMenu';
import ShopMosaic from '@/components/home/ShopMosaic';
import SeasonPicks from '@/components/home/SeasonPicks';
import WeekEvents from '@/components/home/WeekEvents';
import KamoNow from '@/components/kamo/KamoNow';
import BackgroundVideo from '@/components/BackgroundVideo';
import type { PhotoKey } from '@/lib/photos';
import type { VideoKey } from '@/lib/videos';
import { ACCESS, NEARBY, NEWS, STORE } from '@/lib/storeInfo';

const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

function SectionTitle({ eyebrow, title, sub, href, cta }: { eyebrow: string; title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <Reveal className="mb-8 flex flex-col items-start justify-between gap-2 md:mb-12 md:flex-row md:items-end">
      <div>
        <p className="eyebrow mb-2 text-[14px] font-semibold md:text-[17px]">{eyebrow}</p>
        <h2 className="text-[32px] font-semibold leading-[1.125] text-ink md:text-[48px] md:leading-[1.08]">
          <Phrases text={title} />
          {sub && (
            <span className="text-ink-secondary">
              <Phrases text={sub} />
            </span>
          )}
        </h2>
      </div>
      {href && (
        <Link href={href} className="link-chevron shrink-0 text-[17px]">
          {cta} ›
        </Link>
      )}
    </Reveal>
  );
}

// 全幅の写真で区切る、Apple の製品ページのような見せ場
function PhotoBand({ photo, video, eyebrow, title, href, cta }: { photo?: PhotoKey; video?: VideoKey; eyebrow: string; title: string; href: string; cta: string }) {
  return (
    <section className="relative isolate flex min-h-[min(80svh,760px)] items-end overflow-hidden bg-black">
      {video ? <BackgroundVideo name={video} className="-z-10" /> : photo && <Photo name={photo} sizes="100vw" className="!absolute inset-0 -z-10" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
      <Reveal className={`${wrap} w-full pb-14 text-white md:pb-20`}>
        <p className="text-[17px] font-semibold text-white/80 md:text-[21px]">{eyebrow}</p>
        <p className="mt-2 max-w-[1100px] text-[36px] font-semibold leading-[1.1] md:text-[64px] 2xl:text-[80px]">
          <Phrases text={title} />
        </p>
        <Link href={href} className="btn-primary mt-6">
          {cta}
        </Link>
      </Reveal>
    </section>
  );
}

type Theme = 'light' | 'gray' | 'dark';

const THEME: Record<Theme, { bg: string; title: string; sub: string; link: string }> = {
  light: { bg: 'bg-studio-light', title: 'text-ink', sub: 'text-ink', link: 'btn-secondary' },
  gray: { bg: 'bg-studio-gray', title: 'text-ink', sub: 'text-ink', link: 'btn-secondary' },
  dark: {
    bg: 'bg-studio-dark',
    title: 'text-[#f5f5f7]',
    sub: 'text-[#f5f5f7]',
    link: 'btn-secondary !border-accent-linkdark !text-accent-linkdark hover:!bg-accent-linkdark hover:!text-white',
  },
};

function CtaLinks({ theme, buy = '購入' }: { theme: Theme; buy?: string }) {
  return (
    <div className="mt-[18px] flex flex-wrap justify-center gap-3.5">
      <Link href="/store" className="btn-primary">
        さらに詳しく
      </Link>
      <Link href="/store" className={THEME[theme].link}>
        {buy}
      </Link>
    </div>
  );
}

function Hero({
  id,
  theme,
  name,
  headline,
  note,
  children,
}: {
  id: string;
  theme: Theme;
  name: ReactNode;
  headline: string;
  note?: string;
  children: ReactNode;
}) {
  const t = THEME[theme];
  return (
    <PlayScene as="section" id={id} duration={2600} threshold={0.35} className={`${t.bg} mb-3 scroll-mt-11 overflow-hidden text-center`}>
      <div className="mx-auto flex min-h-[500px] max-w-wide flex-col items-center px-4 pt-[44px] md:min-h-[620px] md:pt-[56px]">
        <Reveal>
          <h2 className={`${t.title} text-[34px] min-[375px]:text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] md:text-[48px] md:leading-[1.08] 2xl:text-[56px]`}>
            {name}
          </h2>
          <p className={`${t.sub} mt-1.5 text-[21px] leading-[1.19] md:text-[24px] md:leading-[1.17] 2xl:text-[28px]`}>{headline}</p>
          {note && <p className="mt-2 text-[14px] text-ink-tertiary">{note}</p>}
          <CtaLinks theme={theme} />
        </Reveal>
        <Reveal delay={1} className="reveal-zoom mt-auto flex w-full origin-bottom justify-center pt-8">
          {children}
        </Reveal>
      </div>
    </PlayScene>
  );
}

function Tile({
  id,
  theme,
  name,
  headline,
  children,
  wordmark,
}: {
  id?: string;
  theme: Theme;
  name: ReactNode;
  headline: string;
  children: ReactNode;
  wordmark?: boolean;
}) {
  const t = THEME[theme];
  return (
    <section id={id} className={`${t.bg} flex min-h-[490px] scroll-mt-11 md:min-h-[540px] md:pt-[52px] flex-col items-center overflow-hidden px-4 pt-[46px] text-center `}>
      <Reveal>
        <h3
          className={`${t.title} flex items-center justify-center gap-1.5 text-[28px] font-semibold leading-[1.125] tracking-[-0.01em] sm:text-[32px] md:text-[36px] md:leading-[1.1] 2xl:text-[40px]`}
        >
          {wordmark && <LogoMark className="h-[0.8em] w-[0.8em]" />}
          {name}
        </h3>
        <p className={`${t.sub} mt-1 text-[17px] leading-[1.24] md:text-[21px] md:leading-[1.19] 2xl:text-[24px]`}>{headline}</p>
        <CtaLinks theme={theme} />
      </Reveal>
      <Reveal delay={1} className="reveal-zoom mt-auto flex w-full origin-bottom justify-center pt-6">
        {children}
      </Reveal>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-surface">
      {/* ヘッダー直下の製品ナビ（左右にスクロール） */}
      <ProductStrip />

      {/* 製品カード（Apple Store の「最新モデル」風。1 枚ずつ見やすい大きさ） */}
      <ProductCards />

      {/* リボン */}
      <div className="bg-canvas-gray px-4 py-4 text-center text-[14px] leading-[1.43] text-ink">
        お使いのデバイスを下取りに出すと、新しい Lumina Phone が最大¥80,000お得に。
        <sup>1</sup>{' '}
        <Link href="/store" className="link-chevron">
          今すぐ購入 ›
        </Link>
      </div>

      {/* 重要なお知らせ（道の駅サイトの告知バー） */}
      {NEWS.filter((n) => n.important)
        .slice(0, 1)
        .map((n) => (
          <Link key={n.title} href="/stores#news" className="block border-y border-[#d70015]/15 bg-[#fff5f5] px-4 py-3 text-center text-[14px] leading-[1.43] text-ink hover:underline">
            <span className="mr-2 rounded-full border border-[#d70015] px-2 py-px text-[11px] font-semibold text-[#d70015]">重要</span>
            {n.title}
          </Link>
        ))}

      <Hero
        id="phone"
        theme="light"
        name="Lumina Phone 17 Pro"
        headline="プロの、その先へ。"
        note="L19 Pro チップ搭載。3つの48MPカメラ。"
      >
        <Phone3DLazy
          view="back"
          finish="natural"
          className="aspect-[4/5] h-[clamp(300px,min(46svh,90vw),500px)]"
          fallback={<PhonePair id="hero-pro" className="h-full w-full" />}
        />
      </Hero>

      {/* 目的から探す */}
      <section className="mb-3 bg-canvas-gray py-10 md:py-14">
        <div className={wrap}>
          <Reveal className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-[24px] font-semibold text-ink md:text-[32px]">
              {STORE.name}を、<span className="text-ink-secondary">目的から探す。</span>
            </h2>
            <Link href="/stores" className="link-chevron hidden shrink-0 text-[17px] md:inline">
              店舗情報 ›
            </Link>
          </Reveal>
          <QuickMenu />
        </div>
      </section>

      <PhoneHighlights />

      <Hero
        id="phone-17"
        theme="dark"
        name="Lumina Phone 17"
        headline="あざやかに。しなやかに。"
      >
        <Phone3DLazy
          view="front"
          finish="blue"
          className="aspect-[4/5] h-[clamp(300px,min(46svh,90vw),500px)]"
          fallback={
            <PhonePair
              id="hero-17"
              className="h-full w-full"
              frame={['#c9d8ea', '#7d94b3', '#d7e3f1']}
              back={['#a9c0de', '#8aa6cc']}
              wallpaper={['#04122b', '#0b3b74', '#36c3ff', '#2d5bff']}
            />
          }
        />
      </Hero>

      <Hero
        id="book"
        theme="gray"
        name="Lumina Book Air"
        headline="L5チップで、さらに薄く。さらに速く。"
        note="最大18時間のバッテリー駆動²"
      >
        <Laptop id="hero-book" className="w-[min(96vw,760px)] md:w-[clamp(560px,44vw,800px)]" />
      </Hero>

      {/* 2列タイル */}
      <div className="grid gap-3 px-3 pb-3 md:grid-cols-2">
        <Tile id="watch" theme="dark" name="WATCH" wordmark headline="健康を、もっと深く知る。">
          <Watch id="tile-watch" className="h-[clamp(240px,28vw,380px)]" />
        </Tile>
        <Tile id="pad" theme="gray" name="Lumina Pad Pro" headline="とてつもなく薄い。とてつもなくパワフル。">
          <Tablet id="tile-pad" className="w-[80%] max-w-[560px]" />
        </Tile>
        <Tile id="vision" theme="light" name="Lumina Vision" headline="空間を、あなたのキャンバスに。">
          <Headset id="tile-vision" className="w-[80%] max-w-[580px] pb-10" />
        </Tile>
        <Tile id="buds" theme="gray" name="Lumina Buds Pro 3" headline="静けさを、もう一段上へ。">
          <Buds id="tile-buds" className="w-[66%] max-w-[440px]" />
        </Tile>
        <Tile theme="light" name="Card" wordmark headline="毎日のお買い物に、最大3%のキャッシュバック。">
          <Card id="tile-card" className="w-[72%] max-w-[500px] pb-6" />
        </Tile>
        <Tile theme="dark" name="下取りプログラム" headline="今のデバイスを、新しいデバイスのクレジットに。">
          <div className="flex w-full items-end justify-center gap-[2%] pb-10">
            <Watch id="tile-trade-w" className="w-[18%] max-w-[110px]" band={['#3d7bff', '#2452c4']} />
            <PhonePair
              id="tile-trade-p"
              className="w-[56%] max-w-[380px]"
              frame={['#4b4b4f', '#2a2a2d', '#55555a']}
              back={['#3a3a3e', '#26262a']}
            />
          </div>
        </Tile>
      </div>

      {/* 道の駅の顔：全幅写真 + いまの情報 */}
      <section className="relative isolate flex min-h-[min(94svh,900px)] items-end overflow-hidden bg-black text-white">
        <BackgroundVideo name="lighthouseDrone" className="-z-10" controlClassName="right-4 top-4 md:right-10 md:top-6 xl:right-16" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/5" aria-hidden />
        <div className={`${wrap} w-full pb-10 pt-32 md:pb-14`}>
          <Reveal>
            <p className="text-[17px] font-semibold text-white/80 md:text-[21px]">道の駅・Lumina Store 併設</p>
            <h2 className="mt-2 text-[56px] font-semibold leading-[1] md:text-[96px] 2xl:text-[120px]">{STORE.name}</h2>
            <p className="mt-4 max-w-[760px] text-[21px] leading-[1.3] text-white/90 md:text-[28px]">
              <Phrases text={STORE.catchcopy} />
            </p>
          </Reveal>
          <Reveal delay={1} className="mt-8 md:mt-10">
            <LiveChips base="/stores" />
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3.5">
            <Link href="/stores" className="btn-primary">
              店舗情報を見る
            </Link>
            <Link href="/stores#map" className="btn-secondary !border-white/70 !text-white hover:!bg-white hover:!text-ink">
              園内マップ
            </Link>
          </div>
        </div>
      </section>

      {/* 店舗の今日 */}
      <section className="bg-canvas-gray pt-16 md:pt-24">
        <div className="mx-auto max-w-content px-4 md:px-10 xl:px-16">
          <Reveal className="mb-8 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
            <h2 className="text-[32px] font-semibold leading-[1.125] md:text-[48px] md:leading-[1.08]">
              店舗で、会いましょう。<span className="text-ink-secondary">今日の Lumina 湊町。</span>
            </h2>
            <Link href="/stores" className="link-chevron shrink-0 text-[17px]">
              店舗情報 ›
            </Link>
          </Reveal>
          <TodayAtStore />
        </div>
      </section>

      {/* 本日の入荷 */}
      <section className="bg-canvas-gray py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle eyebrow="本日の入荷状況" title="今朝、届いたもの。" sub="海から、畑から。" href="/stores#arrivals" cta="入荷情報" />
          <Arrivals />
        </div>
      </section>

      <PhotoBand video="produce" eyebrow="買う" title="畑から、その朝のうちに。" href="/stores#buy" cta="直売所を見る" />

      {/* 買う・食べる・遊ぶ */}
      <section className="bg-canvas-gray py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle eyebrow="買う・食べる・遊ぶ" title="14 の店と施設。" sub="一日いても、飽きない。" href="/stores#shops" cta="すべての店舗" />
          <ShopMosaic />
        </div>
      </section>

      <PhotoBand video="fishIce" eyebrow="食べる" title="港の朝獲れを、丼いっぱいに。" href="/stores#eat" cta="お食事を見る" />

      {/* 旬 */}
      <section className="overflow-hidden bg-canvas-gray py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle eyebrow="今月の旬" title="いちばんおいしい時に、" sub="いちばん近くで。" />
          <SeasonPicks />
        </div>
      </section>

      {/* イベント・お知らせ */}
      <section className="bg-canvas-gray pb-16 md:pb-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-10`}>
          <div>
            <SectionTitle eyebrow="今週のイベント" title="毎日、" sub="なにかが起きている。" />
            <WeekEvents />
          </div>
          <div>
            <SectionTitle eyebrow="お知らせ" title="最新の情報。" />
            <NewsList limit={5} />
          </div>
        </div>
      </section>

      <PhotoBand video="wavesAerial" eyebrow="遊ぶ・体験" title="海を見ながら、ひと休み。" href="/stores#play" cta="遊ぶ・体験を見る" />

      {/* 地元・加茂市のローカル情報 */}
      <section className="bg-canvas-gray py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle eyebrow="地元・新潟県加茂市" title="加茂のいまを、" sub="ひと目で。" href="/kamo" cta="加茂ローカルを見る" />
          <KamoNow base="/kamo" />
        </div>
      </section>

      {/* 周辺情報 */}
      <section className="bg-canvas-gray py-16 md:py-24">
        <div className={wrap}>
          <SectionTitle eyebrow="周辺情報" title="寄り道の、" sub="その先へ。" href="/stores#nearby" cta="周辺情報" />
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {NEARBY.map((n) => (
              <li key={n.name} className="group overflow-hidden rounded-card bg-surface">
                <div className="overflow-hidden">
                  <Photo name={n.photo} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-[12px] text-ink-secondary">
                    {n.kind}・{n.distance}
                  </p>
                  <h3 className="mt-1 text-[19px] font-semibold text-ink">{n.name}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-secondary">{n.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* アクセス・基本情報 */}
      <section className="bg-studio-dark py-16 text-[#f5f5f7] md:py-24">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]`}>
          <Reveal>
            <p className="eyebrow mb-2 text-[14px] font-semibold text-white/60 md:text-[17px]">アクセス・基本情報</p>
            <h2 className="text-[32px] font-semibold leading-[1.125] md:text-[48px] md:leading-[1.08]">
              <Phrases text="車でも、" />
              <span className="text-white/50">
                <Phrases text="電車でも。" />
              </span>
            </h2>
            <p className="mt-6 text-[17px] font-semibold">{STORE.name}</p>
            <p className="mt-1 text-[14px] text-white/70">{STORE.address}</p>
            <p className="mt-1 text-[14px] text-white/70">
              TEL {STORE.tel}（{STORE.telNote}）
            </p>
            <p className="mt-1 text-[14px] text-white/70">
              駐車場 普通車 {STORE.parking.cars} 台・大型車 {STORE.parking.large} 台・EV 充電 {STORE.parking.ev} 基（{STORE.parking.fee}）
            </p>
            <div className="mt-6 flex flex-wrap gap-3.5">
              <Link href="/stores#access" className="btn-primary">
                地図とアクセス
              </Link>
              <Link href="/stores#contact" className="btn-secondary !border-white/70 !text-white hover:!bg-white hover:!text-ink">
                お問い合わせ
              </Link>
            </div>
          </Reveal>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ACCESS.map((a) => (
              <li key={a.mode} className="rounded-card border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:[&:last-child:nth-child(odd)]:col-span-2">
                <Icon name={a.icon} className="h-7 w-7 text-white" />
                <p className="mt-4 text-[19px] font-semibold">{a.mode}</p>
                {a.lines.map((l) => (
                  <p key={l} className="mt-1 text-[14px] leading-[1.55] text-white/70">
                    {l}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ストア新着: 既存のフリマ出品データ */}
      <section className="bg-canvas-gray py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 md:px-10 xl:px-16">
          <Reveal className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
            <h2 className="text-[32px] font-semibold leading-[1.125] tracking-[-0.01em] md:text-[48px] md:leading-[1.08]">
              ストア。<span className="text-ink-secondary">欲しいものを、一番いい方法で。</span>
            </h2>
            <Link href="/store" className="link-chevron shrink-0 text-[17px]">
              すべて見る ›
            </Link>
          </Reveal>
        </div>
        <StoreRow />
      </section>
    </div>
  );
}
