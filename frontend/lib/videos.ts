// 背景動画の一覧。すべて Pexels License（無料・商用可・クレジット任意）の動画を、
// 1080p 前後・音声なし・10〜12 秒のループに再エンコードして public/videos に置いている。
// 人物の顔・実在の店舗名やロゴが映っていないものを選んでいる。

export type VideoInfo = {
  file: string; // public/videos/<file>.mp4 と、ポスター画像 <file>.jpg
  pexelsId: string; // pexels.com/video/<pexelsId>/
  alt: string;
  position?: string; // object-position
};

export const VIDEOS = {
  lighthouseDrone: { file: 'lighthouse-drone', pexelsId: '8419021', alt: '夕暮れの岬の灯台をドローンで巡る映像', position: '50% 55%' },
  lighthouseDusk: { file: 'lighthouse-dusk', pexelsId: '5762590', alt: '夕暮れの海と岬の灯台' },
  fishIce: { file: 'fish-ice', pexelsId: '10039851', alt: '氷の上に並ぶ鮮魚' },
  wavesAerial: { file: 'waves-aerial', pexelsId: '2833843', alt: '上空から見た、岩礁に打ち寄せる波' },
  produce: { file: 'produce', pexelsId: '15645011', alt: '市場の店先に並ぶ野菜と果物' },
} satisfies Record<string, VideoInfo>;

export type VideoKey = keyof typeof VIDEOS;
