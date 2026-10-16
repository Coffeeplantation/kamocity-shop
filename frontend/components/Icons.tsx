import type { IconName } from '@/lib/storeInfo';

// 施設案内用の線画アイコン（24x24、currentColor）
const PATHS: Record<IconName, JSX.Element> = {
  store: (
    <>
      <path d="M4 9h16l-1.2 11H5.2L4 9Z" />
      <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
    </>
  ),
  support: (
    <>
      <path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.4 2.4-2.2-.6-.6-2.2 2.2-2.6Z" />
    </>
  ),
  cafe: (
    <>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3.5c0 1 1 1.5 1 2.5M12 3.5c0 1 1 1.5 1 2.5" />
    </>
  ),
  market: (
    <>
      <path d="M3 9.5 5 4h14l2 5.5" />
      <path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12v8h14v-8M10 20v-5h4v5" />
    </>
  ),
  ev: (
    <>
      <rect x="4" y="3" width="10" height="18" rx="2" />
      <path d="m10 7-2.5 4.5h3L8 16" />
      <path d="M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8l-2-2" />
    </>
  ),
  parking: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M9.5 17V7.5h3.5a3 3 0 0 1 0 6H9.5" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </>
  ),
  restroom: (
    <>
      <circle cx="7" cy="5" r="1.8" />
      <circle cx="17" cy="5" r="1.8" />
      <path d="M5 21v-6H4l1-6h4l1 6H9v6M15 21v-7h-1V9h6v5h-1v7M12 3v18" />
    </>
  ),
  baby: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M10.5 8h.01M13.5 8h.01M10.8 9.8a2 2 0 0 0 2.4 0" />
      <path d="M6 21c.6-3.5 3-5.5 6-5.5s5.4 2 6 5.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5h.01" />
    </>
  ),
  accessible: (
    <>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M12 7v6h5l2 5M12 10h4M9 11.5a5 5 0 1 0 6.5 6.5" />
    </>
  ),
  locker: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M12 3v18M8 9v2M16 9v2" />
    </>
  ),
};

export default function Icon({ name, className = 'h-6 w-6' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
