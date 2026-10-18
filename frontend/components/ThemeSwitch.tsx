'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_THEME, THEME_KEY, type ThemeName } from '@/lib/theme';

const LABEL: Record<ThemeName, string> = { nv: 'NVIDIA 風', apple: 'Apple 風' };

// 表示スタイルの切り替え。選択は端末ごとに保存し、初回描画前に layout.tsx のスクリプトで反映する
export default function ThemeSwitch({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'apple' ? 'apple' : 'nv');
  }, []);

  const choose = (t: ThemeName) => {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      // 保存できない環境（プライベートブラウズなど）でも、表示の切り替えはできる
    }
  };

  return (
    <div role="group" aria-label="表示スタイル" className={`flex items-center rounded-btn border border-line/15 p-0.5 text-[11px] ${className}`}>
      {(Object.keys(LABEL) as ThemeName[]).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => choose(t)}
          className={`whitespace-nowrap rounded-btn px-2 py-1 font-semibold transition-colors ${theme === t ? 'bg-accent text-on-accent' : 'text-ink/70 hover:text-ink'}`}
        >
          {LABEL[t]}
        </button>
      ))}
    </div>
  );
}
