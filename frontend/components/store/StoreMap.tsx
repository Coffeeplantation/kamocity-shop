// 店舗周辺の案内図（イメージ）。道の駅は架空の施設なので、実在の地図ではなくイラストで表現する。
// 加茂駅・加茂川・加茂山公園・青海神社の並びはおおまかな目安で、距離や向きは正確ではない。
export default function StoreMap() {
  return (
    <figure className="overflow-hidden rounded-tile bg-[#eef3ee]">
      <svg viewBox="0 0 800 520" className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Lumina 加茂 周辺案内図（イメージ）</title>
        <desc id="map-desc">JR加茂駅の東に加茂山公園と青海神社があり、まちの中を加茂川が流れています。道の駅（架空）は加茂川沿いにある想定です。</desc>
        <defs>
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#bfe3f5" />
            <stop offset="1" stopColor="#9fd3ee" />
          </linearGradient>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 遠くの山（粟ヶ岳方面） */}
        <path d="M520 0H800V70L760 34L716 62L668 18L620 58L580 30L520 64Z" fill="#d6e2d2" />
        <text x="690" y="88" textAnchor="middle" fill="#5b7a5b" fontSize="12">粟ヶ岳 方面 →</text>

        {/* 加茂山公園（森） */}
        <path d="M330 40C390 20 470 30 500 80C520 120 490 170 430 176C370 182 320 150 312 110C306 80 310 50 330 40Z" fill="#cfe3c9" />
        {[
          [350, 70],
          [390, 56],
          [430, 72],
          [460, 104],
          [372, 112],
          [414, 128],
          [448, 146],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill="#9fc89a" />
        ))}
        <text x="410" y="200" textAnchor="middle" fill="#3a6b45" fontSize="13" fontWeight="600">
          加茂山公園
        </text>
        <text x="410" y="216" textAnchor="middle" fill="#5b7a5b" fontSize="11">
          雪椿・リス園
        </text>

        {/* 青海神社 */}
        <g transform="translate(520 150)">
          <path d="M-14 0H14M-11 0V22M11 0V22M-17 -6H17" stroke="#d7432f" strokeWidth="4" strokeLinecap="round" />
          <text x="0" y="40" textAnchor="middle" fill="#6e6e73" fontSize="12">
            青海神社
          </text>
        </g>

        {/* 加茂川 */}
        <path d="M0 330C120 300 220 360 340 340C460 320 560 270 680 290C740 300 780 280 800 270V330C780 340 740 360 680 350C560 330 460 380 340 400C220 420 120 360 0 390Z" fill="url(#river)" />
        <text x="250" y="380" fill="#3a8fbf" fontSize="15" fontWeight="600" letterSpacing="4">
          加茂川
        </text>

        {/* 道路と橋 */}
        <g stroke="#fff" strokeLinecap="round" fill="none">
          <path d="M0 250H800" strokeWidth="20" />
          <path d="M600 250V520" strokeWidth="16" />
          <path d="M200 250V520" strokeWidth="14" />
        </g>
        <text x="20" y="242" fill="#86868b" fontSize="12">
          駅前通り
        </text>

        {/* JR信越本線・加茂駅 */}
        <path d="M150 0V520" stroke="#6e6e73" strokeWidth="6" />
        <path d="M150 0V520" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
        <text x="140" y="500" textAnchor="end" fill="#6e6e73" fontSize="11">
          JR信越本線
        </text>
        <rect x="104" y="196" width="92" height="36" rx="10" fill="#1d1d1f" />
        <text x="150" y="219" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
          加茂駅
        </text>

        {/* 駐車場 */}
        <rect x="630" y="400" width="120" height="84" rx="12" fill="#fff" stroke="#d2d2d7" />
        <rect x="645" y="416" width="30" height="30" rx="7" fill="#0071e3" />
        <text x="660" y="438" textAnchor="middle" fill="#fff" fontSize="19" fontWeight="700">
          P
        </text>
        <text x="685" y="436" fill="#1d1d1f" fontSize="13" fontWeight="600">
          140台
        </text>
        <text x="645" y="470" fill="#6e6e73" fontSize="11">
          EV充電 4基
        </text>

        {/* 店舗ピン（架空） */}
        <g filter="url(#pin-shadow)" transform="translate(690 300)">
          <path d="M0 0c-22 0-38 16-38 37 0 28 38 61 38 61s38-33 38-61C38 16 22 0 0 0Z" fill="#1d1d1f" />
          <path
            transform="translate(-13 23) scale(1.1)"
            fill="#fff"
            d="M12 1.5c.9 5.6 3.9 8.6 9.5 9.5v2c-5.6.9-8.6 3.9-9.5 9.5h-2C9.6 16.9 6.6 13.9 1 13v-2c5.6-.9 8.6-3.9 9.5-9.5h1.5Z"
          />
        </g>
        <rect x="610" y="258" width="160" height="32" rx="16" fill="#fff" />
        <text x="690" y="279" textAnchor="middle" fill="#1d1d1f" fontSize="13" fontWeight="600">
          Lumina 加茂（架空）
        </text>
      </svg>
      <figcaption className="px-5 pb-4 text-[12px] text-ink-secondary">
        ※ 案内図はイメージです。道の駅は架空の施設で、距離や向きは実際とは異なります。加茂駅・加茂山公園・青海神社・加茂川は実在します。
      </figcaption>
    </figure>
  );
}
