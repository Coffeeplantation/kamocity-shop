'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import FurimaCard from '@/components/FurimaCard';
import { FurimaListItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

type UserProfile = {
  id: number;
  nickname: string;
  furimas: FurimaListItem[];
};

export default function UserShowPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setProfile(res.data)).catch(() => setProfile(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="state-message">読み込み中…</div>;
  if (!profile) return <div className="state-message">ユーザーが見つかりません。</div>;

  const isMe = user?.id === profile.id;

  return (
    <div className="min-h-[70vh] bg-canvas-gray px-4 md:px-10 xl:px-16 pb-24 pt-12 md:pt-20">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5ac8fa] to-[#0071e3] text-[32px] font-semibold text-white">
              {profile.nickname[0]}
            </div>
            <div>
              <h1 className="page-title">{profile.nickname}</h1>
              <p className="mt-1 text-[17px] text-ink-secondary">出品数 {profile.furimas.length}点</p>
            </div>
          </div>
          {isMe && (
            <Link href="/furimas/new" className="btn-primary self-start md:self-auto">
              出品する
            </Link>
          )}
        </div>

        <h2 className="mb-6 mt-16 text-[24px] font-semibold tracking-[-0.01em] text-ink">
          出品中の商品。<span className="text-ink-secondary">{isMe ? 'あなたのラインナップ。' : 'このユーザーのラインナップ。'}</span>
        </h2>
        {profile.furimas.length === 0 ? (
          <p className="text-[17px] text-ink-secondary">出品中の商品はありません。</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {profile.furimas.map((f) => (
              <FurimaCard key={f.id} furima={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
