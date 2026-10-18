'use client';

import Photo from '@/components/Photo';
import Phrases from '@/components/Phrases';
import { useTokyoNow } from '@/components/store/useTokyoNow';
import { nextBijinBus } from '@/components/kamo/BijinBus';
import { useKamoWeather, weatherIcon, weatherLabel } from '@/components/kamo/useKamoWeather';
import { toMinutes } from '@/lib/jpCalendar';
import { isBijinClosed, KAMO, KAMO_EVENTS, seasonOf } from '@/lib/kamo';

// 加茂ページのヒーロー。季節で写真と一文が変わり、「いま」の情報を写真の上に重ねる
export default function KamoHero() {
  const now = useTokyoNow();
  const { data: w } = useKamoWeather();
  const season = now ? seasonOf(now.date.m) : null;
  const bus = now ? nextBijinBus(now, 'to') : undefined;
  const closed = now ? isBijinClosed(now.date) : false;
  const events = now ? KAMO_EVENTS.filter((e) => e.months.includes(now.date.m)) : [];

  const chip = 'flex min-h-[78px] flex-col justify-between rounded-chip border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl transition-colors hover:bg-black/50';
  const label = 'text-[12px] font-semibold text-white/70';

  return (
    <section className="relative isolate flex min-h-[min(88svh,820px)] items-end overflow-hidden bg-black text-white">
      {season && <Photo key={season.id} name={season.photo} priority sizes="100vw" className="!absolute inset-0 -z-10" imgClassName="animate-hero-zoom" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/10" aria-hidden />

      <div className="mx-auto w-full max-w-content px-4 pb-10 pt-28 md:px-10 md:pb-14 xl:px-16">
        <p className="text-[17px] font-semibold text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] md:text-[21px]">
          {KAMO.pref}{KAMO.name}・{season ? season.label : '地元のローカル情報'}
        </p>
        <h1 className="mt-2 text-[56px] font-semibold leading-[1] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] md:text-[104px]">加茂のこと。</h1>
        <p className="mt-4 max-w-[860px] text-[19px] leading-[1.5] text-white/90 md:text-[26px]">
          <Phrases text={season ? season.lead : '桐たんすと雪椿のまち。'} />
          <br className="hidden md:block" />
          <Phrases text="今日の天気、美人の湯へのバス、今月の行事まで、ひとつのページに。" />
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <a href="#now" className={chip}>
            <span className={label}>加茂市の天気</span>
            <span className="text-[15px] font-semibold">
              {w ? (
                <>
                  {weatherIcon(w.code)} {Math.round(w.temp)}° <span className="font-normal text-white/75">{weatherLabel(w.code)}・降水 {w.days[0].rain}%</span>
                </>
              ) : (
                <span className="font-normal text-white/70">読み込み中…</span>
              )}
            </span>
          </a>
          <a href="#bus" className={chip}>
            <span className={label}>次の美人の湯行き（加茂駅前）</span>
            <span className="text-[15px]">
              {!now ? '—' : bus ? (
                <>
                  <span className="font-semibold tabular-nums">{bus.from}</span>
                  <span className="text-white/75">・あと {toMinutes(bus.from) - now.minutes} 分</span>
                </>
              ) : (
                <span className="text-white/75">本日の運行は終了</span>
              )}
            </span>
          </a>
          <a href="#spots" className={chip}>
            <span className={label}>美人の湯（今日）</span>
            <span className="flex items-center gap-1.5 text-[15px] font-semibold">
              {now && (
                <>
                  <span className={`h-2 w-2 rounded-full ${closed ? 'bg-[#ff453a]' : 'bg-[#30d158]'}`} aria-hidden />
                  {closed ? '定休日（第2・第4水曜）' : '定休日ではありません'}
                </>
              )}
            </span>
          </a>
          <a href="#events" className={chip}>
            <span className={label}>{now ? `${now.date.m}月の加茂` : '今月の加茂'}</span>
            <span className="line-clamp-1 text-[15px]">{events.length ? events.map((e) => e.title).join('・') : '掲載している行事はありません'}</span>
          </a>
        </div>
        <p className="mt-4 text-[11px] text-white/55">写真はイメージです（加茂市内で撮影したものではありません）。</p>
      </div>
    </section>
  );
}
