import Image from 'next/image';
import { tokyoNow } from '@/lib/jpCalendar';
import type { LinePhoto } from '@/lib/line/posts';

// LINE 公式アカウントに送られた写真を、新しい順に並べる。写真がなければ何も出さない
export default function LinePhotos({ photos }: { photos: LinePhoto[] }) {
  if (photos.length === 0) return null;
  return (
    <div className="mt-3 rounded-card border border-line/[0.08] bg-surface/80 p-5 backdrop-blur-xl sm:p-6">
      <h3 className="text-[24px] font-semibold text-ink md:text-[28px]">館内から、いまの写真。</h3>
      <p className="mt-1 text-[13px] font-semibold text-ink-secondary">スタッフが LINE で送った写真です。</p>
      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => {
          const { date, minutes } = tokyoNow(new Date(p.postedAt));
          const time = `${date.m}/${date.d} ${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
          return (
            <li key={p.url} className="relative aspect-square overflow-hidden rounded-xl bg-canvas-deep">
              <Image src={p.url} alt={`${time} に送られた館内の写真`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[12px] font-semibold text-white">{time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
