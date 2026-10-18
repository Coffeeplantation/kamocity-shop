import Link from 'next/link';
import Photo from '@/components/Photo';
import { KINDS, SHOPS } from '@/lib/storeInfo';

// 写真のある店舗を大小のタイルで並べる。先頭の 3 店は大きく見せ、4 列で端数が出ないようにする
export default function ShopMosaic() {
  const shops = SHOPS.filter((s) => s.photo);
  return (
    <ul className="grid grid-flow-row-dense auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[300px] lg:grid-cols-4">
      {shops.map((s, i) => (
        <li key={s.id} className={i < 3 ? 'sm:row-span-2 lg:col-span-2' : ''}>
          <Link href="/stores#shops" className="group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-card bg-black p-6 text-white">
            <Photo
              name={s.photo!}
              sizes={i < 3 ? '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
              className="!absolute inset-0 -z-10"
              imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent" aria-hidden />
            <span className="mb-2 w-fit rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-white" style={{ background: KINDS[s.kind].color }}>
              {KINDS[s.kind].label}
            </span>
            <p className={`font-semibold leading-[1.15] ${i < 3 ? 'text-[32px] md:text-[40px]' : 'text-[22px]'}`}>{s.name}</p>
            <p className={`mt-1 text-white/85 ${i < 3 ? 'text-[17px] md:text-[19px]' : 'text-[14px]'}`}>{s.lead}</p>
            <p className="mt-1 text-[12px] text-white/60">{s.area}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
