import { ReactNode } from 'react';
import BackgroundVideo from '@/components/BackgroundVideo';
import Phrases from '@/components/Phrases';
import type { VideoKey } from '@/lib/videos';

type Props = {
  video: VideoKey;
  eyebrow?: string;
  // スクロールに合わせて左から明るくなる大きな一文
  statement: string;
  children?: ReactNode;
  id?: string;
};

// 角丸の枠から画面いっぱいへ広がる背景動画と、スクロールで明るくなる一文。
// 動画は画面に入っている間だけ再生し、動きを減らす設定ではポスター画像のまま。
export default function VideoStatement({ video, eyebrow, statement, children, id }: Props) {
  return (
    <section id={id} className="sd-expand relative isolate flex min-h-[min(100svh,960px)] scroll-mt-16 items-end overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10">
        <BackgroundVideo name={video} className="sd-parallax" controlClassName="top-[68px] right-5 md:right-8" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" aria-hidden />
      <div className="mx-auto w-full max-w-content px-4 pb-14 pt-32 md:px-10 md:pb-24 xl:px-16">
        {eyebrow && <p className="sd-rise text-[17px] font-semibold text-white/80 md:text-[21px]">{eyebrow}</p>}
        <p className="sd-fill mt-3 max-w-[1200px] text-[40px] font-semibold leading-[1.08] md:text-[72px] 2xl:text-[96px]">
          <Phrases text={statement} />
        </p>
        {children && <div className="sd-rise mt-8">{children}</div>}
      </div>
    </section>
  );
}
