# Lumina フロントエンド（Next.js）

架空ブランド「Lumina」の製品サイト、道の駅「Lumina 湊町」、地元・新潟県加茂市のローカル情報（`/kamo`）をまとめたサイトです。

## 別の PC で開発を始める

必要なもの：Git、Node.js 20 以上（npm 同梱）

```bash
git clone https://github.com/Coffeeplantation/furima-38654.git kamocity-shop
cd kamocity-shop/frontend
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

すでにクローン済みの PC では、最新を取り込んでから起動します。

```bash
cd kamocity-shop
git pull
cd frontend
npm install   # 依存関係が増えていることがあるため
npm run dev
```

## ページ

| URL | 内容 |
| --- | --- |
| `/` | トップ（製品ナビ・製品カード・製品紹介）。左上のロゴで道の駅へ |
| `/store` | ストア（出品データ。Rails の API が必要） |
| `/stores` | 道の駅「Lumina 加茂」（架空・新潟県加茂市がテーマ）：入荷・旬・店舗・営業時間・マップ・混雑・イベント・ニュース・アクセス |
| `/kamo` | 加茂ローカル（実在）：天気、美人の湯行きバス、月ごとの行事、見どころ、名物、豆知識 |

## 表示スタイル

ヘッダー（広い画面）・スマホのメニュー・フッターで「NVIDIA 風 / Apple 風」を切り替えられます（初期値は NVIDIA 風）。
色と角丸は `app/globals.css` の `[data-theme]` ごとの CSS 変数で管理しています。

## データの場所

- `lib/storeInfo.ts` など：架空の道の駅のデータ（加茂市の特産・名所は実在の情報。出典はファイル冒頭）
- `lib/news.ts`：加茂市・新潟のニュースの配信元（RSS）。サイトに載せる配信元と、Slack 通知だけで使う配信元を分けている
- `lib/kamo.ts`：加茂市の実在の情報（バス時刻は加茂市公共交通時刻表 令和8年6月1日改正）。時刻表が改正されたらここを更新します。
- `lib/photos.ts` / `lib/videos.ts`：写真（Unsplash）と背景動画（Pexels、`public/videos`）

## 動作確認用

URL に `?now=2026-10-24T11:30` を付けると、その日時（日本時間）として営業状況・バス・イベントを表示します。

## Slack 連携・自動更新

### 1日3回の自動更新（朝 7 時・昼 12 時・夕方 18 時ごろ）

`vercel.json` の Cron Jobs が `/api/cron/kamo` を 1日3回呼び、次の 2 つを行います。

1. 加茂市・新潟のニュースを取り直して、道の駅のページを更新する
2. 「加茂のいま」（道の駅の営業・イベント・おすすめ、天気、美人の湯行きバス、ニュース）を Slack に送る

Vercel の Hobby プランは 1 つの Cron が 1日1回までなので、時刻ごとに 3 つ登録しています（実行時刻は ±1 時間ずれることがあります）。
Vercel の環境変数に `CRON_SECRET`（長いランダムな文字列）を設定してください。設定がないと Cron の呼び出しは断られます。

ニュースの配信元と表示先：

| 配信元 | サイト | Slack |
| --- | --- | --- |
| 加茂市 新着情報（公式 RSS） | ○ | ○ |
| Google ニュース「加茂市 新潟」「新潟県」 | ○（Google ニュースと配信元を表記） | ○ |
| Yahoo!ニュース 地域（新潟の記事のみ） | ×（サイト掲載の条件が確認できないため） | ○ |
| Bing ニュース「加茂市」（Microsoft） | ×（個人的・非商業的な RSS リーダーでの利用に限られるため） | ○ |

### Slack に投稿したイベントを道の駅のページに表示する

Slack のチャンネルに次の形で投稿すると、道の駅のページの「今日のイベント」とイベントカレンダーに表示されます（「新着」の印が付きます）。

```
【イベント】秋の収穫祭
日付：10/24
時間：9:00〜16:00
場所：屋外広場
内容：新米の試食と、桐の小物づくり。   … 省略可
種類：マルシェ                         … セッション / 体験 / マルシェ / サポート / 特別（省略すると特別イベント）
予約：要                               … 省略可（「不要」や省略は予約不要）
料金：500円                            … 省略可
```

- 日付・時間・場所のどれかが読み取れない投稿は表示しません。投稿を編集・削除すると表示も変わります。
- 年を書かなければ、投稿日から見て次に来る日付になります（12月に「1/10」と書けば翌年の 1月10日）。

設定：

1. Slack アプリ（https://api.slack.com/apps）を作り、Bot Token Scopes に `channels:history`（非公開チャンネルなら `groups:history`）と `chat:write` を追加してワークスペースにインストールする
2. イベント用のチャンネルにボットを招待する（`/invite @アプリ名`）
3. 環境変数に `SLACK_BOT_TOKEN`（xoxb-）と `SLACK_EVENTS_CHANNEL_ID`（チャンネル ID）を設定する。ページは最長 5 分ごとに読み直す
4. すぐ反映したい場合は、アプリの「Event Subscriptions」を有効にして Request URL に `https://<サイト>/api/slack/events` を入れ、Bot Events に `message.channels` を追加し、`SLACK_SIGNING_SECRET` を設定する

### 手動で送る

「加茂のいま」を手動で Slack に送れます。

```bash
npm run slack:kamo            # 送る内容を表示するだけ（送信しない）
npm run slack:kamo -- --send  # .env.local の設定で Slack に送る
```

`.env.local` に `SLACK_WEBHOOK_URL`（または `SLACK_BOT_TOKEN` と `SLACK_CHANNEL_ID`）を入れると実際に送信されます。設定がなければ送信しません。
サーバー起動中は `GET /api/slack/kamo` で送る内容を確認、`POST /api/slack/kamo` で送信できます。設定項目は `.env.example` を参照してください。

## API・環境変数（任意）

ストア・ログイン・購入は Rails 側の API を使います。フロントの見た目だけ確認する場合は不要です。
使う場合は `frontend/.env.local` を作り、次の 2 つを設定します（鍵を含むため Git には入れていません。元の PC の値をコピーしてください）。

```
NEXT_PUBLIC_API_URL=Rails API の URL（例：http://localhost:3001/api/v1）
NEXT_PUBLIC_PAYJP_KEY=PAY.JP の公開鍵
```
