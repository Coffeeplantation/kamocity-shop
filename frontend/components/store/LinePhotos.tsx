'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { tokyoNow } from '@/lib/jpCalendar';
import type { LinePhoto } from '@/lib/line/posts';

// LINE 公式アカウントに送られた写真を、ストアの商品と同じように新しい順に並べる。写真がなければ何も出さない
export default function LinePhotos() {
  const [photos, setPhotos] = useState<LinePhoto[]>([]);

  useEffect(() => {
    fetch('/api/line/photos')
      .then((r) => r.json())
      .then((j: { photos: LinePhoto[] }) => setPhotos(j.photos))
      .catch(() => setPhotos([]));
  }, []);

  if (photos.length === 0) return null;
  return (
    <section className="mb-14">
      <h3 className="mb-5 text-[21px] font-semibold text-ink">
        いまの写真。<span className="text-ink-secondary">スタッフが LINE で送った写真。</span>
      </h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {photos.map((p) => {
          const { date, minutes } = tokyoNow(new Date(p.postedAt));
          const time = `${date.m}/${date.d} ${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
          return (
            <li key={p.url} className="relative aspect-square overflow-hidden rounded-tile bg-surface">
              <Image src={p.url} alt={`${time} に送られた写真`} fill sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[12px] font-semibold text-white">{time}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
