import Link from 'next/link';
import { ReactNode } from 'react';
import Reveal from '@/components/Reveal';
import Phone3DLazy from '@/components/Phone3DLazy';
import BackgroundVideo from '@/components/BackgroundVideo';
import StoreRow from '@/components/StoreRow';
import StarlinkHeader from '@/components/starlink/StarlinkHeader';
import OrderForm from '@/components/starlink/OrderForm';
import { Buds, Card, Headset, Laptop, PhonePair, Tablet, Watch } from '@/components/Devices';

// starlink.com を模したストアのページ。中身はストアのトップ（/）と同じ製品で、
// 黒の全画面セクションに大きな英字の見出しと枠線のボタンを置く。テーマに関係なく常に黒地。

type Spec = { value: string; label: string };

function Specs({ items }: { items: Spec[] }) {
  return (
    <dl className="mt-8 grid max-w-[520px] grid-cols-3 gap-6 border-t border-white/20 pt-6">
      {items.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="text-[22px] font-semibold leading-none tracking-[0.02em] md:text-[28px]">{s.value}</dd>
          <dd className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/60">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

// 製品 1 つ分の全画面セクション。文字は左寄せ（flip で右寄せ）、製品の絵は反対側
function Panel({
  id,
  eyebrow,
  name,
  lead,
  price,
  query,
  learn,
  specs,
  glow = '#1d3b6e',
  flip = false,
  children,
}: {
  id: string;
  eyebrow?: string;
  name: string;
  lead: string;
  price: string;
  query: string;
  learn: string;
  specs?: Spec[];
  glow?: string;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative isolate flex min-h-[100svh] scroll-mt-0 items-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{ background: `radial-gradient(60% 55% at ${flip ? '28%' : '72%'} 55%, ${glow} 0%, transparent 70%)` }}
        aria-hidden
      />
      <div
        className={`mx-auto grid w-full max-w-[1600px] items-center gap-10 px-5 py-28 md:px-10 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}
      >
        <Reveal>
          {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">{eyebrow}</p>}
          <h2 className="sl-title mt-3">{name}</h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-white/85 md:text-[19px]">{lead}</p>
          <p className="mt-2 text-[13px] tracking-[0.06em] text-white/55">{price}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/store?q=${encodeURIComponent(query)}`} className="sl-btn sl-btn-solid">
              注文する
            </Link>
            <Link href={learn} className="sl-btn">
              詳しく見る
            </Link>
          </div>
          {specs && <Specs items={specs} />}
        </Reveal>
        <Reveal delay={1} className="reveal-zoom flex justify-center">
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export default function StarlinkPage() {
  return (
    <div className="sl-page bg-black text-white">
      <StarlinkHeader />

      {/* 1 画面目：Lumina Phone 17 Pro と、starlink.com の住所入力にあたる検索欄 */}
      <section id="phone" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(70% 60% at 70% 40%, #2a3550 0%, #05070c 60%, #000 100%)' }}
          aria-hidden
        />
        <div className="absolute inset-x-0 top-[12svh] -z-10 flex justify-center lg:justify-end lg:pr-[8vw]">
          <Phone3DLazy view="back" finish="natural" className="aspect-[4/5] h-[clamp(320px,58svh,640px)] opacity-90"
            fallback={<PhonePair id="sl-hero" className="h-full w-full" />}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-gradient-to-t from-black via-black/80 to-transparent" aria-hidden />
        <div className="mx-auto w-full max-w-[1600px] px-5 pb-14 md:px-10 md:pb-20">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">New · L19 Pro チップ</p>
            <h1 className="sl-title mt-3 !text-[clamp(40px,7vw,96px)]">Lumina Phone 17 Pro</h1>
            <p className="mt-3 text-[17px] text-white/85 md:text-[21px]">プロの、その先へ。3つの48MPカメラ。</p>
            <div className="mt-8">
              <OrderForm />
            </div>
            <p className="mt-4 text-[12px] text-white/55">
              下取りで最大¥80,000お得に。<sup>1</sup>{' '}
              <Link href="#trade" className="underline underline-offset-2 hover:text-white">
                詳しく
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 数字の帯 */}
      <section className="border-y border-white/10 bg-black">
        <dl className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-10 px-5 py-14 md:grid-cols-4 md:px-10">
          {[
            { v: '48MP', l: 'カメラ × 3' },
            { v: '18H', l: 'バッテリー²' },
            { v: '3%', l: 'キャッシュバック' },
            { v: '¥80,000', l: '最大下取り額¹' },
          ].map((s) => (
            <Reveal key={s.l} className="text-center">
              <dt className="sr-only">{s.l}</dt>
              <dd className="text-[36px] font-semibold leading-none tracking-[0.02em] md:text-[56px]">{s.v}</dd>
              <dd className="mt-3 text-[12px] uppercase tracking-[0.18em] text-white/60">{s.l}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <Panel
        id="phone-17"
        eyebrow="New"
        name="Lumina Phone 17"
        lead="あざやかに。しなやかに。"
        price="¥124,800（税込）から"
        query="Lumina Phone 17"
        learn="/#phone-17"
        glow="#0b3b74"
        specs={[
          { value: '6.3″', label: 'ディスプレイ' },
          { value: '48MP', label: 'メインカメラ' },
          { value: '5', label: 'カラー' },
        ]}
      >
        <Phone3DLazy
          view="front"
          finish="blue"
          className="aspect-[4/5] h-[clamp(300px,min(52svh,90vw),560px)]"
          fallback={
            <PhonePair
              id="sl-17"
              className="h-full w-full"
              frame={['#c9d8ea', '#7d94b3', '#d7e3f1']}
              back={['#a9c0de', '#8aa6cc']}
              wallpaper={['#04122b', '#0b3b74', '#36c3ff', '#2d5bff']}
            />
          }
        />
      </Panel>

      <Panel
        id="book"
        name="Lumina Book Air"
        lead="L5チップで、さらに薄く。さらに速く。"
        price="¥164,800（税込）から"
        query="Lumina Book"
        learn="/#book"
        glow="#3a3f4a"
        flip
        specs={[
          { value: 'L5', label: 'チップ' },
          { value: '18H', label: 'バッテリー²' },
          { value: '1.2KG', label: '重さ' },
        ]}
      >
        <Laptop id="sl-book" className="w-[min(92vw,720px)]" />
      </Panel>

      <Panel
        id="pad"
        name="Lumina Pad Pro"
        lead="とてつもなく薄い。とてつもなくパワフル。"
        price="¥168,800（税込）から"
        query="Lumina Pad"
        learn="/#pad"
        glow="#4b2a6b"
      >
        <Tablet id="sl-pad" className="w-[min(86vw,560px)]" />
      </Panel>

      <Panel
        id="watch"
        eyebrow="New"
        name="Lumina Watch"
        lead="健康を、もっと深く知る。"
        price="¥59,800（税込）から"
        query="Watch"
        learn="/#watch"
        glow="#1f4d3a"
        flip
      >
        <Watch id="sl-watch" className="h-[clamp(240px,40svh,420px)]" />
      </Panel>

      <Panel
        id="vision"
        name="Lumina Vision"
        lead="空間を、あなたのキャンバスに。"
        price="¥599,800（税込）から"
        query="Lumina Vision"
        learn="/#vision"
        glow="#5a3a1c"
      >
        <Headset id="sl-vision" className="w-[min(86vw,580px)]" />
      </Panel>

      <Panel
        id="buds"
        name="Lumina Buds Pro 3"
        lead="静けさを、もう一段上へ。"
        price="¥39,800（税込）"
        query="Lumina Buds"
        learn="/#buds"
        glow="#2b3a55"
        flip
      >
        <Buds id="sl-buds" className="w-[min(70vw,440px)]" />
      </Panel>

      <Panel
        id="card"
        name="Lumina Card"
        lead="毎日のお買い物に、最大3%のキャッシュバック。"
        price="年会費無料"
        query="Card"
        learn="/store"
        glow="#4a4a52"
      >
        <Card id="sl-card" className="w-[min(80vw,500px)]" />
      </Panel>

      <Panel
        id="trade"
        name="下取りプログラム"
        lead="今のデバイスを、新しいデバイスのクレジットに。"
        price="最大¥80,000¹"
        query=""
        learn="/store"
        glow="#24324a"
        flip
      >
        <div className="flex w-full items-end justify-center gap-[2%]">
          <Watch id="sl-trade-w" className="w-[18%] max-w-[110px]" band={['#3d7bff', '#2452c4']} />
          <PhonePair id="sl-trade-p" className="w-[56%] max-w-[380px]" frame={['#4b4b4f', '#2a2a2d', '#55555a']} back={['#3a3a3e', '#26262a']} />
        </div>
      </Panel>

      {/* 道の駅への入り口：画面いっぱいの動画 */}
      <section id="kamo" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black">
        <div className="absolute inset-0 -z-10">
          <BackgroundVideo name="produce" controlClassName="top-24 right-5 md:right-10" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/20" aria-hidden />
        <div className="mx-auto w-full max-w-[1600px] px-5 pb-16 md:px-10 md:pb-24">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">道の駅 Lumina 加茂</p>
            <h2 className="sl-title mt-3 max-w-[900px]">朝どれの果物と新米を、加茂の道の駅で。</h2>
            <div className="mt-8">
              <Link href="/stores" className="sl-btn">
                道の駅を見る
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ストア新着：既存のフリマ出品データ */}
      <section id="store" className="bg-black py-20 md:py-28">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-4 px-5 md:flex-row md:items-end md:px-10">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">Store</p>
            <h2 className="sl-title mt-3">ストア</h2>
            <p className="mt-3 text-[17px] text-white/75">欲しいものを、一番いい方法で。</p>
          </Reveal>
          <Link href="/store" className="sl-btn shrink-0">
            すべて見る
          </Link>
        </div>
        <StoreRow />
      </section>

      {/* starlink.com のような、黒地に小さな文字だけのフッター */}
      <footer className="border-t border-white/10 bg-black text-[12px] text-white/50">
        <div className="mx-auto max-w-[1600px] space-y-2 px-5 pt-10 md:px-10">
          <p>1. 下取り価格は対象デバイスの状態と機種によって異なります。表示価格は架空のものです。</p>
          <p>2. バッテリー駆動時間は使用状況や設定によって異なります。</p>
        </div>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="uppercase tracking-[0.14em]">Lumina © 2026</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-[0.14em]">
            <li>
              <Link href="/stores" className="hover:text-white">
                道の駅
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white">
                ストア
              </Link>
            </li>
            <li>
              <Link href="/store" className="hover:text-white">
                すべての商品
              </Link>
            </li>
            <li>
              <Link href="/furimas/new" className="hover:text-white">
                出品する
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
