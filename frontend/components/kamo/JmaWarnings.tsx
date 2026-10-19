'use client';

import { useEffect, useState } from 'react';

// 気象庁が発表している加茂市の警報・注意報（気象庁の公開データをブラウザから直接取得する。AI の要約は使わない）
const PREF = '150000'; // 新潟県
const AREA = '1520900'; // 加茂市
const DATA_URL = `https://www.jma.go.jp/bosai/warning/data/warning/${PREF}.json`;
const PAGE_URL = `https://www.jma.go.jp/bosai/warning/#area_type=class20s&area_code=${AREA}&lang=ja`;

// 種別コード（気象庁 電文仕様 別表1）
const NAMES: Record<string, string> = {
  '02': '暴風雪警報', '03': '大雨警報', '04': '洪水警報', '05': '暴風警報', '06': '大雪警報', '07': '波浪警報', '08': '高潮警報',
  '10': '大雨注意報', '12': '大雪注意報', '13': '風雪注意報', '14': '雷注意報', '15': '強風注意報', '16': '波浪注意報', '17': '融雪注意報',
  '18': '洪水注意報', '19': '高潮注意報', '20': '濃霧注意報', '21': '乾燥注意報', '22': 'なだれ注意報', '23': '低温注意報', '24': '霜注意報',
  '25': '着氷注意報', '26': '着雪注意報', '27': 'その他の注意報',
  '32': '暴風雪特別警報', '33': '大雨特別警報', '35': '暴風特別警報', '36': '大雪特別警報', '37': '波浪特別警報', '38': '高潮特別警報',
};

type Active = { name: string; level: 'special' | 'warning' | 'advisory' };
type State = { loading: true } | { loading: false; failed: true } | { loading: false; failed: false; active: Active[]; reported: string; headline: string };

const levelOf = (code: string): Active['level'] => (+code >= 30 ? 'special' : +code < 10 ? 'warning' : 'advisory');

export default function JmaWarnings() {
  const [s, setS] = useState<State>({ loading: true });

  useEffect(() => {
    let alive = true;
    fetch(DATA_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        const areas = (j.areaTypes ?? []).flatMap((t: { areas: unknown[] }) => t.areas) as { code: string; warnings: { code?: string; status: string }[] }[];
        const kamo = areas.find((a) => a.code === AREA);
        const active = (kamo?.warnings ?? [])
          .filter((w) => w.code && w.status !== '解除' && w.status !== '発表警報・注意報はなし')
          .map((w) => ({ name: NAMES[w.code!] ?? `警報・注意報（コード ${w.code}）`, level: levelOf(w.code!) }))
          .sort((a, b) => ['special', 'warning', 'advisory'].indexOf(a.level) - ['special', 'warning', 'advisory'].indexOf(b.level));
        if (alive) setS({ loading: false, failed: false, active, reported: j.reportDatetime, headline: j.headlineText ?? '' });
      })
      .catch(() => alive && setS({ loading: false, failed: true }));
    return () => {
      alive = false;
    };
  }, []);

  const reported = !s.loading && !s.failed ? new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(s.reported)) : '';
  const worst = !s.loading && !s.failed ? s.active[0]?.level : undefined;
  const tone = worst === 'special' ? 'bg-[#4a0012] text-white' : worst === 'warning' ? 'bg-[#d70015] text-white' : worst === 'advisory' ? 'bg-[#fff4e5] text-[#8a4b00]' : 'bg-surface text-ink';

  return (
    <div className={`rounded-card p-5 md:p-6 ${tone}`} role="status" aria-live="polite">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[12px] font-semibold opacity-75">気象庁の発表（加茂市の警報・注意報）</p>
          {s.loading ? (
            <p className="mt-1 text-[17px]">読み込み中…</p>
          ) : s.failed ? (
            <p className="mt-1 text-[17px]">気象庁のデータを取得できませんでした。下のリンクから直接ご確認ください。</p>
          ) : s.active.length === 0 ? (
            <p className="mt-1 flex items-center gap-2 text-[19px] font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-[#30d158]" aria-hidden />
              発表中の警報・注意報はありません
            </p>
          ) : (
            <ul className="mt-1.5 flex flex-wrap gap-2">
              {s.active.map((a) => (
                <li key={a.name} className={`rounded-full px-3 py-1 text-[15px] font-semibold ${a.level === 'advisory' ? 'bg-[#ffb340]/30' : 'bg-white/20'}`}>
                  {a.name}
                </li>
              ))}
            </ul>
          )}
          {!s.loading && !s.failed && (
            <p className="mt-1.5 text-[12px] opacity-75">
              {reported} 発表{s.headline ? `・${s.headline.slice(0, 80)}` : ''}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <a href={PAGE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-2 hover:underline">
            気象庁で確認 ›
          </a>
          <a href="https://www.river.go.jp/" target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-2 hover:underline">
            川の水位（国土交通省）›
          </a>
          <a href="https://www.city.kamo.niigata.jp/" target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-2 hover:underline">
            加茂市の避難情報 ›
          </a>
        </div>
      </div>
    </div>
  );
}
