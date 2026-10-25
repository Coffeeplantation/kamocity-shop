'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// starlink.com の「住所を入力して ORDER NOW」にあたる欄。入力した言葉でストアを検索する
export default function OrderForm() {
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <form
      role="search"
      className="flex w-full max-w-[560px] flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        router.push(v ? `/store?q=${encodeURIComponent(v)}` : '/store');
      }}
    >
      <label htmlFor="sl-order" className="sr-only">
        欲しい商品
      </label>
      <input
        id="sl-order"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="欲しい商品を入力"
        className="h-12 min-w-0 flex-1 rounded-[4px] border border-white/40 bg-black/40 px-4 text-[15px] text-white outline-none backdrop-blur-sm placeholder:text-white/55 focus:border-white"
      />
      <button type="submit" className="sl-btn sl-btn-solid h-12">
        注文する
      </button>
    </form>
  );
}
