'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FurimaListItem } from '@/types';
import FurimaCard from '@/components/FurimaCard';
import { useAuth } from '@/contexts/AuthContext';

export default function StorePage() {
  const { user } = useAuth();
  const [furimas, setFurimas] = useState<FurimaListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/furimas')
      .then((res) => setFurimas(res.data))
      .catch(() => setFurimas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[70vh] bg-canvas-gray pb-24">
      <div className="mx-auto max-w-content px-4 md:px-10 xl:px-16 pt-12 md:pt-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] md:text-[56px] md:leading-[1.07]">
            ストア。
            <br className="md:hidden" />
            <span className="text-ink-secondary">欲しいものを、一番いい方法で。</span>
          </h1>
          <div className="shrink-0 text-[14px] leading-[1.43]">
            <p className="font-semibold">出品をお考えですか？</p>
            <Link href={user ? '/furimas/new' : '/auth/login'} className="link-chevron">
              {user ? '出品する ›' : 'サインインして出品 ›'}
            </Link>
          </div>
        </div>

        <h2 className="mb-6 mt-16 text-[24px] font-semibold tracking-[-0.01em]">
          最新モデル。<span className="text-ink-secondary">すべてのアイテムを見る。</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-[18px] bg-white" />
            ))}
          </div>
        ) : furimas.length === 0 ? (
          <p className="text-[17px] text-ink-secondary">現在、ストアに並んでいる商品はありません。</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {furimas.map((f) => (
              <FurimaCard key={f.id} furima={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
