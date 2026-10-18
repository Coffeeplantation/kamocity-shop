'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { FurimaDetail } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    Payjp: (key: string) => {
      createElement: (type: string) => { mount: (id: string) => void };
      createToken: (el: unknown) => Promise<{ token?: { id: string }; error?: { message: string } }>;
    };
  }
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [furima, setFurima] = useState<FurimaDetail | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    post_code: '',
    prefecture_id: '1',
    city: '',
    address: '',
    building_name: '',
    phone_number: '',
  });
  const [payjpLoaded, setPayjpLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    api.get(`/furimas/${id}`).then((res) => {
      const f = res.data as FurimaDetail;
      if (f.sold_out || (user && user.id === f.user.id)) {
        router.push('/');
      }
      setFurima(f);
    }).catch(() => setLoadFailed(true));
  }, [id, user, router]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.pay.jp/v2/pay.js';
    script.onload = () => setPayjpLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!payjpLoaded || !process.env.NEXT_PUBLIC_PAYJP_KEY) return;
    const payjp = window.Payjp(process.env.NEXT_PUBLIC_PAYJP_KEY);
    const elements = payjp.createElement('cardNumber');
    elements.mount('#number-form');
  }, [payjpLoaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      await api.post(`/furimas/${id}/orders`, { order: form, token: 'tok_test' });
      router.push('/');
    } catch (err: unknown) {
      const errs = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors;
      setErrors(errs || ['購入処理中にエラーが発生しました。']);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadFailed) return <div className="state-message">商品情報を読み込めませんでした。時間をおいて再度お試しください。</div>;
  if (loading || !furima) return <div className="state-message">読み込み中…</div>;

  const fields = [
    { label: '郵便番号', name: 'post_code', placeholder: '123-4567', maxLength: 8, autoComplete: 'postal-code' },
    { label: '市区町村', name: 'city', placeholder: '横浜市緑区', autoComplete: 'address-level2' },
    { label: '番地', name: 'address', placeholder: '青山1-1-1', autoComplete: 'address-line1' },
    { label: '建物名（任意）', name: 'building_name', placeholder: '柳ビル103', required: false, autoComplete: 'address-line2' },
    { label: '電話番号', name: 'phone_number', placeholder: '09012345678', maxLength: 11, autoComplete: 'tel' },
  ];

  return (
    <div className="bg-surface px-4 md:px-10 xl:px-16 pb-24 pt-12 md:pt-20">
      <div className="mx-auto max-w-content">
        <h1 className="page-title">ご注文手続き。</h1>
        <p className="mt-3 text-[17px] text-ink-secondary">お届け先とお支払い方法を入力してください。</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] xl:gap-24">
          <form onSubmit={handleSubmit} className="order-2 space-y-10 lg:order-1">
            {errors.length > 0 && (
              <ul className="alert-error space-y-1">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}

            <section>
              <h2 className="mb-5 text-[24px] font-semibold tracking-[-0.01em] text-ink">お届け先はどちらですか？</h2>
              <div className="space-y-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label className="field-label" htmlFor={f.name}>{f.label}</label>
                    <input
                      id={f.name}
                      type="text"
                      name={f.name}
                      value={(form as Record<string, string>)[f.name]}
                      onChange={handleChange}
                      required={f.required !== false}
                      placeholder={f.placeholder}
                      maxLength={f.maxLength}
                      autoComplete={f.autoComplete}
                      className="field"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-line/10 pt-10">
              <h2 className="mb-5 text-[24px] font-semibold tracking-[-0.01em] text-ink">お支払い方法</h2>
              <label className="field-label" htmlFor="number-form">クレジットカード番号</label>
              <div id="number-form" className="field h-[50px]" />
            </section>

            <button type="submit" disabled={submitting} className="btn-block">
              {submitting ? '処理中…' : '注文を確定する'}
            </button>
          </form>

          <aside className="order-1 lg:order-2">
            <div className="rounded-tile bg-canvas-gray p-6 lg:sticky lg:top-[68px]">
              <h2 className="text-[17px] font-semibold text-ink">注文内容</h2>
              <div className="mt-5 flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-ctl bg-surface">
                  {furima.image_url && <Image src={furima.image_url} alt={furima.item} fill sizes="80px" className="object-contain p-1.5" />}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[14px] font-semibold text-ink">{furima.item}</p>
                  <p className="mt-1 text-[12px] text-ink-secondary">{furima.fee.name}</p>
                </div>
              </div>
              <dl className="mt-6 space-y-2 border-t border-line/10 pt-4 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink-secondary">小計</dt>
                  <dd className="text-ink">¥{furima.price.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-secondary">配送料</dt>
                  <dd className="text-ink">{furima.fee.name}</dd>
                </div>
                <div className="flex justify-between border-t border-line/10 pt-3 text-[17px] font-semibold">
                  <dt className="text-ink">合計</dt>
                  <dd className="text-ink">¥{furima.price.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
