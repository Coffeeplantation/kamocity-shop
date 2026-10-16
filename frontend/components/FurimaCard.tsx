import Link from 'next/link';
import Image from 'next/image';
import { FurimaListItem } from '@/types';

export default function FurimaCard({ furima }: { furima: FurimaListItem }) {
  return (
    <Link
      href={`/furimas/${furima.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 hover:scale-[1.015] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)]"
    >
      <div className="px-6 pt-6">
        {furima.sold_out ? (
          <p className="text-[12px] font-semibold text-[#b64400]">売り切れ</p>
        ) : (
          <p className="text-[12px] font-semibold text-[#b64400]">新着</p>
        )}
        <p className="mt-1 line-clamp-2 text-[21px] font-semibold leading-[1.19] text-ink">{furima.item}</p>
      </div>
      <div className="relative mx-6 my-5 aspect-square">
        {furima.image_url ? (
          <Image
            src={furima.image_url}
            alt={furima.item}
            fill
            sizes="280px"
            className={`object-contain transition-transform duration-500 group-hover:scale-105 ${furima.sold_out ? 'opacity-50' : ''}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-canvas-gray text-[14px] text-ink-tertiary">
            画像なし
          </div>
        )}
      </div>
      <div className="mt-auto px-6 pb-6 text-[14px] text-ink">
        <p>¥{furima.price.toLocaleString()}（税込）</p>
        <p className="text-[12px] text-ink-secondary">{furima.fee_name}</p>
      </div>
    </Link>
  );
}
