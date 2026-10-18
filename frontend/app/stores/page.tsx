import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Phrases from '@/components/Phrases';
import Photo from '@/components/Photo';
import Icon from '@/components/Icons';
import LiveChips from '@/components/store/LiveChips';
import SectionNav from '@/components/store/SectionNav';
import Arrivals from '@/components/store/Arrivals';
import SeasonCalendar from '@/components/store/SeasonCalendar';
import ShopExplorer from '@/components/store/ShopExplorer';
import ShopHoursTable from '@/components/store/ShopHoursTable';
import SiteMap from '@/components/store/SiteMap';
import CrowdShuttle from '@/components/store/CrowdShuttle';
import EventCalendar from '@/components/store/EventCalendar';
import NewsList from '@/components/store/NewsList';
import LocalNews from '@/components/store/LocalNews';
import StoreMap from '@/components/store/StoreMap';
import ContactForm from '@/components/store/ContactForm';
import { PostedEventsProvider } from '@/components/store/PostedEvents';
import KamoNow from '@/components/kamo/KamoNow';
import { tokyoNow } from '@/lib/jpCalendar';
import { seasonOf, SOURCES } from '@/lib/kamo';
import { PHOTOS, photoPage, type PhotoKey } from '@/lib/photos';
import { fetchPostedEvents } from '@/lib/slack/postedEvents';
import { ACCESS, AMENITIES, DRIVE_TIMES, FAQ, KAMO_CRAFTS, NEARBY, STATION_FUNCTIONS, STORE } from '@/lib/storeInfo';

export const metadata: Metadata = {
  title: `道の駅 ${STORE.name}`,
  description: `新潟県加茂市をテーマにした架空の道の駅「${STORE.name}」。加茂の果物と新米の入荷、旬カレンダー、桐と加茂紙の店、営業時間、混雑予想、イベント、加茂市と新潟のニュース。`,
};

// Slack に投稿されたイベントとニュースを取り直すため、最長でも 5 分ごとに作り直す
export const revalidate = 300;

const NAV = [
  { id: 'arrivals', label: '入荷情報' },
  { id: 'season', label: '旬' },
  { id: 'shops', label: '買う・食べる・遊ぶ' },
  { id: 'hours', label: '営業時間' },
  { id: 'map', label: '園内マップ' },
  { id: 'crowd', label: '混雑・シャトル' },
  { id: 'events', label: 'イベント' },
  { id: 'news', label: 'お知らせ' },
  { id: 'access', label: 'アクセス' },
  { id: 'faq', label: 'よくある質問' },
];

const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-8 md:mb-12">
      {eyebrow && <p className="eyebrow mb-2 text-[14px] font-semibold md:text-[17px]">{eyebrow}</p>}
      <h2 className="text-[32px] font-semibold leading-[1.125] text-ink md:text-[48px] md:leading-[1.08] 2xl:text-[56px]">
        <Phrases text={title} />
        {sub && (
          <span className="text-ink-secondary">
            <Phrases text={sub} />
          </span>
        )}
      </h2>
    </Reveal>
  );
}

function Interlude({ photo, eyebrow, title, href, cta }: { photo: PhotoKey; eyebrow: string; title: string; href: string; cta: string }) {
  return (
    <section className="relative isolate flex min-h-[min(80svh,760px)] items-end overflow-hidden bg-black">
      <Photo name={photo} sizes="100vw" className="!absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
      <Reveal className={`${wrap} w-full pb-14 text-white md:pb-20`}>
        <p className="text-[17px] font-semibold text-white/80 md:text-[21px]">{eyebrow}</p>
        <p className="mt-2 max-w-[1100px] text-[36px] font-semibold leading-[1.1] md:text-[64px] 2xl:text-[80px]">
          <Phrases text={title} />
        </p>
        <a href={href} className="btn-primary mt-6">
          {cta}
        </a>
      </Reveal>
    </section>
  );
}

export default async function StoresPage() {
  const { parking } = STORE;
  const now = tokyoNow();
  const season = seasonOf(now.date.m);
  const posted = await fetchPostedEvents();

  return (
    <PostedEventsProvider events={posted}>
      <div className="bg-canvas-gray">
        {/* ページの先頭のナビ（サイトのヘッダーの代わり）。左端のロゴでストアへ */}
        <SectionNav title={STORE.name} items={NAV} home={{ href: '/store', label: 'ストアへ' }} />

        {/* ヒーロー：季節ごとの加茂 */}
        <section className="relative isolate flex min-h-[min(92svh,880px)] items-end overflow-hidden bg-black text-white">
          <Photo name={season.photo} sizes="100vw" priority className="!absolute inset-0 -z-10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/10" aria-hidden />
          <div className={`${wrap} w-full pb-10 pt-28 md:pb-14`}>
            <Reveal>
              <p className="text-[17px] font-semibold text-white/80 md:text-[21px]">
                新潟県加茂市の{STORE.kind}・{season.label}
              </p>
              <h1 className="mt-2 text-[56px] font-semibold leading-[1] md:text-[96px] 2xl:text-[120px]">{STORE.name}</h1>
              <p className="mt-4 max-w-[760px] text-[21px] leading-[1.3] text-white/90 md:text-[28px]">
                <Phrases text={STORE.catchcopy} />
              </p>
              <p className="mt-2 max-w-[760px] text-[15px] leading-[1.5] text-white/70 md:text-[17px]">{season.lead}</p>
            </Reveal>
            <Reveal delay={1} className="mt-8 md:mt-10">
              <LiveChips />
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-3.5">
              <a href="#map" className="btn-primary">
                園内マップ
              </a>
              <a href="#access" className="btn-secondary !border-white/70 !text-white hover:!bg-white hover:!text-ink">
                アクセス
              </a>
            </div>
          </div>
        </section>

        {/* 本日の入荷 */}
        <section id="arrivals" className="scroll-mt-16 py-16 md:py-28">
          <div className={wrap}>
            <SectionTitle eyebrow="本日の入荷状況" title="今朝、届いたもの。" sub="果樹園から、田んぼから。" />
            <Arrivals />
          </div>
        </section>

        {/* 旬 */}
        <section id="season" className="scroll-mt-16 pb-16 md:pb-28">
          <div className={wrap}>
            <SectionTitle eyebrow="旬カレンダー" title="夏は桃、秋は和梨、" sub="冬はル レクチエ。" />
            <SeasonCalendar />
          </div>
        </section>

        <Interlude photo="riceField" eyebrow="食べる" title="七谷の新米を、のっぺと一緒に。" href="#eat" cta="お食事を見る" />

        {/* 買う・食べる・遊ぶ */}
        <section id="shops" className="scroll-mt-16 py-16 md:py-28">
          <span id="buy" className="block scroll-mt-16" aria-hidden />
          <span id="eat" className="block scroll-mt-16" aria-hidden />
          <span id="play" className="block scroll-mt-16" aria-hidden />
          <span id="service" className="block scroll-mt-16" aria-hidden />
          <div className={wrap}>
            <SectionTitle eyebrow="買う・食べる・遊ぶ" title="14 の店と施設。" sub="桐と紙と、果物のまち。" />
            <ShopExplorer />
          </div>
        </section>

        {/* 加茂の手しごと・名産（実在） */}
        <section className="bg-studio-dark py-16 text-[#f5f5f7] md:py-28">
          <div className={wrap}>
            <Reveal className="mb-10 md:mb-14">
              <p className="eyebrow mb-2 text-[14px] font-semibold text-white/60 md:text-[17px]">加茂の手しごと・名産</p>
              <h2 className="text-[32px] font-semibold leading-[1.125] md:text-[48px] md:leading-[1.08]">
                <Phrases text="越後の小京都で、" />
                <span className="text-white/50">
                  <Phrases text="受け継がれてきたもの。" />
                </span>
              </h2>
            </Reveal>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {KAMO_CRAFTS.map((c) => (
                <li key={c.name} className="flex flex-col rounded-card border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <p className="text-[13px] font-semibold text-white/60">{c.kind}</p>
                  <p className="mt-1 text-[24px] font-semibold">{c.name}</p>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-white/80">{c.desc}</p>
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className="mt-4 text-[12px] text-white/50 hover:text-white hover:underline">
                    出典を見る ›
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 営業時間・設備 */}
        <section id="hours" className="scroll-mt-16 py-16 md:py-28">
          <div className={wrap}>
            <SectionTitle eyebrow="営業時間" title="店舗ごとの営業時間。" sub="今日の状況もひと目で。" />
            <ShopHoursTable />

            <h3 className="mb-5 mt-14 text-[24px] font-semibold text-ink md:text-[28px]">設備・サービス</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {AMENITIES.map((a) => (
                  <li key={a.id} className="flex flex-col rounded-tile bg-surface p-4">
                    <Icon name={a.icon} className="h-7 w-7 text-ink" />
                    <p className="mt-3 text-[15px] font-semibold text-ink">{a.label}</p>
                    <p className="mt-0.5 text-[12px] font-semibold text-[#1a7f37]">{a.hours}</p>
                    <p className="mt-1 text-[12px] leading-[1.5] text-ink-secondary">{a.desc}</p>
                  </li>
                ))}
              </ul>
              <div className="rounded-tile bg-surface p-5">
                <p className="text-[17px] font-semibold text-ink">駐車場</p>
                <p className="text-[13px] text-ink-secondary">{parking.fee}</p>
                <dl className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    ['普通車', parking.cars, '台'],
                    ['大型車', parking.large, '台'],
                    ['EV 充電', parking.ev, '基'],
                    ['身障者用', parking.accessible, '台'],
                  ].map(([label, n, unit]) => (
                    <div key={label} className="rounded-ctl bg-canvas-gray p-3">
                      <dt className="text-[12px] text-ink-secondary">{label}</dt>
                      <dd className="text-[24px] font-semibold tabular-nums text-ink">
                        {n}
                        <span className="ml-0.5 text-[12px] font-normal text-ink-secondary">{unit}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[12px] leading-[1.5] text-ink-secondary">土日祝は臨時駐車場 P3（{parking.temporary}台）とシャトルバスを運行します。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 園内マップ */}
        <section id="map" className="scroll-mt-16 pb-16 md:pb-28">
          <div className={wrap}>
            <SectionTitle eyebrow="園内マップ" title="どこに、なにがある？" />
            <SiteMap />
          </div>
        </section>

        {/* 混雑・シャトル */}
        <section id="crowd" className="scroll-mt-16 pb-16 md:pb-28">
          <div className={wrap}>
            <SectionTitle eyebrow="混雑予想・交通" title="混む前に、" sub="かしこく寄り道。" />
            <CrowdShuttle />
          </div>
        </section>

        <Interlude photo="mapleLeaves" eyebrow="遊ぶ・体験" title="紅葉の加茂山へ、寄り道。" href="#nearby" cta="周辺の見どころ" />

        {/* イベント（Slack に投稿されたイベントも表示） */}
        <section id="events" className="scroll-mt-16 py-16 md:py-28">
          <div className={wrap}>
            <SectionTitle eyebrow="イベントカレンダー" title="毎日、なにかが起きている。" />
            <div className="rounded-panel bg-canvas-deep p-2 sm:p-3">
              <EventCalendar />
            </div>
          </div>
        </section>

        {/* お知らせ・加茂と新潟のニュース */}
        <section id="news" className="scroll-mt-16 pb-16 md:pb-28">
          <div className={wrap}>
            <SectionTitle eyebrow="お知らせ" title="道の駅から。" sub="加茂と新潟から。" />
            <NewsList limit={5} />
            <h3 className="mb-5 mt-14 text-[24px] font-semibold text-ink md:text-[28px]">加茂市と新潟のニュース</h3>
            <LocalNews />
          </div>
        </section>

        {/* 道の駅の機能 */}
        <section className="bg-studio-dark py-16 text-[#f5f5f7] md:py-28">
          <div className={wrap}>
            <Reveal className="mb-10 md:mb-14">
              <p className="eyebrow mb-2 text-[14px] font-semibold text-white/60 md:text-[17px]">道の駅としての役割</p>
              <h2 className="text-[32px] font-semibold leading-[1.125] md:text-[48px] md:leading-[1.08]">
                <Phrases text="休む、知る、つながる。" />
                <span className="text-white/50">
                  <Phrases text="そして、守る。" />
                </span>
              </h2>
            </Reveal>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {STATION_FUNCTIONS.map((f) => (
                <li key={f.title} className="rounded-card border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <Icon name={f.icon} className="h-8 w-8 text-white" />
                  <p className="mt-5 text-[24px] font-semibold">{f.title}</p>
                  <p className="mt-1 text-[17px] text-white/80">{f.lead}</p>
                  <ul className="mt-4 space-y-1.5 text-[14px] text-white/60">
                    {f.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span aria-hidden>・</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* アクセス */}
        <section id="access" className="scroll-mt-16 py-16 md:py-28">
          <div className={wrap}>
            <SectionTitle eyebrow="アクセス" title="車でも、電車でも。" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <StoreMap />
              <div className="flex flex-col gap-5">
                <div className="rounded-tile bg-surface p-6 md:p-7">
                  <p className="text-[17px] font-semibold text-ink">{STORE.name}</p>
                  <p className="mt-1 text-[14px] text-ink-secondary">{STORE.address}</p>
                  <dl className="mt-5 space-y-4">
                    {ACCESS.map((a) => (
                      <div key={a.mode} className="flex gap-3">
                        <Icon name={a.icon} className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                        <div>
                          <dt className="text-[14px] font-semibold text-ink">{a.mode}</dt>
                          {a.lines.map((l) => (
                            <dd key={l} className="text-[14px] leading-[1.55] text-ink-secondary">
                              {l}
                            </dd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
                    <a href="#shuttle" className="link-chevron">
                      シャトルバスの時刻表 ›
                    </a>
                    <a href={SOURCES.bus} target="_blank" rel="noopener noreferrer" className="link-chevron">
                      かもんバス（加茂市） ›
                    </a>
                  </div>
                </div>
                <div className="rounded-tile bg-surface p-6 md:p-7">
                  <p className="text-[17px] font-semibold text-ink">車での所要時間の目安</p>
                  <ul className="mt-3 divide-y divide-line/[0.06]">
                    {DRIVE_TIMES.map((d) => (
                      <li key={d.from} className="flex justify-between py-2.5 text-[15px]">
                        <span className="text-ink">{d.from}から</span>
                        <span className="tabular-nums text-ink-secondary">約 {d.minutes} 分</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 加茂のいま・周辺の見どころ（実在） */}
        <section id="nearby" className="scroll-mt-16 pb-16 md:pb-28">
          <div className={wrap}>
            <SectionTitle eyebrow="加茂のいま" title="天気と、バスと、" sub="今月の加茂。" />
            <KamoNow base="/kamo" />
            <h3 className="mb-5 mt-14 text-[24px] font-semibold text-ink md:text-[28px]">周辺の見どころ</h3>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {NEARBY.map((n) => (
                <li key={n.name}>
                  <Link href={n.href} className="group block h-full overflow-hidden rounded-card bg-surface">
                    <div className="overflow-hidden">
                      <Photo name={n.photo} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="text-[12px] text-ink-secondary">
                        {n.kind}・{n.distance}
                      </p>
                      <h4 className="mt-1 text-[19px] font-semibold text-ink">{n.name}</h4>
                      <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-secondary">{n.desc}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/kamo" className="link-chevron mt-6 text-[17px]">
              加茂ローカルのページで、もっと見る ›
            </Link>
          </div>
        </section>

        {/* よくある質問・お問い合わせ */}
        <section id="faq" className="scroll-mt-16 bg-surface py-16 md:py-28">
          <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:gap-16`}>
            <div>
              <SectionTitle eyebrow="よくある質問" title="お困りですか？" />
              <div className="divide-y divide-line/10 border-y border-line/10">
                {FAQ.map((f) => (
                  <details key={f.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="text-ink-tertiary transition-transform group-open:rotate-45" aria-hidden>
                        ＋
                      </span>
                    </summary>
                    <p className="pb-6 text-[15px] leading-[1.7] text-ink-secondary">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <div id="contact" className="scroll-mt-16">
              <SectionTitle eyebrow="お問い合わせ" title="なんでも、どうぞ。" />
              <div className="rounded-panel bg-canvas-gray p-2">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* 架空の施設であることと、写真クレジット */}
        <div className={`${wrap} py-8 text-[12px] leading-[1.8] text-ink-secondary`}>
          <p>
            「{STORE.name}」はデザイン学習用の架空の道の駅です（加茂市に道の駅は実在しません）。店舗・営業時間・料金・シャトルバス・電話番号は架空のものです。加茂市の名所・特産・行事・かもんバスの時刻は実在の情報をもとにしていますが、お出かけの前に
            <a href={SOURCES.city} target="_blank" rel="noopener noreferrer" className="mx-0.5 underline hover:text-ink">
              加茂市の公式サイト
            </a>
            で最新の情報をご確認ください。写真は季節のイメージで、加茂市内で撮影されたものではありません。
          </p>
          <details className="mt-3">
            <summary className="cursor-pointer">写真クレジット（Unsplash・Pexels）</summary>
            <p className="mt-2">
              {Object.values(PHOTOS).map((p, i) => (
                <span key={p.id}>
                  {i > 0 && '、'}
                  <a href={photoPage(p)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {p.alt}（{p.by}）
                  </a>
                </span>
              ))}
            </p>
          </details>
          <p className="mt-3">
            オンラインでのご購入は{' '}
            <Link href="/store" className="link-chevron">
              ストア ›
            </Link>
          </p>
        </div>
      </div>
    </PostedEventsProvider>
  );
}
