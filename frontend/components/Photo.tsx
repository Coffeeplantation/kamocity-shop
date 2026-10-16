'use client';

import Image, { type ImageLoaderProps } from 'next/image';
import { useState } from 'react';
import { PHOTOS, type PhotoKey } from '@/lib/photos';

// Unsplash の画像 CDN（imgix）に幅と画質を指定して、画面に合ったサイズだけを読み込む
const unsplashLoader = ({ src, width, quality }: ImageLoaderProps) =>
  `${src}?auto=format&fit=max&w=${width}&q=${quality ?? 72}`;

type Props = {
  name: PhotoKey;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  alt?: string;
};

// 親要素の大きさいっぱいに表示する写真。読み込み完了でふわっと表示する。
export default function Photo({ name, sizes, className = '', imgClassName = '', priority, alt }: Props) {
  const p = PHOTOS[name];
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-[#e8e8ed] ${className}`}>
      <Image
        loader={unsplashLoader}
        src={`https://images.unsplash.com/photo-${p.id}`}
        alt={alt ?? p.alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        style={'position' in p && p.position ? { objectPosition: p.position } : undefined}
      />
    </div>
  );
}
