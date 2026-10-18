// 架空ブランド「Lumina」の製品イラスト。すべてオリジナルの SVG。
// 各コンポーネントは id プレフィックスを受け取り、同一ページ内で複数使っても gradient id が衝突しないようにしている。

type DeviceProps = { id: string; className?: string };

export function LogoMark({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <path
        fill="currentColor"
        d="M12 1.5c.9 5.6 3.9 8.6 9.5 9.5v2c-5.6.9-8.6 3.9-9.5 9.5h-2C9.6 16.9 6.6 13.9 1 13v-2c5.6-.9 8.6-3.9 9.5-9.5h1.5Z"
      />
    </svg>
  );
}

// 画面の壁紙: グラデーション + ぼかした光の玉
function Wallpaper({
  id,
  x,
  y,
  w,
  h,
  r,
  colors,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  colors: [string, string, string, string];
}) {
  const [base1, base2, blob1, blob2] = colors;
  return (
    <>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x={x} y={y} width={w} height={h} rx={r} />
        </clipPath>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={base1} />
          <stop offset="1" stopColor={base2} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={Math.max(w, h) / 14} />
        </filter>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-base)`} />
        <g filter={`url(#${id}-blur)`}>
          <ellipse cx={x + w * 0.25} cy={y + h * 0.7} rx={w * 0.55} ry={h * 0.28} fill={blob1} opacity="0.9" />
          <ellipse cx={x + w * 0.85} cy={y + h * 0.35} rx={w * 0.45} ry={h * 0.22} fill={blob2} opacity="0.85" />
          <ellipse cx={x + w * 0.5} cy={y + h * 1.02} rx={w * 0.6} ry={h * 0.15} fill={base1} opacity="0.7" />
        </g>
      </g>
    </>
  );
}

export function PhonePair({
  id,
  className = '',
  frame = ['#e7e3dc', '#a7a29a', '#efebe4'],
  back = ['#d8d3ca', '#bfb9af'],
  wallpaper = ['#1b1430', '#3a1d5c', '#ff8a3d', '#c43dff'],
}: DeviceProps & {
  frame?: [string, string, string];
  back?: [string, string];
  wallpaper?: [string, string, string, string];
}) {
  const lens = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r="23" fill={`url(#${id}-frame)`} />
      <circle cx={cx} cy={cy} r="19.5" fill="#1a1a1c" />
      <circle cx={cx} cy={cy} r="13" fill={`url(#${id}-lens)`} />
      <circle cx={cx - 4} cy={cy - 4} r="3" fill="#fff" opacity="0.45" />
    </g>
  );

  return (
    <svg viewBox="0 0 540 580" className={className} role="img" aria-label="Lumina Phone の前面と背面">
      <defs>
        <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={frame[0]} />
          <stop offset="0.5" stopColor={frame[1]} />
          <stop offset="1" stopColor={frame[2]} />
        </linearGradient>
        <linearGradient id={`${id}-back`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={back[0]} />
          <stop offset="1" stopColor={back[1]} />
        </linearGradient>
        <radialGradient id={`${id}-lens`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#4a5a80" />
          <stop offset="0.45" stopColor="#141a2b" />
          <stop offset="1" stopColor="#030407" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="270" cy="560" rx="230" ry="16" fill={`url(#${id}-shadow)`} />

      {/* 背面 */}
      <g transform="translate(36 44) rotate(-5 120 250)">
        <rect width="240" height="500" rx="46" fill={`url(#${id}-frame)`} />
        <rect x="5" y="5" width="230" height="490" rx="41" fill={`url(#${id}-back)`} />
        <rect x="18" y="18" width="114" height="120" rx="32" fill="#000" opacity="0.06" />
        <rect x="18.5" y="18.5" width="113" height="119" rx="31.5" fill="none" stroke="#fff" strokeOpacity="0.35" />
        {lens(50, 50)}
        {lens(50, 106)}
        {lens(102, 78)}
        <circle cx="104" cy="36" r="6" fill="#f7f2e8" stroke="#00000022" />
        <circle cx="104" cy="122" r="3" fill="#2a2a2c" />
        <g transform="translate(104 236)" opacity="0.55">
          <LogoMarkPath fill="#8a857d" />
        </g>
        <rect x="5" y="5" width="60" height="490" rx="30" fill={`url(#${id}-sheen)`} />
      </g>

      {/* 前面 */}
      <g transform="translate(262 22)">
        <rect x="-3" y="120" width="5" height="34" rx="2" fill={frame[1]} />
        <rect x="-3" y="170" width="5" height="56" rx="2" fill={frame[1]} />
        <rect x="238" y="150" width="5" height="80" rx="2" fill={frame[1]} />
        <rect width="240" height="512" rx="46" fill={`url(#${id}-frame)`} />
        <rect x="5" y="5" width="230" height="502" rx="41" fill="#050506" />
        <Wallpaper id={`${id}-wp`} x={13} y={13} w={214} h={486} r={34} colors={wallpaper} />
        <rect x="86" y="26" width="68" height="21" rx="10.5" fill="#000" />
        <text x="120" y="92" textAnchor="middle" fill="#fff" fillOpacity="0.85" fontSize="13" fontWeight="600">
          10月16日 金曜日
        </text>
        <text x="120" y="150" textAnchor="middle" fill="#fff" fontSize="64" fontWeight="600" letterSpacing="-2">
          9:41
        </text>
        <rect x="40" y="430" width="44" height="44" rx="22" fill="#fff" fillOpacity="0.18" />
        <rect x="156" y="430" width="44" height="44" rx="22" fill="#fff" fillOpacity="0.18" />
        <rect x="82" y="486" width="76" height="4" rx="2" fill="#fff" fillOpacity="0.85" />
      </g>
    </svg>
  );
}

function LogoMarkPath({ fill }: { fill: string }) {
  return (
    <path
      transform="translate(-16 -16) scale(1.333)"
      fill={fill}
      d="M12 1.5c.9 5.6 3.9 8.6 9.5 9.5v2c-5.6.9-8.6 3.9-9.5 9.5h-2C9.6 16.9 6.6 13.9 1 13v-2c5.6-.9 8.6-3.9 9.5-9.5h1.5Z"
    />
  );
}

export function Laptop({
  id,
  className = '',
  body = ['#e3e4e6', '#bfc1c5'],
  wallpaper = ['#0b2a4a', '#0f5b8f', '#5ad1ff', '#7a5cff'],
}: DeviceProps & { body?: [string, string]; wallpaper?: [string, string, string, string] }) {
  const dock = ['#ff5f57', '#febc2e', '#28c840', '#0a84ff', '#bf5af2', '#ff9f0a', '#64d2ff'];
  return (
    <svg viewBox="0 0 760 470" className={className} role="img" aria-label="Lumina Book Air">
      <defs>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={body[0]} />
          <stop offset="1" stopColor={body[1]} />
        </linearGradient>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={body[0]} />
          <stop offset="0.6" stopColor={body[1]} />
          <stop offset="1" stopColor="#8e9096" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="380" cy="446" rx="360" ry="16" fill={`url(#${id}-shadow)`} />
      <rect x="96" y="12" width="568" height="376" rx="20" fill={`url(#${id}-lid)`} />
      <rect x="102" y="18" width="556" height="364" rx="15" fill="#0a0a0b" />
      <Wallpaper id={`${id}-wp`} x={112} y={28} w={536} h={344} r={6} colors={wallpaper} />
      <rect x="112" y="28" width="536" height="14" fill="#fff" fillOpacity="0.18" />
      <rect x="350" y="18" width="60" height="12" rx="5" fill="#0a0a0b" />
      <rect x="160" y="80" width="200" height="120" rx="12" fill="#fff" fillOpacity="0.16" />
      <rect x="176" y="98" width="110" height="10" rx="5" fill="#fff" fillOpacity="0.7" />
      <rect x="176" y="118" width="160" height="7" rx="3.5" fill="#fff" fillOpacity="0.4" />
      <rect x="176" y="133" width="140" height="7" rx="3.5" fill="#fff" fillOpacity="0.4" />
      <rect x="390" y="110" width="210" height="150" rx="12" fill="#fff" fillOpacity="0.12" />
      <rect x="250" y="338" width="260" height="26" rx="9" fill="#fff" fillOpacity="0.22" />
      {dock.map((c, i) => (
        <rect key={c} x={262 + i * 35} y="343" width="16" height="16" rx="4" fill={c} />
      ))}
      <path d="M24 388 H736 V396 Q736 410 720 412 L40 412 Q24 410 24 396 Z" fill={`url(#${id}-base)`} />
      <path d="M318 388 H442 Q442 396 434 396 H326 Q318 396 318 388 Z" fill="#000" fillOpacity="0.15" />
    </svg>
  );
}

export function Watch({
  id,
  className = '',
  band = ['#ff6a3d', '#e2412a'],
  caseColor = ['#3a3a3c', '#151516'],
}: DeviceProps & { band?: [string, string]; caseColor?: [string, string] }) {
  const ring = (r: number, color: string, pct: number) => {
    const c = 2 * Math.PI * r;
    return (
      <g key={r}>
        <circle cx="150" cy="260" r={r} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="12" />
        <circle
          cx="150"
          cy="260"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 150 260)"
        />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 300 500" className={className} role="img" aria-label="Lumina Watch">
      <defs>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={band[1]} />
          <stop offset="0.5" stopColor={band[0]} />
          <stop offset="1" stopColor={band[1]} />
        </linearGradient>
        <linearGradient id={`${id}-case`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={caseColor[0]} />
          <stop offset="1" stopColor={caseColor[1]} />
        </linearGradient>
      </defs>
      <path d="M86 0 H214 L206 130 H94 Z" fill={`url(#${id}-band)`} />
      <path d="M94 370 H206 L214 500 H86 Z" fill={`url(#${id}-band)`} />
      <rect x="248" y="190" width="16" height="46" rx="7" fill={caseColor[0]} />
      <rect x="250" y="260" width="9" height="50" rx="4" fill={caseColor[0]} />
      <rect x="44" y="106" width="212" height="288" rx="62" fill={`url(#${id}-case)`} />
      <rect x="54" y="116" width="192" height="268" rx="52" fill="#000" />
      <text x="150" y="172" textAnchor="middle" fill="#fff" fontSize="40" fontWeight="600" letterSpacing="-1">
        10:09
      </text>
      {ring(66, '#ff2d55', 0.82)}
      {ring(51, '#a6ff00', 0.64)}
      {ring(36, '#00e5ff', 0.9)}
    </svg>
  );
}

export function Tablet({
  id,
  className = '',
  wallpaper = ['#1f0f3a', '#5b1f6e', '#ff5f9e', '#ffb340'],
}: DeviceProps & { wallpaper?: [string, string, string, string] }) {
  return (
    <svg viewBox="0 0 680 500" className={className} role="img" aria-label="Lumina Pad Pro">
      <defs>
        <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a5a5e" />
          <stop offset="1" stopColor="#2a2a2c" />
        </linearGradient>
        <linearGradient id={`${id}-pencil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d9de" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="640" height="440" rx="34" fill={`url(#${id}-frame)`} />
      <rect x="26" y="26" width="628" height="428" rx="29" fill="#000" />
      <Wallpaper id={`${id}-wp`} x={40} y={40} w={600} h={400} r={18} colors={wallpaper} />
      <rect x="70" y="70" width="170" height="170" rx="22" fill="#fff" fillOpacity="0.16" />
      <text x="92" y="128" fill="#fff" fontSize="44" fontWeight="600" letterSpacing="-1">
        16
      </text>
      <text x="92" y="160" fill="#fff" fillOpacity="0.8" fontSize="16" fontWeight="600">
        金曜日
      </text>
      <rect x="260" y="70" width="350" height="170" rx="22" fill="#fff" fillOpacity="0.12" />
      <rect x="282" y="96" width="140" height="12" rx="6" fill="#fff" fillOpacity="0.7" />
      <rect x="282" y="122" width="300" height="8" rx="4" fill="#fff" fillOpacity="0.35" />
      <rect x="282" y="140" width="260" height="8" rx="4" fill="#fff" fillOpacity="0.35" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={84 + i * 90} y="300" width="62" height="62" rx="16" fill="#fff" fillOpacity={0.22 + (i % 3) * 0.08} />
      ))}
      <g transform="rotate(-8 340 486)">
        <rect x="140" y="478" width="400" height="14" rx="7" fill={`url(#${id}-pencil)`} />
        <path d="M540 478 L572 485 L540 492 Z" fill="#cfcfd4" />
      </g>
    </svg>
  );
}

export function Buds({ id, className = '' }: DeviceProps) {
  const bud = (tx: number, flip: boolean) => (
    <g transform={`translate(${tx} 20) ${flip ? 'scale(-1 1)' : ''}`}>
      <rect x="-14" y="70" width="28" height="110" rx="14" fill={`url(#${id}-white)`} />
      <ellipse cx="0" cy="62" rx="40" ry="46" fill={`url(#${id}-white)`} />
      <ellipse cx="-14" cy="52" rx="16" ry="20" fill="#2c2c2e" opacity="0.85" />
      <ellipse cx="-12" cy="48" rx="6" ry="7" fill="#fff" opacity="0.25" />
      <rect x="-6" y="150" width="12" height="24" rx="6" fill="#d8d8dc" />
    </g>
  );
  return (
    <svg viewBox="0 0 440 400" className={className} role="img" aria-label="Lumina Buds Pro">
      <defs>
        <linearGradient id={`${id}-white`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dcdce1" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="220" cy="380" rx="170" ry="14" fill={`url(#${id}-shadow)`} />
      <rect x="90" y="170" width="260" height="200" rx="72" fill={`url(#${id}-white)`} stroke="#00000010" />
      <path d="M92 222 H348" stroke="#00000018" strokeWidth="2" />
      <circle cx="220" cy="270" r="4" fill="#34c759" />
      {bud(150, false)}
      {bud(290, true)}
    </svg>
  );
}

export function Headset({ id, className = '' }: DeviceProps) {
  return (
    <svg viewBox="0 0 680 360" className={className} role="img" aria-label="Lumina Vision">
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d47" />
          <stop offset="0.45" stopColor="#0c0d12" />
          <stop offset="1" stopColor="#1b1d24" />
        </linearGradient>
        <linearGradient id={`${id}-alu`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d8f94" />
          <stop offset="0.5" stopColor="#e8e9ec" />
          <stop offset="1" stopColor="#8d8f94" />
        </linearGradient>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5ac8fa" stopOpacity="0" />
          <stop offset="0.5" stopColor="#bf5af2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9f0a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M40 190 C40 290 640 290 640 190 L640 210 C640 320 40 320 40 210 Z" fill="#6b6c70" />
      <path
        d="M60 170 C60 80 190 46 340 46 C490 46 620 80 620 170 C620 252 500 292 340 292 C180 292 60 252 60 170 Z"
        fill={`url(#${id}-alu)`}
      />
      <path
        d="M72 170 C72 92 196 60 340 60 C484 60 608 92 608 170 C608 240 494 278 340 278 C186 278 72 240 72 170 Z"
        fill={`url(#${id}-glass)`}
      />
      <path d="M150 210 C220 236 460 236 530 210" stroke={`url(#${id}-glow)`} strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M120 120 C200 82 300 76 380 80" stroke="#fff" strokeOpacity="0.28" strokeWidth="8" strokeLinecap="round" fill="none" />
      <rect x="560" y="70" width="34" height="14" rx="7" fill={`url(#${id}-alu)`} />
    </svg>
  );
}

export function Card({ id, className = '' }: DeviceProps) {
  return (
    <svg viewBox="0 0 520 340" className={className} role="img" aria-label="Lumina Card">
      <defs>
        <linearGradient id={`${id}-ti`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#ececf0" />
          <stop offset="1" stopColor="#cfcfd6" />
        </linearGradient>
      </defs>
      <g transform="rotate(-8 260 170)">
        <rect x="70" y="50" width="380" height="240" rx="20" fill={`url(#${id}-ti)`} stroke="#00000012" />
        <g transform="translate(110 100)" fill="#86868b">
          <LogoMarkPath fill="#86868b" />
        </g>
        <rect x="350" y="110" width="52" height="40" rx="8" fill="#d6c79c" />
        <text x="104" y="262" fill="#6e6e73" fontSize="18" fontWeight="600" letterSpacing="1">
          LUMINA CARD
        </text>
      </g>
    </svg>
  );
}
