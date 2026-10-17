# Lumina フロントエンド（Next.js）

架空ブランド「Lumina」の製品サイト、道の駅「Lumina 湊町」、地元・新潟県加茂市のローカル情報（`/kamo`）をまとめたサイトです。

## 別の PC で開発を始める

必要なもの：Git、Node.js 20 以上（npm 同梱）

```bash
git clone https://github.com/Coffeeplantation/furima-38654.git
cd furima-38654/frontend
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

すでにクローン済みの PC では、最新を取り込んでから起動します。

```bash
cd furima-38654
git pull
cd frontend
npm install   # 依存関係が増えていることがあるため
npm run dev
```

## ページ

| URL | 内容 |
| --- | --- |
| `/` | トップ（製品ナビ・製品カード・製品紹介・道の駅の今日・加茂のいま） |
| `/store` | ストア（出品データ。Rails の API が必要） |
| `/stores` | 道の駅「Lumina 湊町」（架空）：入荷・旬・店舗・営業時間・マップ・混雑・イベント・アクセス |
| `/kamo` | 加茂ローカル（実在）：天気、美人の湯行きバス、月ごとの行事、見どころ、名物、豆知識 |

## 表示スタイル

ヘッダー（広い画面）・スマホのメニュー・フッターで「NVIDIA 風 / Apple 風」を切り替えられます（初期値は NVIDIA 風）。
色と角丸は `app/globals.css` の `[data-theme]` ごとの CSS 変数で管理しています。

## データの場所

- `lib/storeInfo.ts` など：架空の道の駅のデータ
- `lib/kamo.ts`：加茂市の実在の情報（バス時刻は加茂市公共交通時刻表 令和8年6月1日改正）。時刻表が改正されたらここを更新します。
- `lib/photos.ts` / `lib/videos.ts`：写真（Unsplash）と背景動画（Pexels、`public/videos`）

## 動作確認用

URL に `?now=2026-10-24T11:30` を付けると、その日時（日本時間）として営業状況・バス・イベントを表示します。

## API・環境変数（任意）

ストア・ログイン・購入は Rails 側の API を使います。フロントの見た目だけ確認する場合は不要です。
使う場合は `frontend/.env.local` を作り、次の 2 つを設定します（鍵を含むため Git には入れていません。元の PC の値をコピーしてください）。

```
NEXT_PUBLIC_API_URL=Rails API の URL（例：http://localhost:3001/api/v1）
NEXT_PUBLIC_PAYJP_KEY=PAY.JP の公開鍵
```
