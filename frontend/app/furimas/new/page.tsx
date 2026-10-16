'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FurimaForm from '@/components/FurimaForm';
import { useAuth } from '@/contexts/AuthContext';

export default function FurimaNewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading) return <div className="state-message">読み込み中…</div>;

  return (
    <div className="bg-canvas-gray px-4 md:px-10 xl:px-16 pb-24 pt-12 md:pt-20">
      <div className="mx-auto max-w-content">
        <h1 className="page-title">
          出品する。<span className="text-ink-secondary">次の持ち主へ。</span>
        </h1>
        <div className="panel mt-10">
          <FurimaForm mode="new" />
        </div>
      </div>
    </div>
  );
}
