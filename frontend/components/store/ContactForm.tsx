'use client';

import { FormEvent, useState } from 'react';
import { STORE } from '@/lib/storeInfo';

const TOPICS = ['店舗・商品について', 'イベント・体験の予約', '出店・出荷のご相談', '取材・視察', 'その他'];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

// 送信サーバーを持たないため、入力内容を本文に入れてメールアプリを起動する
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'お名前を入力してください。';
    if (!form.email.trim()) e.email = 'メールアドレスを入力してください。';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'メールアドレスの形式が正しくありません。';
    if (form.message.trim().length < 10) e.message = 'お問い合わせ内容を 10 文字以上で入力してください。';
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`contact-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const subject = `【${STORE.name}】${form.topic}`;
    const body = `お名前：${form.name}\nメールアドレス：${form.email}\n種別：${form.topic}\n\n${form.message}`;
    window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={submit} noValidate className="rounded-card bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            お名前
          </label>
          <input id="contact-name" className="field" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby="contact-name-error" />
          {errors.name && <p id="contact-name-error" className="mt-1.5 text-[13px] text-[#d70015]">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            メールアドレス
          </label>
          <input id="contact-email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby="contact-email-error" />
          {errors.email && <p id="contact-email-error" className="mt-1.5 text-[13px] text-[#d70015]">{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-topic" className="field-label">
            お問い合わせの種類
          </label>
          <select id="contact-topic" className="field field-select" value={form.topic} onChange={set('topic')}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="field-label">
            お問い合わせ内容
          </label>
          <textarea id="contact-message" rows={5} className="field resize-y" value={form.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby="contact-message-error" />
          {errors.message && <p id="contact-message-error" className="mt-1.5 text-[13px] text-[#d70015]">{errors.message}</p>}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-[1.6] text-ink-secondary">
          送信するとメールアプリが起動します。お急ぎの場合はお電話（{STORE.tel}・{STORE.telNote}）でどうぞ。
        </p>
        <button type="submit" className="btn-primary shrink-0">
          メールで送信
        </button>
      </div>
      {opened && (
        <p className="mt-4 rounded-ctl bg-[#e9f7ee] px-4 py-3 text-[14px] text-[#1a7f37]" role="status">
          メールアプリで送信を完了してください。起動しない場合は {STORE.email} 宛にお送りください。
        </p>
      )}
    </form>
  );
}
