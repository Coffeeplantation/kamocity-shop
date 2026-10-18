// 3D モデルの仕上げ（色）。three.js を読み込まずに参照できるよう別ファイルにしている。

export type Finish = {
  frame: string;
  back: string;
  plateau: string;
  wallpaper: [string, string, string, string];
};

export const FINISHES = {
  natural: { frame: '#c9c2b6', back: '#d3cdc2', plateau: '#c4bdb1', wallpaper: ['#1b1430', '#3a1d5c', '#ff8a3d', '#c43dff'] },
  blue: { frame: '#9fb3cf', back: '#b4c8e2', plateau: '#a6bbd8', wallpaper: ['#04122b', '#0b3b74', '#36c3ff', '#2d5bff'] },
  black: { frame: '#4a4a4e', back: '#3b3b3f', plateau: '#333336', wallpaper: ['#120a1f', '#2c1240', '#ff6a3d', '#9b3dff'] },
} satisfies Record<string, Finish>;
