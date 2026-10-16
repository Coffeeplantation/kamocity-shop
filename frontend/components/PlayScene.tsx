'use client';

import { CSSProperties, ElementType, ReactNode, useEffect, useRef } from 'react';

// スクロールで一定の位置まで来ると、時間に沿って --progress を 0 → 1 へ自動再生するラッパー。
// スクロール量には連動せず、再生が始まったら最後まで自動で進む。
//   - 要素が threshold 以上表示されたら再生開始
//   - 画面から完全に外れたら 0 に戻し、次に表示されたとき再び再生
//   - 視差効果を減らす設定では、最初から完成状態を表示
// 状態は data-state（idle / playing / done）にも反映する。

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  style?: CSSProperties;
  duration?: number;
  threshold?: number;
  delay?: number;
  'aria-label'?: string;
};

export default function PlayScene({
  children,
  as: Tag = 'div',
  className = '',
  id,
  style,
  duration = 4000,
  threshold = 0.5,
  delay = 0,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let p = 0;
    let raf = 0;
    let timer = 0;
    let start = 0;

    const apply = () => el.style.setProperty('--progress', p.toFixed(4));
    const setState = (s: string) => (el.dataset.state = s);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      p = 1;
      apply();
      setState('done');
      return;
    }

    const tick = (now: number) => {
      p = Math.min(1, (now - start) / duration);
      apply();
      if (p < 1) raf = requestAnimationFrame(tick);
      else setState('done');
    };

    const play = () => {
      if (el.dataset.state !== 'idle') return;
      setState('playing');
      timer = window.setTimeout(() => {
        start = performance.now();
        raf = requestAnimationFrame(tick);
      }, delay);
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      p = 0;
      apply();
      setState('idle');
    };

    reset();

    // 再生開始: threshold 以上表示 / リセット: 完全に画面外
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= threshold || (e.isIntersecting && e.intersectionRect.height >= window.innerHeight * 0.6)) play();
          else if (!e.isIntersecting) reset();
        }
      },
      { threshold: [0, threshold, 0.6, 1] },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration, threshold, delay]);

  return (
    <Tag ref={ref} id={id} className={className} style={style} data-play-scene="" {...rest}>
      {children}
    </Tag>
  );
}
