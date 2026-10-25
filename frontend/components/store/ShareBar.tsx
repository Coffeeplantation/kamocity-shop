'use client';

import { useEffect, useState } from 'react';

// 「LINE で送る」「X でポスト」「リンクをコピー」と、LINE 公式アカウントの友だち追加（NEXT_PUBLIC_LINE_FRIEND_URL）。
// 地域の店やイベントのサイトでよく見る、友だちに知らせる・お知らせを受け取る導線
const FRIEND_URL = process.env.NEXT_PUBLIC_LINE_FRIEND_URL;
const TEXT = 'アメリカンフラワー教室とイベントの案内';

export default function ShareBar({ className = '' }: { className?: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.origin + window.location.pathname), []);
  if (!url) return null;
  const e = encodeURIComponent;
  const btn = 'inline-flex h-10 items-center gap-2 rounded-full border border-hairline bg-surface px-4 text-[14px] text-ink transition-colors hover:border-ink';
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {FRIEND_URL && (
        <a href={FRIEND_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-full bg-[#06c755] px-4 text-[14px] font-semibold text-white hover:opacity-90">
          LINE で教室のお知らせを受け取る
        </a>
      )}
      <span className="ml-1 text-[13px] text-ink-secondary">シェア</span>
      <a href={`https://social-plugins.line.me/lineit/share?url=${e(url)}`} target="_blank" rel="noopener noreferrer" className={btn}>
        LINE で送る
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${e(url)}&text=${e(TEXT)}`} target="_blank" rel="noopener noreferrer" className={btn}>
        X でポスト
      </a>
      <button
        type="button"
        className={btn}
        onClick={() =>
          navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
        }
      >
        {copied ? 'コピーしました' : 'リンクをコピー'}
      </button>
    </div>
  );
}
