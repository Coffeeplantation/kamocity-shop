'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { tokyoNow } from '@/lib/jpCalendar';
import { SIZES, type GalleryLayout, type GalleryPhoto, type PhotoStyle } from '@/lib/line/gallery';

// 写真の並べ方（grid / masonry / carousel / collage / feature）と、1 枚ずつの見せ方（大きさ・切り抜き位置・拡大・枠・カーソルを載せたときの動き）を描く。
// 公開ページと管理画面のプレビューの両方で使う。写真を押すと大きく表示する。

const when = (iso: string) => {
  const { date, minutes } = tokyoNow(new Date(iso));
  return `${date.m}/${date.d} ${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
};

// 枠ごとの外側（タイル）と内側（写真の窓）のクラス
const FRAME_CLASS: Record<PhotoStyle['frame'], { outer: string; inner: string }> = {
  none: { outer: '', inner: '' },
  rounded: { outer: '', inner: 'rounded-card' },
  polaroid: { outer: 'bg-white p-2 pb-9 shadow-lg ring-1 ring-black/5', inner: '' },
  circle: { outer: '', inner: 'rounded-full' },
  shadow: { outer: '', inner: 'rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.28)]' },
  border: { outer: 'bg-white p-1.5 shadow ring-1 ring-black/5', inner: 'rounded-md' },
};

// カーソルを載せたときの動き（group-hover で写真・タイルに付ける）
const HOVER_CLASS: Record<PhotoStyle['hover'], { tile: string; img: string }> = {
  none: { tile: '', img: '' },
  zoom: { tile: '', img: 'group-hover:scale-[1.08]' },
  lift: { tile: 'hover:-translate-y-1.5 hover:shadow-2xl', img: '' },
  tilt: { tile: 'hover:-rotate-2 hover:scale-[1.02]', img: '' },
  color: { tile: '', img: 'grayscale group-hover:grayscale-0' },
  caption: { tile: '', img: 'group-hover:scale-[1.03]' },
};

function Tile({ p, aspect, className = '', onOpen }: { p: GalleryPhoto; aspect: string; className?: string; onOpen: () => void }) {
  const s = p.style;
  const f = FRAME_CLASS[s.frame];
  const h = HOVER_CLASS[s.hover];
  const label = s.caption || `${when(p.postedAt)} の写真`;
  // 丸い枠は正方形にそろえる。高さを親に合わせるとき（コラージュ・フィーチャー）は aspect を空にして h-full にする
  const box = s.frame === 'circle' ? 'aspect-square' : aspect || 'h-full';
  return (
    <figure className={`group relative transition-all duration-500 ease-out ${f.outer} ${h.tile} ${className}`}>
      <button type="button" onClick={onOpen} aria-label={`${label}を大きく見る`} className={`relative block w-full overflow-hidden bg-canvas-deep ${box} ${f.inner}`}>
        <Image
          src={p.url}
          alt={label}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`transition-[transform,filter] duration-700 ease-out ${h.img}`}
          style={{ objectFit: s.fit, objectPosition: `${s.x}% ${s.y}%`, scale: String(s.zoom) }}
        />
        {s.hover === 'caption' && s.caption && (
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-8 text-left text-[14px] font-semibold text-white transition-transform duration-500 group-hover:translate-y-0">
            {s.caption}
          </span>
        )}
      </button>
      {s.frame === 'polaroid' ? (
        <figcaption className="absolute inset-x-2 bottom-2 truncate text-center text-[13px] text-[#1d1d1f]">{s.caption || when(p.postedAt)}</figcaption>
      ) : (
        s.caption && s.hover !== 'caption' && <figcaption className="mt-1.5 truncate text-[13px] text-ink-secondary">{s.caption}</figcaption>
      )}
    </figure>
  );
}

// 押した写真を画面いっぱいに出す（Esc・背景で閉じる、←→ で前後）
function Lightbox({ photos, index, onClose, onMove }: { photos: GalleryPhoto[]; index: number; onClose: () => void; onMove: (n: number) => void }) {
  const p = photos[index];
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [onClose, onMove]);
  return (
    <div role="dialog" aria-modal="true" aria-label="写真を大きく表示" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image src={p.url} alt={p.style.caption || '写真'} fill sizes="100vw" className="object-contain" />
      </div>
      <p className="absolute bottom-6 left-0 right-0 text-center text-[14px] text-white/85">
        {p.style.caption && <span className="mr-2 font-semibold text-white">{p.style.caption}</span>}
        {when(p.postedAt)}・{index + 1} / {photos.length}
      </p>
      <button type="button" onClick={onClose} aria-label="閉じる" className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/10 text-[22px] text-white hover:bg-white/20">
        ×
      </button>
      {photos.length > 1 &&
        [
          { n: -1, label: '前の写真', side: 'left-3', ch: '‹' },
          { n: 1, label: '次の写真', side: 'right-3', ch: '›' },
        ].map((b) => (
          <button
            key={b.n}
            type="button"
            aria-label={b.label}
            onClick={(e) => {
              e.stopPropagation();
              onMove(b.n);
            }}
            className={`absolute top-1/2 ${b.side} h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-[28px] text-white hover:bg-white/20`}
          >
            {b.ch}
          </button>
        ))}
    </div>
  );
}

export default function PhotoGallery({ layout, photos }: { layout: GalleryLayout; photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const tile = (p: GalleryPhoto, i: number, aspect: string, className = '') => <Tile key={p.id} p={p} aspect={aspect} className={className} onOpen={() => setOpen(i)} />;

  let body;
  switch (layout) {
    case 'grid':
      body = <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{photos.map((p, i) => tile(p, i, 'aspect-square'))}</div>;
      break;
    case 'masonry':
      body = (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>figure]:mb-3 [&>figure]:break-inside-avoid">
          {photos.map((p, i) => tile(p, i, SIZES[p.style.size].aspect))}
        </div>
      );
      break;
    case 'carousel':
      body = (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:-mx-10 md:px-10">
          {photos.map((p, i) => tile(p, i, SIZES[p.style.size].aspect, `shrink-0 snap-start ${SIZES[p.style.size].carousel}`))}
        </div>
      );
      break;
    case 'feature':
      body = (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:[grid-auto-rows:minmax(0,1fr)]">
          {photos.slice(0, 5).map((p, i) =>
            tile(p, i, i === 0 ? 'aspect-[4/3] md:aspect-auto' : 'aspect-square', i === 0 ? 'col-span-2 md:row-span-2 md:h-full' : ''),
          )}
        </div>
      );
      break;
    default:
      // コラージュ：大きさの指定どおりにタイルを広げ、すき間は詰める
      body = (
        <div className="grid grid-flow-dense auto-rows-[140px] grid-cols-2 gap-2 sm:auto-rows-[170px] sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => tile(p, i, '', `h-full ${SIZES[p.style.size].span}`))}
        </div>
      );
  }

  return (
    <>
      {body}
      {open !== null && <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onMove={(n) => setOpen((i) => ((i ?? 0) + n + photos.length) % photos.length)} />}
    </>
  );
}
