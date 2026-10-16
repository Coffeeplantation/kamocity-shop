import type { IconName } from '@/lib/storeInfo';

// 施設案内用の線画アイコン（24x24、currentColor）
const PATHS: Record<IconName, JSX.Element> = {
  store: (
    <>
      <path d="M4 9h16l-1.2 11H5.2L4 9Z" />
      <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
    </>
  ),
  support: <path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.4 2.4-2.2-.6-.6-2.2 2.2-2.6Z" />,
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
  fish: (
    <>
      <path d="M2.5 12c3-4.5 8-6 12.5-3.5L21 5v14l-6-3.5C10.5 18 5.5 16.5 2.5 12Z" />
      <circle cx="7.5" cy="11" r=".9" fill="currentColor" />
    </>
  ),
  bread: (
    <>
      <path d="M5 11a4 4 0 0 1 3-7h8a4 4 0 0 1 3 7v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8Z" />
      <path d="M9 9.5c1 .8 1 2.2 0 3M13 9.5c1 .8 1 2.2 0 3" />
    </>
  ),
  craft: (
    <>
      <path d="M6 10h12l-1.5 9a2 2 0 0 1-2 1.7h-5a2 2 0 0 1-2-1.7L6 10Z" />
      <path d="M9 10V7.5a3 3 0 0 1 6 0V10M4.5 10h15" />
    </>
  ),
  bowl: (
    <>
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M8 20h8M14 8l6-5M11 8l5-5" />
    </>
  ),
  icecream: (
    <>
      <path d="m8 12 4 10 4-10" />
      <path d="M7 12a3 3 0 0 1 .5-5.6A4.5 4.5 0 0 1 16.5 6.4 3 3 0 0 1 17 12H7Z" />
    </>
  ),
  grill: (
    <>
      <path d="M4 10h16a8 8 0 0 1-16 0Z" />
      <path d="M8 17.5 6 22M16 17.5l2 4.5M9 3c-1 1.5 1 2.5 0 4M15 3c-1 1.5 1 2.5 0 4M12 2.5c-1 1.5 1 2.5 0 4" />
    </>
  ),
  footbath: (
    <>
      <path d="M3 15h18M5 15v4h14v-4" />
      <path d="M8 4c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4M16 4c-1 1.5 1 2.5 0 4M7 11c1.5-1 3.5-1 5 0s3.5 1 5 0" />
    </>
  ),
  bike: (
    <>
      <circle cx="5.5" cy="16.5" r="3.5" />
      <circle cx="18.5" cy="16.5" r="3.5" />
      <path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 12 16.5h2.5L15 9M8 6h3" />
    </>
  ),
  workshop: (
    <>
      <path d="M4 20h16M6 20V10l6-5 6 5v10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="3" width="16" height="15" rx="3" />
      <path d="M4 11h16M8 21v-3M16 21v-3M8 14.5h.01M16 14.5h.01" />
    </>
  ),
  deck: (
    <>
      <path d="M3 20h18M5 20v-6h14v6M5 14l2-4h10l2 4" />
      <path d="M12 10V4M9 6l3-2 3 2" />
    </>
  ),
  aed: (
    <>
      <path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11Z" />
      <path d="m12.5 8-2 4h3l-2 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
      <path d="M12 8v6M9 11h6" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4h3l7 5V5L6 10H3Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  rest: (
    <>
      <path d="M4 18V8M4 13h16v5M20 13a3 3 0 0 0-3-3h-7v3" />
      <circle cx="7" cy="10.5" r="1.5" />
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
