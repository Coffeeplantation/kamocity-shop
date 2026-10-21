import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import Phrases from '@/components/Phrases';
import SectionNav from '@/components/store/SectionNav';
import KamoNow from '@/components/kamo/KamoNow';
import BijinBus from '@/components/kamo/BijinBus';
import KamoEvents from '@/components/kamo/KamoEvents';
import KamoHero from '@/components/kamo/KamoHero';
import KamoWeek from '@/components/kamo/KamoWeek';
import KamoTimeline from '@/components/kamo/KamoTimeline';
import BijinStatus from '@/components/kamo/BijinStatus';
import Photo from '@/components/Photo';
import { KAMO, KAMO_MEIBUTSU, KAMO_SPOTS, KAMO_TRIVIA, mapUrl, SOURCES } from '@/lib/kamo';

export const metadata: Metadata = {
  title: '加茂ローカル',
  description: '新潟県加茂市の今日の天気、美人の湯行きバスの時刻、今月の行事、見どころ、名物、豆知識。',
};

const NAV = [
  { id: 'now', label: 'いまの加茂' },
  { id: 'bus', label: '美人の湯バス' },
  { id: 'season', label: 'これからの加茂' },
  { id: 'events', label: '行事カレンダー' },
  { id: 'spots', label: '見どころ' },
  { id: 'meibutsu', label: '名物' },
  { id: 'trivia', label: '豆知識' },
  { id: 'info', label: '問い合わせ' },
];

const wrap = 'mx-auto max-w-content px-4 md:px-10 xl:px-16';

const SPOT_ICON: Record<string, string> = { 日帰り温泉: '♨️', 神社: '⛩️', '甘味・茶屋': '🍵' };

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-8 md:mb-12">
      <p className="eyebrow mb-2 text-[14px] font-semibold md:text-[17px]">{eyebrow}</p>
      <h2 className="text-[32px] font-semibold leading-[1.125] text-ink md:text-[48px] md:leading-[1.08]">
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

export default function KamoPage() {
  return (
    <div className="bg-canvas-gray">
      <KamoHero />

      <SectionNav title="加茂ローカル" items={NAV} />

      <section id="now" className="scroll-mt-28 py-14 md:py-20">
        <div className={wrap}>
          <SectionTitle eyebrow="いまの加茂" title="今日の加茂市。" sub="天気も、バスも、行事も。" />
          <KamoNow />
          <h3 className="mb-4 mt-10 text-[21px] font-semibold text-ink md:text-[24px]">7日間の天気（加茂市）</h3>
          <KamoWeek />
          <p className="mt-3 text-[12px] text-ink-secondary">予報：Open-Meteo（気象モデルによる自動予報）。</p>
        </div>
      </section>

      <section id="bus" className="scroll-mt-28 pb-14 md:pb-20">
        <div className={wrap}>
          <SectionTitle eyebrow="美人の湯へのバス" title="加茂駅から、温泉まで 17 分。" sub="かもんバス 七谷線。" />
          <BijinBus />
        </div>
      </section>

      <section id="season" className="scroll-mt-28 overflow-hidden pb-14 md:pb-20">
        <div className={wrap}>
          <SectionTitle eyebrow="これからの加茂" title="この先半年、" sub="加茂で見られるもの。" />
          <KamoTimeline />
        </div>
      </section>

      <section id="events" className="scroll-mt-28 pb-14 md:pb-20">
        <div className={wrap}>
          <SectionTitle eyebrow="加茂の行事カレンダー" title="その月の加茂を、" sub="見逃さない。" />
          <KamoEvents />
        </div>
      </section>

      <section id="spots" className="scroll-mt-28 pb-14 md:pb-20">
        <div className={wrap}>
          <SectionTitle eyebrow="見どころ" title="歩いて、浸かって、" sub="ひと休み。" />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {KAMO_SPOTS.map((s) => (
              <li key={s.name} className="group flex flex-col overflow-hidden rounded-card bg-surface">
                {s.photo ? (
                  <div className="overflow-hidden">
                    <Photo name={s.photo} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="aspect-[16/9]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  // 写真がない場所は、種類のアイコンで見出しをつくる
                  <div className="bg-studio-dark flex aspect-[16/9] flex-col items-center justify-center gap-2 text-white">
                    <span className="text-[56px] leading-none transition-transform duration-700 group-hover:scale-110" aria-hidden>
                      {SPOT_ICON[s.kind] ?? '📍'}
                    </span>
                    <span className="text-[15px] font-semibold text-white/80">{s.name}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                <p className="text-[12px] text-ink-secondary">{s.kind}</p>
                <h3 className="mt-1 text-[22px] font-semibold text-ink">{s.name}</h3>
                {s.name.includes('美人の湯') && (
                  <p className="mt-1.5">
                    <BijinStatus />
                  </p>
                )}
                <p className="mt-2 text-[15px] leading-[1.65] text-ink-secondary">{s.desc}</p>
                <ul className="mt-3 space-y-1 text-[14px] text-ink">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-accent" aria-hidden>
                        ●
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                {s.access && <p className="mt-3 text-[13px] text-ink-secondary">アクセス：{s.access}</p>}
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-4 text-[13px]">
                  <a href={mapUrl(s.map)} target="_blank" rel="noopener noreferrer" className="link-chevron">
                    地図で見る ›
                  </a>
                  <a href={s.source} target="_blank" rel="noopener noreferrer" className="link-chevron">
                    くわしい情報 ›
                  </a>
                </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="meibutsu" className="scroll-mt-28 bg-studio-dark py-14 text-[#f5f5f7] md:py-20">
        <div className={wrap}>
          <Reveal className="mb-8 md:mb-12">
            <p className="eyebrow mb-2 text-[14px] font-semibold text-white/60 md:text-[17px]">名物・おみやげ</p>
            <h2 className="text-[32px] font-semibold leading-[1.125] md:text-[48px] md:leading-[1.08]">
              <Phrases text="加茂の手しごと、" />
              <span className="text-white/50">
                <Phrases text="加茂の味。" />
              </span>
            </h2>
          </Reveal>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {KAMO_MEIBUTSU.map((m) => (
              <li key={m.name} className="flex flex-col rounded-card border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <p className="text-[12px] text-white/60">{m.kind}</p>
                <p className="mt-1 text-[21px] font-semibold">{m.name}</p>
                <p className="mt-2 text-[14px] leading-[1.65] text-white/70">{m.desc}</p>
                <a href={m.source} target="_blank" rel="noopener noreferrer" className="link-chevron mt-auto pt-4 text-[13px] !text-accent-linkdark">
                  出典 ›
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="trivia" className="scroll-mt-28 py-14 md:py-20">
        <div className={wrap}>
          <SectionTitle eyebrow="加茂の豆知識" title="知ると、" sub="もっと好きになる。" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {KAMO_TRIVIA.map((t, i) => (
              <li key={t.title} className="rounded-card bg-surface p-6">
                <p className="text-[40px] font-semibold leading-none text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-4 text-[19px] font-semibold text-ink">{t.title}</p>
                <p className="mt-2 text-[14px] leading-[1.65] text-ink-secondary">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="info" className="scroll-mt-28 pb-16 md:pb-24">
        <div className={`${wrap} grid gap-4 lg:grid-cols-2`}>
          <div className="rounded-card bg-surface p-6 md:p-8">
            <p className="text-[17px] font-semibold text-ink">{KAMO.cityHall.name}</p>
            <p className="mt-1 text-[14px] text-ink-secondary">{KAMO.cityHall.address}</p>
            <p className="mt-1 text-[14px] text-ink-secondary">
              電話{' '}
              <a href={`tel:${KAMO.cityHall.tel.replaceAll('-', '')}`} className="link-chevron">
                {KAMO.cityHall.tel}
              </a>
            </p>
            <p className="mt-4 text-[14px] text-ink-secondary">最寄り駅：{KAMO.station}</p>
          </div>
          <div className="rounded-card bg-surface p-6 md:p-8">
            <p className="text-[17px] font-semibold text-ink">公式の情報</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {[
                ['加茂市 公式サイト', SOURCES.city],
                ['かもんバス（市営バス）時刻表', SOURCES.bus],
                ['加茂市公共交通時刻表（PDF）', SOURCES.busPdf],
                ['加茂七谷温泉 美人の湯', SOURCES.bijinnoyu],
                ['加茂山公園', SOURCES.kamoyama],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link-chevron">
                    {label} ›
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[12px] leading-[1.7] text-ink-secondary lg:col-span-2">
            このページは、加茂市公式サイト・にいがた観光ナビ・新潟県の公開情報をもとに 2026年10月時点でまとめたものです。バスの時刻は加茂市公共交通時刻表（令和8年6月1日改正）によります。日程・時刻・料金は変わることがあるため、お出かけ前に各公式情報をご確認ください。天気は Open-Meteo の予報データです。写真と動画はイメージで、加茂市内で撮影したものではありません。
          </p>
        </div>
      </section>
    </div>
  );
}
