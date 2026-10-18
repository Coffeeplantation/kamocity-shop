'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogoMark, PhonePair } from '@/components/Devices';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/');
    } catch {
      setError('メールアドレスまたはパスワードが間違っています。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100svh-44px)] bg-surface lg:grid-cols-2">
      <aside className="relative hidden flex-col items-center justify-center overflow-hidden bg-black px-10 text-center lg:sticky lg:top-11 lg:flex lg:h-[calc(100svh-44px)] lg:self-start">
        <h2 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#f5f5f7] xl:text-[48px] 2xl:text-[64px]">おかえりなさい。</h2>
        <p className="mt-3 text-[21px] text-ink-tertiary">欲しいものも、手放したいものも。</p>
        <div className="mt-12 w-full max-w-[680px]">
          <PhonePair id="login-phone" className="mx-auto w-[min(36vw,560px)] animate-float" />
        </div>
      </aside>
      <div className="flex items-start justify-center px-4 pb-24 pt-16 md:pt-24 lg:items-center lg:pt-0">
      <div className="w-full max-w-[460px] text-center">
        <LogoMark className="mx-auto h-12 w-12 text-ink" />
        <h1 className="mt-6 text-[32px] font-semibold leading-[1.125] tracking-[-0.01em] text-ink">
          Lumina IDでサインイン
        </h1>
        <p className="mt-2 text-[17px] text-ink-secondary">出品・購入にはサインインが必要です。</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-3 text-left">
          {error && <p className="alert-error">{error}</p>}
          <label className="sr-only" htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="field"
            placeholder="メールアドレス"
          />
          <label className="sr-only" htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="field"
            placeholder="パスワード"
          />
          <div className="pt-3">
            <button type="submit" disabled={submitting} className="btn-block">
              {submitting ? 'サインイン中…' : 'サインイン'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-[14px] text-ink-secondary">
          Lumina IDをお持ちでない場合は{' '}
          <Link href="/auth/signup" className="link-chevron">
            作成 ›
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
