'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import {
  DEFAULT_STYLE,
  FRAMES,
  HOVERS,
  LAYOUTS,
  SIZES,
  sortPhotos,
  SPACES,
  type GalleryLayout,
  type GalleryPhoto,
  type GallerySettings,
  type PhotoStyle,
  type SpaceId,
} from '@/lib/line/gallery';

// 管理者用：LINE から届いた写真の確認・承認と、見せ方（1 枚ずつ）・並べ方（スペースごと）の設定。
// 右上のアカウントのメニューからサインインした管理者（ADMIN_EMAILS）だけが使える。

type Data = { settings: GallerySettings; pending: GalleryPhoto[]; published: GalleryPhoto[] };

const label = 'text-[12px] font-semibold text-ink-secondary';
const select = 'field field-select mt-1 h-10 py-0 text-[14px]';

function Choice<T extends string>({ name, value, options, onChange }: { name: string; value: T; options: Record<T, string>; onChange: (v: T) => void }) {
  return (
    <label className="block">
      <span className={label}>{name}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={select}>
        {(Object.keys(options) as T[]).map((k) => (
          <option key={k} value={k}>
            {options[k]}
          </option>
        ))}
      </select>
    </label>
  );
}

function Range({ name, value, min, max, step, onChange, show }: { name: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; show: string }) {
  return (
    <label className="block">
      <span className={`${label} flex justify-between`}>
        {name}
        <span className="tabular-nums">{show}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[#d6336c]" />
    </label>
  );
}

// 1 枚の見せ方を決める。左にプレビュー、右に設定
function StyleEditor({ photo, onChange }: { photo: GalleryPhoto; onChange: (s: PhotoStyle) => void }) {
  const s = photo.style;
  const set = (patch: Partial<PhotoStyle>) => onChange({ ...s, ...patch });
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className="w-full max-w-[220px]">
        <PhotoGallery layout="masonry" photos={[photo]} />
        <p className="mt-2 text-[12px] text-ink-tertiary">プレビュー（カーソルを載せると動きを確かめられます）</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Choice name="大きさ・比率" value={s.size} options={Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [k, v.label])) as Record<PhotoStyle['size'], string>} onChange={(size) => set({ size })} />
        <Choice name="枠" value={s.frame} options={FRAMES} onChange={(frame) => set({ frame })} />
        <Choice name="カーソルを載せたとき" value={s.hover} options={HOVERS} onChange={(hover) => set({ hover })} />
        <Choice name="収め方" value={s.fit} options={{ cover: '枠いっぱいに切り抜く', contain: '写真全体を収める' }} onChange={(fit) => set({ fit })} />
        <Range name="拡大" value={s.zoom} min={1} max={3} step={0.05} show={`${s.zoom.toFixed(2)} 倍`} onChange={(zoom) => set({ zoom })} />
        <Range name="位置（左右）" value={s.x} min={0} max={100} step={1} show={`${s.x}%`} onChange={(x) => set({ x })} />
        <Range name="位置（上下）" value={s.y} min={0} max={100} step={1} show={`${s.y}%`} onChange={(y) => set({ y })} />
        <label className="block">
          <span className={label}>キャプション（60 文字まで）</span>
          <input value={s.caption} maxLength={60} onChange={(e) => set({ caption: e.target.value })} className="field mt-1 h-10 py-0 text-[14px]" placeholder="例：今日の教室の作品" />
        </label>
        <fieldset className="sm:col-span-2">
          <legend className={label}>載せる場所</legend>
          <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1.5">
            {(Object.keys(SPACES) as SpaceId[]).map((sp) => (
              <label key={sp} className="flex items-center gap-2 text-[14px] text-ink">
                <input
                  type="checkbox"
                  checked={s.spaces.includes(sp)}
                  onChange={(e) => set({ spaces: e.target.checked ? [...s.spaces, sp] : s.spaces.filter((x) => x !== sp) })}
                />
                {SPACES[sp].label}
              </label>
            ))}
            <label className="flex items-center gap-2 text-[14px] text-ink">
              <input type="checkbox" checked={s.pinned} onChange={(e) => set({ pinned: e.target.checked })} />
              先頭に固定
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default function AdminPhotosPage() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, PhotoStyle>>({});

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/photos', { cache: 'no-store' });
    const j = await res.json().catch(() => ({ ok: false, error: '読み込みに失敗しました。' }));
    if (!j.ok) {
      setError(j.error);
      return;
    }
    setError(null);
    setData(j);
    setDrafts({});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const send = async (key: string, body: object) => {
    setBusy(key);
    const res = await fetch('/api/admin/photos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({ ok: false, error: '保存に失敗しました。' }));
    setBusy(null);
    if (!j.ok) setError(j.error);
    else await load();
  };

  const styleOf = (p: GalleryPhoto) => drafts[p.id] ?? p.style;
  const withDraft = (p: GalleryPhoto) => ({ ...p, style: styleOf(p) });

  if (error && !data) {
    return (
      <div className="mx-auto max-w-content px-4 py-20 md:px-10">
        <h1 className="text-[32px] font-semibold text-ink">写真の確認・承認</h1>
        <p className="mt-4 text-[17px] text-ink-secondary">{error}</p>
        <Link href="/auth/login?next=/admin/photos" className="link-chevron mt-4 inline-block text-[15px]">
          サインインする ›
        </Link>
      </div>
    );
  }
  if (!data) return <div className="state-message">読み込み中…</div>;

  return (
    <div className="mx-auto max-w-content px-4 py-12 md:px-10 xl:px-16">
      <h1 className="text-[32px] font-semibold text-ink md:text-[40px]">写真の確認・承認</h1>
      <p className="mt-2 text-[15px] text-ink-secondary">LINE で届いた写真は、ここで承認するまでサイトに載りません。見せ方は 1 枚ずつ、並べ方は載せる場所ごとに選べます。</p>
      {error && <p className="mt-4 rounded-chip bg-[#d70015]/10 px-4 py-3 text-[14px] text-[#d70015]">{error}</p>}

      {/* 並べ方（スペースごと）とプレビュー */}
      <h2 className="mt-12 text-[24px] font-semibold text-ink">並べ方</h2>
      {(Object.keys(SPACES) as SpaceId[]).map((sp) => {
        const current = data.settings.layouts[sp];
        const shown = sortPhotos(data.published.map(withDraft).filter((p) => p.style.spaces.includes(sp)));
        return (
          <section key={sp} className="mt-5 rounded-card bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[19px] font-semibold text-ink">{SPACES[sp].label}</h3>
              <Link href={SPACES[sp].href} className="link-chevron text-[13px]">
                ページで見る ›
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`${SPACES[sp].label}の並べ方`}>
              {(Object.keys(LAYOUTS) as GalleryLayout[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={current === l}
                  disabled={busy !== null}
                  onClick={() => send(`layout-${sp}`, { action: 'layout', space: sp, layout: l })}
                  title={LAYOUTS[l].like}
                  className={`rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${current === l ? 'border-ink bg-ink text-on-ink' : 'border-hairline text-ink hover:border-ink'}`}
                >
                  {LAYOUTS[l].label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-ink-secondary">{LAYOUTS[current].like}</p>
            <div className="mt-5">
              {shown.length ? <PhotoGallery layout={current} photos={shown} /> : <p className="text-[14px] text-ink-tertiary">この場所に載せている写真はまだありません。</p>}
            </div>
          </section>
        );
      })}

      {/* 承認待ち */}
      <h2 className="mt-14 text-[24px] font-semibold text-ink">
        承認待ち <span className="text-ink-secondary">{data.pending.length} 枚</span>
      </h2>
      {data.pending.length === 0 && <p className="mt-3 text-[15px] text-ink-secondary">新しく届いた写真はありません。</p>}
      <ul className="mt-5 space-y-4">
        {data.pending.map((p) => {
          const style = drafts[p.id] ?? DEFAULT_STYLE;
          return (
            <li key={p.id} className="rounded-card bg-surface p-5 sm:p-6">
              <StyleEditor photo={{ ...p, style }} onChange={(s) => setDrafts((d) => ({ ...d, [p.id]: s }))} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={busy !== null} onClick={() => send(p.id, { action: 'approve', id: p.id, style })} className="btn-primary">
                  {busy === p.id ? '保存中…' : '承認して載せる'}
                </button>
                <button type="button" disabled={busy !== null} onClick={() => send(p.id, { action: 'reject', id: p.id })} className="btn-secondary">
                  却下する
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* 掲載中 */}
      <h2 className="mt-14 text-[24px] font-semibold text-ink">
        掲載中 <span className="text-ink-secondary">{data.published.length} 枚</span>
      </h2>
      <ul className="mt-5 space-y-4">
        {data.published.map((p) => (
          <li key={p.id} className="rounded-card bg-surface p-5 sm:p-6">
            <StyleEditor photo={withDraft(p)} onChange={(s) => setDrafts((d) => ({ ...d, [p.id]: s }))} />
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" disabled={busy !== null || !drafts[p.id]} onClick={() => send(p.id, { action: 'style', id: p.id, style: styleOf(p) })} className="btn-primary">
                {busy === p.id ? '保存中…' : '見せ方を保存'}
              </button>
              <button type="button" disabled={busy !== null} onClick={() => send(p.id, { action: 'remove', id: p.id })} className="btn-secondary">
                掲載をやめる
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
