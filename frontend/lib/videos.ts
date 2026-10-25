// 背景動画の一覧。すべて Pexels License（無料・商用可・クレジット任意）の動画を、
// 音声なし・10〜12 秒のループに再エンコードして public/videos に置いている。
// 加茂の動画（small: true）は元の 4K / 1080p から作った 1080p の高画質版と、スマホ向けの 720p 版がある。
// 人物の顔・実在の店舗名やロゴが映っていないものを選んでいる。

export type VideoInfo = {
  file: string; // public/videos/<file>.mp4 と、ポスター画像 <file>.jpg
  pexelsId: string; // pexels.com/video/<pexelsId>/
  alt: string;
  position?: string; // object-position
  small?: boolean; // スマホ向けの <file>-sm.mp4（720p）があるか
};

export const VIDEOS = {
  lighthouseDrone: { file: 'lighthouse-drone', pexelsId: '8419021', alt: '夕暮れの岬の灯台をドローンで巡る映像', position: '50% 55%' },
  lighthouseDusk: { file: 'lighthouse-dusk', pexelsId: '5762590', alt: '夕暮れの海と岬の灯台' },
  fishIce: { file: 'fish-ice', pexelsId: '10039851', alt: '氷の上に並ぶ鮮魚' },
  wavesAerial: { file: 'waves-aerial', pexelsId: '2833843', alt: '上空から見た、岩礁に打ち寄せる波' },
  produce: { file: 'produce', small: true, pexelsId: '15645011', alt: '市場の店先に並ぶ野菜と果物' },
  riceMist: { file: 'rice-mist', small: true, pexelsId: '5153190', alt: '朝霧の中、水を張った田んぼの上を進む空撮' },
  riceWind: { file: 'rice-wind', small: true, pexelsId: '2876087', alt: '風に揺れる青い稲' },
  maple: { file: 'maple', small: true, pexelsId: '1494284', alt: '風に揺れる赤いモミジ' },
  snowForest: { file: 'snow-forest', small: true, pexelsId: '6904288', alt: '雪をかぶった林' },
} satisfies Record<string, VideoInfo>;

export type VideoKey = keyof typeof VIDEOS;
