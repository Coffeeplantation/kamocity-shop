'use client';

import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import type { GalleryLayout, GalleryPhoto, SpaceId } from '@/lib/line/gallery';

// LINE から届き、管理者が承認した写真を、スペースごとに選んだ並べ方で表示する。写真がなければ emptyNote を出す（省略すると何も出さない）
export default function LinePhotos({ space, heading = true, emptyNote }: { space: SpaceId; heading?: boolean; emptyNote?: string }) {
  const [data, setData] = useState<{ layout: GalleryLayout; photos: GalleryPhoto[] } | null>(null);

  useEffect(() => {
    fetch(`/api/line/photos?space=${space}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ layout: 'grid', photos: [] }));
  }, [space]);

  if (!data) return emptyNote ? <div className="h-[240px] animate-pulse rounded-card bg-surface" /> : null;
  if (data.photos.length === 0) return emptyNote ? <p className="rounded-card bg-surface px-6 py-10 text-center text-[15px] text-ink-secondary">{emptyNote}</p> : null;
  return (
    <section className={heading ? 'mb-14' : ''}>
      {heading && (
        <h3 className="mb-5 text-[21px] font-semibold text-ink">
          いまの写真。<span className="text-ink-secondary">LINE で届いた写真。</span>
        </h3>
      )}
      <PhotoGallery layout={data.layout} photos={data.photos} />
    </section>
  );
}
