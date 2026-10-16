'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FurimaListItem } from '@/types';
import FurimaCard from '@/components/FurimaCard';

export default function StoreRow() {
  const [furimas, setFurimas] = useState<FurimaListItem[] | null>(null);

  useEffect(() => {
    api
      .get('/furimas')
      .then((res) => setFurimas(res.data))
      .catch(() => setFurimas([]));
  }, []);

  if (furimas === null) {
    return (
      <div className="no-scrollbar mt-8 flex gap-5 overflow-x-hidden px-4 md:px-10 xl:px-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[420px] w-[280px] shrink-0 animate-pulse rounded-[18px] bg-white" />
        ))}
      </div>
    );
  }

  if (furimas.length === 0) {
    return (
      <p className="mx-auto mt-8 max-w-content px-4 md:px-10 xl:px-16 text-[17px] text-ink-secondary">
        現在、ストアに並んでいる商品はありません。
      </p>
    );
  }

  return (
    <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-8 pt-2 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16">
      {furimas.slice(0, 16).map((f) => (
        <div key={f.id} className="w-[280px] shrink-0 snap-start">
          <FurimaCard furima={f} />
        </div>
      ))}
    </div>
  );
}
