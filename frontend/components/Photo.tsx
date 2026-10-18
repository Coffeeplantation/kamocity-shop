'use client';

import Image, { type ImageLoaderProps } from 'next/image';
import { useState } from 'react';
import { PHOTOS, photoSrc, type PhotoInfo, type PhotoKey } from '@/lib/photos';

// 画像 CDN に幅と画質を指定して、画面に合ったサイズだけを読み込む（Unsplash は imgix、Pexels は独自の変換パラメータ）
const unsplashLoader = ({ src, width, quality }: ImageLoaderProps) =>
  `${src}?auto=format&fit=max&w=${width}&q=${quality ?? 82}`;
const pexelsLoader = ({ src, width }: ImageLoaderProps) => `${src}?auto=compress&cs=tinysrgb&w=${width}`;

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
  const p: PhotoInfo = PHOTOS[name];
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-canvas-deep ${className}`}>
      <Image
        loader={p.host === 'pexels' ? pexelsLoader : unsplashLoader}
        src={photoSrc(p)}
        alt={alt ?? p.alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        style={p.position ? { objectPosition: p.position } : undefined}
      />
    </div>
  );
}
