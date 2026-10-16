'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Laptop } from '@/components/Devices';

type SignupForm = {
  email: string;
  password: string;
  password_confirmation: string;
  nickname: string;
  first_name: string;
  family_name: string;
  first_name_kana: string;
  family_name_kana: string;
  birth_date: string;
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
    first_name: '',
    family_name: '',
    first_name_kana: '',
    family_name_kana: '',
    birth_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form);
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { status?: { message?: string } } } })
        ?.response?.data?.status?.message;
      setError(msg || '登録に失敗しました。入力内容をご確認ください。');
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
    <div className="grid min-h-[calc(100svh-44px)] bg-white lg:grid-cols-[1fr_minmax(560px,1fr)]">
      <aside className="relative hidden flex-col items-center justify-center overflow-hidden bg-black px-10 text-center lg:sticky lg:top-11 lg:flex lg:h-[calc(100svh-44px)] lg:self-start">
        <h2 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#f5f5f7] xl:text-[48px] 2xl:text-[64px]">ひとつのIDで、すべてを。</h2>
        <p className="mt-3 text-[21px] text-[#86868b]">出品も、購入も、Luminaで。</p>
        <div className="mt-12 w-full max-w-[680px]">
          <Laptop id="signup-book" className="mx-auto w-full max-h-[45svh]" />
        </div>
      </aside>
      <div className="px-4 pb-24 pt-16 md:px-10 md:pt-24 xl:px-16">
      <div className="mx-auto w-full max-w-[640px]">
        <div className="text-center">
          <h1 className="text-[32px] font-semibold leading-[1.125] tracking-[-0.01em] text-ink md:text-[40px]">
            Lumina IDを作成
          </h1>
          <p className="mt-2 text-[17px] text-ink-secondary">
            ひとつのIDで、ストアでの出品も購入もすべて。
          </p>
          <p className="mt-3 text-[14px] text-ink-secondary">
            すでにお持ちの場合は{' '}
            <Link href="/auth/login" className="link-chevron">
              サインイン ›
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {error && <p className="alert-error">{error}</p>}

          <fieldset className="space-y-4">
            <legend className="mb-4 text-[21px] font-semibold text-ink">プロフィール</legend>
            <div className="grid grid-cols-2 gap-3">
              {field('姓（全角）', 'family_name', { placeholder: '山田', autoComplete: 'family-name' })}
              {field('名（全角）', 'first_name', { placeholder: '太郎', autoComplete: 'given-name' })}
              {field('セイ（全角カナ）', 'family_name_kana', { placeholder: 'ヤマダ' })}
              {field('メイ（全角カナ）', 'first_name_kana', { placeholder: 'タロウ' })}
            </div>
            {field('ニックネーム', 'nickname', { placeholder: '例）lumina太郎', autoComplete: 'nickname' })}
            {field('生年月日', 'birth_date', { type: 'date', autoComplete: 'bday' })}
          </fieldset>

          <fieldset className="space-y-4 border-t border-black/10 pt-10">
            <legend className="sr-only">アカウント情報</legend>
            <p className="text-[21px] font-semibold text-ink">アカウント情報</p>
            {field('メールアドレス', 'email', { type: 'email', placeholder: 'name@example.com', autoComplete: 'email' })}
            {field('パスワード', 'password', { type: 'password', autoComplete: 'new-password' })}
            <p className="-mt-2 text-[12px] text-ink-secondary">6文字以上で、英字と数字を両方含めてください。</p>
            {field('パスワード（確認）', 'password_confirmation', { type: 'password', autoComplete: 'new-password' })}
          </fieldset>

          <button type="submit" disabled={submitting} className="btn-block">
            {submitting ? '作成中…' : '続ける'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
