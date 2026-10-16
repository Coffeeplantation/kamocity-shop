'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FurimaForm from '@/components/FurimaForm';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { FurimaDetail } from '@/types';

export default function FurimaEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [furima, setFurima] = useState<FurimaDetail | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    api.get(`/furimas/${id}`).then((res) => {
      const f = res.data as FurimaDetail;
      if (user && user.id !== f.user.id) router.push('/');
      setFurima(f);
    });
  }, [id, user, router]);

  if (loading || !furima) return <div className="state-message">読み込み中…</div>;

  return (
    <div className="bg-canvas-gray px-4 md:px-10 xl:px-16 pb-24 pt-12 md:pt-20">
      <div className="mx-auto max-w-content">
      <h1 className="page-title">
        商品を編集。<span className="text-ink-secondary">{furima.item}</span>
      </h1>
      <div className="panel mt-10">
        <FurimaForm
          mode="edit"
          furimaId={furima.id}
          initialData={{
            item: furima.item,
            item_text: furima.item_text,
            price: String(furima.price),
            category_id: String(furima.category.id),
            condition_id: String(furima.condition.id),
            fee_id: String(furima.fee.id),
            prefecture_id: String(furima.prefecture.id),
            scheduled_delivery_id: String(furima.scheduled_delivery.id),
          }}
        />
      </div>
      </div>
    </div>
  );
}
