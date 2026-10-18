'use client';

import { useEffect, useRef, useState } from 'react';
import { VIDEOS, type VideoInfo, type VideoKey } from '@/lib/videos';

type Props = {
  name: VideoKey;
  className?: string;
  // 一時停止ボタンの位置を、上に重なる文字と被らないように調整する
  controlClassName?: string;
};

// Apple の製品ページのような、音のないループ背景動画。
// 画面に入っている間だけ再生し、動きを減らす設定の人にはポスター画像だけを見せる。
export default function BackgroundVideo({ name, className = '', controlClassName = 'bottom-5 right-5' }: Props) {
  const v: VideoInfo = VIDEOS[name];
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView && !userPaused && !reduced) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [inView, userPaused, reduced]);

  const paused = userPaused || reduced;

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        style={v.position ? { objectPosition: v.position } : undefined}
        poster={`/videos/${v.file}.jpg`}
        muted
        loop
        playsInline
        preload={inView ? 'auto' : 'none'}
        aria-hidden
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={`/videos/${v.file}.mp4`} type="video/mp4" />
      </video>
      {!reduced && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={paused || !playing ? '背景動画を再生' : '背景動画を一時停止'}
          className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35 ${controlClassName}`}
        >
          {paused || !playing ? (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l12.5-7.5L7 4.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <rect x="6" y="4.5" width="4" height="15" rx="1" />
              <rect x="14" y="4.5" width="4" height="15" rx="1" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
