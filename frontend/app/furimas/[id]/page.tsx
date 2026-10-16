'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { FurimaDetail } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function FurimaShowPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [furima, setFurima] = useState<FurimaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/furimas/${id}`).then((res) => setFurima(res.data)).catch(() => setFurima(null)).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    await api.delete(`/furimas/${id}`);
    router.push('/');
  };

  if (loading) return <div className="state-message">読み込み中…</div>;
  if (!furima) return <div className="state-message">商品が見つかりません。</div>;

  const isOwner = user?.id === furima.user.id;

  const specs: [string, string][] = [
    ['出品者', furima.user.nickname],
    ['カテゴリー', furima.category.name],
    ['商品の状態', furima.condition.name],
    ['配送料の負担', furima.fee.name],
    ['発送元の地域', furima.prefecture.name],
    ['発送日の目安', furima.scheduled_delivery.name],
  ];

  return (
    <div className="bg-white">
      {/* サブナビ */}
      <div className="sticky top-11 z-30 border-b border-black/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[52px] max-w-content items-center justify-between px-4 md:px-10 xl:px-16">
          <p className="truncate pr-4 text-[17px] font-semibold text-ink md:text-[21px]">{furima.item}</p>
          {!furima.sold_out && !isOwner && (
            <Link
              href={user ? `/furimas/${id}/orders` : '/auth/login'}
              className="shrink-0 rounded-full bg-accent px-3 py-1 text-[12px] text-white hover:bg-accent-hover"
            >
              購入
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 md:px-10 xl:px-16 pb-24 pt-10 md:pt-14">
        <p className="text-[14px] font-semibold text-[#b64400]">{furima.sold_out ? '売り切れ' : '新着'}</p>
        <h1 className="mt-1 text-[32px] font-semibold leading-[1.125] tracking-[-0.01em] text-ink md:text-[48px] md:leading-[1.08]">
          {furima.item}を購入
        </h1>
        <p className="mt-3 text-[17px] text-ink">¥{furima.price.toLocaleString()}（税込）</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(380px,1fr)] lg:gap-16 xl:gap-24">
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[18px] bg-canvas-gray">
              {furima.image_url ? (
                <Image
                  src={furima.image_url}
                  alt={furima.item}
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className={`object-contain p-10 ${furima.sold_out ? 'opacity-50' : ''}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[17px] text-ink-tertiary">画像なし</div>
              )}
              {furima.sold_out && (
                <span className="absolute left-5 top-5 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-ink">
              概要。<span className="text-ink-secondary">この商品について。</span>
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-[17px] leading-[1.47] text-ink">{furima.item_text}</p>

            <div className="mt-8 rounded-[18px] border border-[#d2d2d7] p-6">
              <p className="text-[24px] font-semibold text-ink">¥{furima.price.toLocaleString()}</p>
              <p className="mt-1 text-[14px] text-ink-secondary">{furima.fee.name}</p>
              <p className="mt-1 text-[14px] text-ink-secondary">
                {furima.prefecture.name}から{furima.scheduled_delivery.name}
              </p>

              <div className="mt-6 space-y-3">
                {!user ? (
                  <Link href="/auth/login" className="btn-block">
                    サインインして購入
                  </Link>
                ) : isOwner && !furima.sold_out ? (
                  <>
                    <Link href={`/furimas/${id}/edit`} className="btn-block">
                      商品を編集
                    </Link>
                    <button type="button" onClick={handleDelete} className="btn-block-secondary !text-[#d70015]">
                      削除
                    </button>
                  </>
                ) : furima.sold_out ? (
                  <button type="button" disabled className="btn-block !bg-[#d2d2d7] !text-ink-secondary !opacity-100">
                    売り切れました
                  </button>
                ) : (
                  <Link href={`/furimas/${id}/orders`} className="btn-block">
                    購入手続きへ
                  </Link>
                )}
              </div>
            </div>

            <h2 className="mt-12 text-[24px] font-semibold tracking-[-0.01em] text-ink">詳細情報</h2>
            <dl className="mt-4 divide-y divide-black/10 border-y border-black/10">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-4 py-4 text-[14px]">
                  <dt className="text-ink-secondary">{label}</dt>
                  <dd className="text-ink">
                    {label === '出品者' ? (
                      <Link href={`/users/${furima.user.id}`} className="text-accent-link hover:underline">
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
