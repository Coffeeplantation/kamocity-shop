'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { FurimaListItem } from '@/types';
import FurimaCard from '@/components/FurimaCard';
import { CompactProductRow, LUMINA_PRODUCTS } from '@/components/ProductCards';
import ProductStrip from '@/components/ProductStrip';
import LinePhotos from '@/components/store/LinePhotos';
import { useAuth } from '@/contexts/AuthContext';

type Sort = 'new' | 'price-asc' | 'price-desc';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'new', label: '新着順' },
  { value: 'price-asc', label: '価格の安い順' },
  { value: 'price-desc', label: '価格の高い順' },
];

function StoreContent() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [furimas, setFurimas] = useState<FurimaListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const q = params.get('q') ?? '';
  const sort = (SORTS.some((s) => s.value === params.get('sort')) ? params.get('sort') : 'new') as Sort;
  const inStock = params.get('stock') === '1';
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);

  useEffect(() => {
    api
      .get('/furimas')
      .then((res) => setFurimas(res.data))
      .catch(() => setFurimas([]))
      .finally(() => setLoading(false));
  }, []);

  // 検索条件は URL に保持（共有・戻る操作に対応）
  const update = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = furimas.filter(
      (f) => (!inStock || !f.sold_out) && words.every((w) => f.item.toLowerCase().includes(w)),
    );
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [furimas, q, sort, inStock]);

  // Lumina の製品は常に在庫ありとして、キーワードだけで絞り込む
  const models = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return LUMINA_PRODUCTS.filter((p) => words.every((w) => p.name.toLowerCase().includes(w)));
  }, [q]);

  const filtered = q || inStock;

  return (
    <div className="min-h-[70vh] bg-canvas-gray pb-24">
      <ProductStrip />
      <div className="mx-auto max-w-content px-4 pt-12 md:px-10 md:pt-20 xl:px-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="text-[40px] font-semibold leading-[1.1] md:text-[56px] md:leading-[1.07]">
            ストア。
            <br className="md:hidden" />
            <span className="text-ink-secondary">欲しいものを、一番いい方法で。</span>
          </h1>
          <div className="shrink-0 space-y-3 text-[14px] leading-[1.43]">
            <div>
              <p className="font-semibold">出品をお考えですか？</p>
              <Link href={user ? '/furimas/new' : '/auth/login'} className="link-chevron">
                {user ? '出品する ›' : 'サインインして出品 ›'}
              </Link>
            </div>
          </div>
        </div>

        {/* 検索・並び替え */}
        <div className="mt-12 flex flex-col gap-3 md:flex-row md:items-center">
          <form
            role="search"
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: draft.trim() || null });
            }}
          >
            <label htmlFor="store-search" className="sr-only">
              商品を検索
            </label>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-tertiary" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m15.5 15.5 5 5" strokeLinecap="round" />
            </svg>
            <input
              id="store-search"
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="商品名で検索"
              className="field pl-11"
            />
          </form>
          <div className="flex gap-3">
            <label htmlFor="store-sort" className="sr-only">
              並び替え
            </label>
            <select
              id="store-sort"
              value={sort}
              onChange={(e) => update({ sort: e.target.value === 'new' ? null : e.target.value })}
              className="field field-select md:w-48"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-pressed={inStock}
              onClick={() => update({ stock: inStock ? null : '1' })}
              className={`shrink-0 rounded-ctl border px-4 text-[15px] transition-colors ${
                inStock ? 'border-ink bg-ink text-on-ink' : 'border-hairline bg-surface text-ink hover:border-ink'
              }`}
            >
              在庫ありのみ
            </button>
          </div>
        </div>

        <div className="mb-6 mt-10 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[24px] font-semibold">
            {q ? (
              <>
                「{q}」の検索結果。<span className="text-ink-secondary">{loading ? '' : `${models.length + results.length}件`}</span>
              </>
            ) : (
              <>
                最新モデル。<span className="text-ink-secondary">すべてのアイテムを見る。</span>
              </>
            )}
          </h2>
          {filtered && (
            <button type="button" onClick={() => update({ q: null, stock: null })} className="link-chevron text-[14px]">
              条件をクリア ›
            </button>
          )}
        </div>

        {/* Lumina の製品は、縮小版のカードを左右にスクロールして見る */}
        {models.length > 0 && (
          <div className="mb-14">
            <CompactProductRow products={models} />
          </div>
        )}

        {/* LINE 公式アカウントに送られた写真（なければ出ない） */}
        <LinePhotos />

        <h3 className="mb-5 text-[21px] font-semibold text-ink">
          出品されたアイテム。<span className="text-ink-secondary">ユーザーが出品した商品。</span>
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-tile bg-surface" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-tile bg-surface px-6 py-16 text-center">
            <p className="text-[21px] font-semibold text-ink">
              {filtered ? '条件に合う出品が見つかりませんでした。' : '現在、出品されているアイテムはありません。'}
            </p>
            <p className="mt-2 text-[17px] text-ink-secondary">
              {filtered ? 'キーワードを変えるか、条件をクリアしてください。' : '新しい商品が出品されるまで、しばらくお待ちください。'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {results.map((f) => (
              <FurimaCard key={f.id} furima={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="state-message">読み込み中…</div>}>
      <StoreContent />
    </Suspense>
  );
}
