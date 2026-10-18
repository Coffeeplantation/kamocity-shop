// 表示スタイル（テーマ）の共通定義。サーバー側の layout.tsx からも読むため、クライアント部品とは分けて置く。
export type ThemeName = 'nv' | 'apple';
export const THEME_KEY = 'lumina-theme';
export const DEFAULT_THEME: ThemeName = 'nv';
