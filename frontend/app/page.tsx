import Link from 'next/link';
import { ReactNode } from 'react';
import Reveal from '@/components/Reveal';
import PlayScene from '@/components/PlayScene';
import Phone3DLazy from '@/components/Phone3DLazy';
import PhoneHighlights from '@/components/PhoneHighlights';
import StoreRow from '@/components/StoreRow';
import TodayAtStore from '@/components/store/TodayAtStore';
import { Buds, Card, Headset, Laptop, LogoMark, PhonePair, Tablet, Watch } from '@/components/Devices';

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
      <div className="mx-auto flex min-h-[580px] max-w-wide flex-col items-center px-4 pt-[52px] md:min-h-[calc(100svh-44px)] md:pt-[8vh]">
        <Reveal>
          <h2 className={`${t.title} text-[34px] min-[375px]:text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] md:text-[56px] md:leading-[1.07] 2xl:text-[72px]`}>
            {name}
          </h2>
          <p className={`${t.sub} mt-1.5 text-[21px] leading-[1.19] md:text-[28px] md:leading-[1.14] 2xl:text-[34px]`}>{headline}</p>
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
    <section id={id} className={`${t.bg} flex min-h-[490px] scroll-mt-11 md:min-h-[min(calc(100svh-44px),72vw)] md:pt-[7vh] flex-col items-center overflow-hidden px-4 pt-[46px] text-center `}>
      <Reveal>
        <h3
          className={`${t.title} flex items-center justify-center gap-1.5 text-[28px] font-semibold leading-[1.125] tracking-[-0.01em] sm:text-[32px] md:text-[40px] md:leading-[1.1] 2xl:text-[48px]`}
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
    <div className="bg-white">
      {/* リボン */}
      <div className="bg-canvas-gray px-4 py-4 text-center text-[14px] leading-[1.43] text-ink">
        お使いのデバイスを下取りに出すと、新しい Lumina Phone が最大¥80,000お得に。
        <sup>1</sup>{' '}
        <Link href="/store" className="link-chevron">
          今すぐ購入 ›
        </Link>
      </div>

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
          className="aspect-[4/5] h-[clamp(340px,min(56svh,115vw),780px)]"
          fallback={<PhonePair id="hero-pro" className="h-full w-full" />}
        />
      </Hero>

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
          className="aspect-[4/5] h-[clamp(340px,min(56svh,115vw),780px)]"
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
        <Laptop id="hero-book" className="w-[min(96vw,760px)] md:w-[clamp(760px,62vw,1180px)]" />
      </Hero>

      {/* 2列タイル */}
      <div className="grid gap-3 px-3 pb-3 md:grid-cols-2">
        <Tile id="watch" theme="dark" name="WATCH" wordmark headline="健康を、もっと深く知る。">
          <Watch id="tile-watch" className="h-[clamp(260px,34vw,520px)] md:h-[clamp(300px,30vw,520px)]" />
        </Tile>
        <Tile id="pad" theme="gray" name="Lumina Pad Pro" headline="とてつもなく薄い。とてつもなくパワフル。">
          <Tablet id="tile-pad" className="w-[88%] max-w-[720px]" />
        </Tile>
        <Tile id="vision" theme="light" name="Lumina Vision" headline="空間を、あなたのキャンバスに。">
          <Headset id="tile-vision" className="w-[90%] max-w-[760px] pb-10" />
        </Tile>
        <Tile id="buds" theme="gray" name="Lumina Buds Pro 3" headline="静けさを、もう一段上へ。">
          <Buds id="tile-buds" className="w-[78%] max-w-[560px]" />
        </Tile>
        <Tile theme="light" name="Card" wordmark headline="毎日のお買い物に、最大3%のキャッシュバック。">
          <Card id="tile-card" className="w-[82%] max-w-[640px] pb-6" />
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
