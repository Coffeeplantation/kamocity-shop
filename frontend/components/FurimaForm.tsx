'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { MasterData } from '@/types';

type FormData = {
  item: string;
  item_text: string;
  price: string;
  category_id: string;
  condition_id: string;
  fee_id: string;
  prefecture_id: string;
  scheduled_delivery_id: string;
  image?: File | null;
};

type Props = {
  initialData?: Partial<FormData>;
  furimaId?: number;
  mode: 'new' | 'edit';
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-black/10 pt-8 first:border-0 first:pt-0 lg:grid lg:grid-cols-[minmax(200px,1fr)_3fr] lg:gap-12 xl:gap-20">
      <h2 className="mb-5 text-[21px] font-semibold text-ink lg:mb-0">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function FurimaForm({ initialData, furimaId, mode }: Props) {
  const router = useRouter();
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    item: '',
    item_text: '',
    price: '',
    category_id: '1',
    condition_id: '1',
    fee_id: '1',
    prefecture_id: '1',
    scheduled_delivery_id: '1',
    image: null,
    ...initialData,
  });

  useEffect(() => {
    api.get('/master_data').then((res) => setMasterData(res.data));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'image' && v instanceof File) fd.append('furima[image]', v);
      else if (k !== 'image') fd.append(`furima[${k}]`, v as string);
    });

    try {
      if (mode === 'new') {
        await api.post('/furimas', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        router.push('/');
      } else {
        await api.patch(`/furimas/${furimaId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        router.push(`/furimas/${furimaId}`);
      }
    } catch (err: unknown) {
      const errs = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors;
      setErrors(errs || ['エラーが発生しました。']);
    } finally {
      setSubmitting(false);
    }
  };

  if (!masterData) return <p className="py-8 text-center text-[17px] text-ink-secondary">読み込み中…</p>;

  const select = (label: string, name: keyof FormData, options: { id: number; name: string }[]) => (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} value={form[name] as string} onChange={handleChange} className="field field-select">
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );

  const price = Number(form.price);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.length > 0 && (
        <ul className="alert-error space-y-1">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      <Section title="商品画像">
        <label className="group flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-[#d2d2d7] bg-canvas-gray transition-colors hover:border-accent sm:w-96">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="選択した画像のプレビュー" className="h-full w-full object-contain p-4" />
          ) : (
            <span className="flex flex-col items-center gap-2 text-[14px] text-ink-secondary">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[22px] text-accent shadow-sm transition-transform group-hover:scale-110">
                ＋
              </span>
              画像を追加
            </span>
          )}
          <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
        </label>
      </Section>

      <Section title="商品情報">
        <div>
          <label className="field-label" htmlFor="item">
            商品名 <span className="field-required">40文字まで</span>
          </label>
          <input
            id="item"
            name="item"
            value={form.item}
            onChange={handleChange}
            required
            maxLength={40}
            placeholder="商品名"
            className="field"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="item_text">
            商品の説明 <span className="field-required">1,000文字まで</span>
          </label>
          <textarea
            id="item_text"
            name="item_text"
            value={form.item_text}
            onChange={handleChange}
            required
            maxLength={1000}
            placeholder="色、素材、状態など"
            className="field resize-y"
            rows={6}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {select('カテゴリー', 'category_id', masterData.categories)}
          {select('商品の状態', 'condition_id', masterData.conditions)}
        </div>
      </Section>

      <Section title="配送について">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {select('配送料の負担', 'fee_id', masterData.fees)}
          {select('発送元の地域', 'prefecture_id', masterData.prefectures)}
          {select('発送までの日数', 'scheduled_delivery_id', masterData.scheduled_deliveries)}
        </div>
      </Section>

      <Section title="販売価格">
        <div>
          <label className="field-label" htmlFor="price">
            価格 <span className="field-required">¥300〜¥9,999,999</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-ink-secondary">¥</span>
            <input
              id="price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min={300}
              max={9999999}
              placeholder="300"
              className="field pl-9"
            />
          </div>
        </div>
        <dl className="divide-y divide-black/10 rounded-xl bg-canvas-gray px-5 text-[14px]">
          <div className="flex justify-between py-3">
            <dt className="text-ink-secondary">販売手数料（10%）</dt>
            <dd className="text-ink">{price >= 300 ? `¥${Math.floor(price * 0.1).toLocaleString()}` : '—'}</dd>
          </div>
          <div className="flex justify-between py-3 font-semibold">
            <dt className="text-ink">販売利益</dt>
            <dd className="text-ink">{price >= 300 ? `¥${Math.floor(price * 0.9).toLocaleString()}` : '—'}</dd>
          </div>
        </dl>
      </Section>

      <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-8 sm:flex-row lg:ml-auto lg:w-1/2">
        <button type="button" onClick={() => router.back()} className="btn-block-secondary">
          もどる
        </button>
        <button type="submit" disabled={submitting} className="btn-block">
          {submitting ? '処理中…' : mode === 'new' ? '出品する' : '変更を保存'}
        </button>
      </div>
    </form>
  );
}
