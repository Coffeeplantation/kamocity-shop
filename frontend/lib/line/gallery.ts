// LINE から届いた写真の「見せ方」。管理者が承認するときに 1 枚ずつ決め、写真を載せる場所（スペース）ごとに並べ方を選ぶ。
// サーバー・ブラウザのどちらでも使う（通信はしない）。並べ方は、よく知られたサイトの写真の見せ方を手本にしている。

export type SpaceId = 'stores' | 'store';
export const SPACES: Record<SpaceId, { label: string; href: string }> = {
  stores: { label: 'メインページの写真欄', href: '/stores#photos' },
  store: { label: 'ストアページ', href: '/store' },
};

export type GalleryLayout = 'grid' | 'masonry' | 'carousel' | 'collage' | 'feature';
export const LAYOUTS: Record<GalleryLayout, { label: string; like: string }> = {
  grid: { label: 'グリッド', like: 'Instagram のプロフィールのように、正方形でそろえて並べる' },
  masonry: { label: 'メイソンリー', like: 'Pinterest のように、縦横の比率を生かして石積みに並べる' },
  carousel: { label: 'カルーセル', like: 'Apple の製品ページのように、横にスクロールして見る' },
  collage: { label: 'コラージュ', like: 'Google フォトのハイライトのように、大小のタイルを組み合わせる' },
  feature: { label: 'フィーチャー', like: 'Airbnb の写真のように、1 枚を大きく、残りを小さく添える' },
};

// 大きさ：コラージュではタイルの広さ、メイソンリー・カルーセルでは縦横の比率になる
export type PhotoSize = 's' | 'wide' | 'tall' | 'xl';
export const SIZES: Record<PhotoSize, { label: string; aspect: string; span: string; carousel: string }> = {
  s: { label: '小（正方形）', aspect: 'aspect-square', span: '', carousel: 'w-[60vw] max-w-[260px]' },
  wide: { label: '横長', aspect: 'aspect-[4/3]', span: 'col-span-2', carousel: 'w-[80vw] max-w-[420px]' },
  tall: { label: '縦長', aspect: 'aspect-[3/4]', span: 'row-span-2', carousel: 'w-[56vw] max-w-[240px]' },
  xl: { label: '大', aspect: 'aspect-[4/5]', span: 'col-span-2 row-span-2', carousel: 'w-[86vw] max-w-[520px]' },
};

export type PhotoFrame = 'none' | 'rounded' | 'polaroid' | 'circle' | 'shadow' | 'border';
export const FRAMES: Record<PhotoFrame, string> = {
  none: '枠なし',
  rounded: '角丸',
  polaroid: 'ポラロイド',
  circle: '丸',
  shadow: '影つき',
  border: '白い縁',
};

// カーソルを載せたとき（スマホでは触れたとき）の動き
export type PhotoHover = 'none' | 'zoom' | 'lift' | 'tilt' | 'color' | 'caption';
export const HOVERS: Record<PhotoHover, string> = {
  none: '動かさない',
  zoom: 'ふわっと拡大',
  lift: '浮き上がる',
  tilt: '少し傾く',
  color: 'モノクロ → カラー',
  caption: 'キャプションが出る',
};

export type PhotoStyle = {
  size: PhotoSize;
  frame: PhotoFrame;
  fit: 'cover' | 'contain'; // cover … 枠いっぱいに切り抜く / contain … 写真全体を収める
  x: number; // 切り抜く位置（0〜100、左→右）
  y: number; // 切り抜く位置（0〜100、上→下）
  zoom: number; // 拡大（1〜3）
  caption: string;
  hover: PhotoHover;
  spaces: SpaceId[];
  pinned: boolean; // 先頭に固定
};

export const DEFAULT_STYLE: PhotoStyle = { size: 's', frame: 'rounded', fit: 'cover', x: 50, y: 50, zoom: 1, caption: '', hover: 'zoom', spaces: ['stores'], pinned: false };

export type GallerySettings = { layouts: Record<SpaceId, GalleryLayout>; photos: Record<string, PhotoStyle> };
export const DEFAULT_SETTINGS: GallerySettings = { layouts: { stores: 'collage', store: 'grid' }, photos: {} };

export type GalleryPhoto = { id: string; url: string; postedAt: string; style: PhotoStyle };

const clamp = (n: unknown, lo: number, hi: number, d: number) => (typeof n === 'number' && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d);
const oneOf = <T extends string>(v: unknown, keys: Record<T, unknown>, d: T): T => (typeof v === 'string' && v in keys ? (v as T) : d);

// 管理画面から届いた値・保存してあった値を、使える形にそろえる
export function normalizeStyle(v: unknown): PhotoStyle {
  const o = (v && typeof v === 'object' ? v : {}) as Partial<Record<keyof PhotoStyle, unknown>>;
  const spaces = Array.isArray(o.spaces) ? (o.spaces.filter((s) => typeof s === 'string' && s in SPACES) as SpaceId[]) : DEFAULT_STYLE.spaces;
  return {
    size: oneOf(o.size, SIZES, DEFAULT_STYLE.size),
    frame: oneOf(o.frame, FRAMES, DEFAULT_STYLE.frame),
    fit: o.fit === 'contain' ? 'contain' : 'cover',
    x: clamp(o.x, 0, 100, 50),
    y: clamp(o.y, 0, 100, 50),
    zoom: clamp(o.zoom, 1, 3, 1),
    caption: typeof o.caption === 'string' ? o.caption.slice(0, 60) : '',
    hover: oneOf(o.hover, HOVERS, DEFAULT_STYLE.hover),
    spaces,
    pinned: o.pinned === true,
  };
}

export function normalizeSettings(v: unknown): GallerySettings {
  const o = (v && typeof v === 'object' ? v : {}) as { layouts?: Record<string, unknown>; photos?: Record<string, unknown> };
  const layouts = { ...DEFAULT_SETTINGS.layouts };
  for (const s of Object.keys(SPACES) as SpaceId[]) layouts[s] = oneOf(o.layouts?.[s], LAYOUTS, layouts[s]);
  const photos: Record<string, PhotoStyle> = {};
  for (const [k, p] of Object.entries(o.photos ?? {})) photos[k] = normalizeStyle(p);
  return { layouts, photos };
}

// 先頭に固定した写真 → 新しい順
export const sortPhotos = (list: GalleryPhoto[]) =>
  [...list].sort((a, b) => Number(b.style.pinned) - Number(a.style.pinned) || b.postedAt.localeCompare(a.postedAt));
