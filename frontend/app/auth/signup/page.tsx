'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Laptop } from '@/components/Devices';

// 会員登録で集めるのは、教室やイベントの案内に必要な最小限（ニックネーム・メールアドレス・パスワード）だけ
type SignupForm = {
  email: string;
  password: string;
  password_confirmation: string;
  nickname: string;
};

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    password_confirmation: '',
    nickname: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('パスワード（確認）が一致しません。');
      return;
    }
    setSubmitting(true);
    try {
      await signup({ email: form.email, password: form.password, nickname: form.nickname });
      router.push('/stores');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました。入力内容をご確認ください。');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    label: string,
    name: keyof SignupForm,
    { type = 'text', placeholder = '', autoComplete }: { type?: string; placeholder?: string; autoComplete?: string } = {},
  ) => (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="field"
      />
    </div>
  );

  return (
    <div className="grid min-h-[calc(100svh-44px)] bg-surface lg:grid-cols-[1fr_minmax(560px,1fr)]">
      <aside className="relative hidden flex-col items-center justify-center overflow-hidden bg-black px-10 text-center lg:sticky lg:top-11 lg:flex lg:h-[calc(100svh-44px)] lg:self-start">
        <h2 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#f5f5f7] xl:text-[48px] 2xl:text-[64px]">教室とイベントの案内を、いち早く。</h2>
        <p className="mt-3 text-[21px] text-ink-tertiary">アメリカンフラワー教室の会員登録。</p>
        <div className="mt-12 w-full max-w-[680px]">
          <Laptop id="signup-book" className="mx-auto w-full max-h-[45svh]" />
        </div>
      </aside>
      <div className="px-4 pb-24 pt-16 md:px-10 md:pt-24 xl:px-16">
      <div className="mx-auto w-full max-w-[640px]">
        <div className="text-center">
          <h1 className="text-[32px] font-semibold leading-[1.125] tracking-[-0.01em] text-ink md:text-[40px]">
            会員登録
          </h1>
          <p className="mt-2 text-[17px] text-ink-secondary">
            ニックネームとメールアドレスだけで登録できます。
          </p>
          <p className="mt-3 text-[14px] text-ink-secondary">
            すでに会員の場合は{' '}
            <Link href="/auth/login" className="link-chevron">
              サインイン ›
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {error && <p className="alert-error">{error}</p>}

          <fieldset className="space-y-4">
            <legend className="mb-4 text-[21px] font-semibold text-ink">プロフィール</legend>
            {field('ニックネーム（30 文字まで）', 'nickname', { placeholder: '例）かも花子', autoComplete: 'nickname' })}
          </fieldset>

          <fieldset className="space-y-4 border-t border-line/10 pt-10">
            <legend className="sr-only">アカウント情報</legend>
            <p className="text-[21px] font-semibold text-ink">アカウント情報</p>
            {field('メールアドレス', 'email', { type: 'email', placeholder: 'name@example.com', autoComplete: 'email' })}
            {field('パスワード', 'password', { type: 'password', autoComplete: 'new-password' })}
            <p className="-mt-2 text-[12px] text-ink-secondary">8 文字以上で、英字と数字を両方含めてください。</p>
            {field('パスワード（確認）', 'password_confirmation', { type: 'password', autoComplete: 'new-password' })}
          </fieldset>

          <button type="submit" disabled={submitting} className="btn-block">
            {submitting ? '登録中…' : '登録する'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
