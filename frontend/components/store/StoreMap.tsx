// 店舗周辺の案内図（イメージ）。架空の地名なので実在の地図ではなくイラストで表現する。
export default function StoreMap() {
  return (
    <figure className="overflow-hidden rounded-[18px] bg-[#eef3ee]">
      <svg viewBox="0 0 800 520" className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Lumina 湊町 周辺案内図</title>
        <desc id="map-desc">湊町駅から港通りを海方向へ進み、灯台交差点の先に店舗と駐車場があります。</desc>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#bfe3f5" />
            <stop offset="1" stopColor="#8fcbeb" />
          </linearGradient>
          <pattern id="wave" width="40" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8c10-6 10 6 20 0s10 6 20 0" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
          </pattern>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 海 */}
        <path d="M560 0H800V520H500C540 420 520 330 560 250 600 170 540 80 560 0Z" fill="url(#sea)" />
        <path d="M560 0H800V520H500C540 420 520 330 560 250 600 170 540 80 560 0Z" fill="url(#wave)" />
        <text x="680" y="270" textAnchor="middle" fill="#3a8fbf" fontSize="16" fontWeight="600" letterSpacing="4">湊町港</text>

        {/* 公園・ブロック */}
        <rect x="60" y="40" width="170" height="110" rx="14" fill="#dbe8db" />
        <rect x="260" y="40" width="190" height="110" rx="14" fill="#e3e8e3" />
        <rect x="60" y="210" width="170" height="130" rx="14" fill="#e3e8e3" />
        <rect x="60" y="390" width="170" height="100" rx="14" fill="#dbe8db" />
        <rect x="260" y="390" width="200" height="100" rx="14" fill="#e3e8e3" />

        {/* 道路 */}
        <g stroke="#fff" strokeLinecap="round">
          <path d="M0 180H560" strokeWidth="26" />
          <path d="M245 0V520" strokeWidth="22" />
          <path d="M0 365H520" strokeWidth="18" />
          <path d="M475 180C500 260 480 330 500 520" strokeWidth="18" />
        </g>
        <g stroke="#d9d9de" strokeWidth="2" strokeDasharray="10 10" fill="none">
          <path d="M0 180H560" />
        </g>
        <text x="120" y="174" fill="#86868b" fontSize="13">港通り</text>
        <text x="253" y="300" fill="#86868b" fontSize="13" transform="rotate(90 253 300)">駅前通り</text>

        {/* 鉄道・駅 */}
        <path d="M0 110H60" stroke="#6e6e73" strokeWidth="6" />
        <path d="M0 110H60" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
        <rect x="60" y="92" width="96" height="36" rx="10" fill="#1d1d1f" />
        <text x="108" y="115" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">湊町駅</text>

        {/* 灯台公園 */}
        <circle cx="145" cy="440" r="6" fill="#34c759" />
        <text x="160" y="445" fill="#3a6b45" fontSize="13">灯台公園</text>
        <text x="110" y="70" fill="#3a6b45" fontSize="13">中央公園</text>

        {/* 交差点 */}
        <circle cx="475" cy="180" r="8" fill="#fff" stroke="#d2d2d7" strokeWidth="2" />
        <text x="420" y="214" fill="#6e6e73" fontSize="12">灯台交差点</text>

        {/* 駐車場 */}
        <rect x="330" y="230" width="120" height="90" rx="12" fill="#fff" stroke="#d2d2d7" />
        <rect x="345" y="248" width="30" height="30" rx="7" fill="#0071e3" />
        <text x="360" y="270" textAnchor="middle" fill="#fff" fontSize="19" fontWeight="700">P</text>
        <text x="385" y="268" fill="#1d1d1f" fontSize="13" fontWeight="600">128台</text>
        <text x="345" y="303" fill="#6e6e73" fontSize="11">EV充電 6基</text>

        {/* 店舗ピン */}
        <g filter="url(#pin-shadow)" transform="translate(520 120)">
          <path d="M0 0c-22 0-38 16-38 37 0 28 38 61 38 61s38-33 38-61C38 16 22 0 0 0Z" fill="#1d1d1f" />
          <path
            transform="translate(-13 23) scale(1.1)"
            fill="#fff"
            d="M12 1.5c.9 5.6 3.9 8.6 9.5 9.5v2c-5.6.9-8.6 3.9-9.5 9.5h-2C9.6 16.9 6.6 13.9 1 13v-2c5.6-.9 8.6-3.9 9.5-9.5h1.5Z"
          />
        </g>
        <rect x="455" y="64" width="130" height="34" rx="17" fill="#fff" />
        <text x="520" y="86" textAnchor="middle" fill="#1d1d1f" fontSize="14" fontWeight="600">Lumina 湊町</text>
      </svg>
      <figcaption className="px-5 pb-4 text-[12px] text-ink-secondary">※ 案内図はイメージです。</figcaption>
    </figure>
  );
}
