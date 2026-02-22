# 引継書 — SCJ HP 開発状況

最終更新：2026-02-22

---

## プロジェクト概要

**一般財団法人日本スポーツコミッション（SCJ）公式サイト**

- フレームワーク：Next.js（`output: 'export'` 静的エクスポート）
- ホスティング：Cloudflare Pages（GitHub mainブランチへのpushで自動ビルド）
- CMS：Contentful（Content Type: `news`）
- リポジトリ：`https://github.com/TokyoSports-UT9-2618/scj`

---

## 環境変数（`.env.local`）

| 変数名 | 用途 |
|---|---|
| `CONTENTFUL_SPACE_ID` | `nxfitkrn7x84` |
| `CONTENTFUL_ENVIRONMENT` | `master` |
| `CONTENTFUL_DELIVERY_TOKEN` | Delivery API（読み取り） |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Management API（書き込み） |
| `CLOUDFLARE_DEPLOY_HOOK` | 登録後に自動再ビルドするためのWebhook URL |

---

## 自動デプロイの仕組み

**2つのルートで自動デプロイが動く：**

1. **管理ツール（PDF登録）経由** — `/submit` 成功後に `triggerCloudflareDeploy()` を呼び出し
2. **Contentful管理画面経由** — Contentful Webhook が設定済み（Webhook ID: `0ur21aV8GfLMuCWotdR11E`）

Contentfulで「公開」「非公開」「削除」のいずれかを行うと、自動的にCloudflare Pagesのビルドがトリガーされる。**数分後にサイトへ反映。**

---

## セミナーの登録・公開・アーカイブ化フロー

### 新規セミナーをContentfulで直接登録する場合

| フィールド | 値 | 備考 |
|---|---|---|
| `title` | セミナータイトル | 必須 |
| `slug` | 空欄でもOK | 空の場合はフォールバックで自動生成 |
| `publishedAt` | 開催日（未来日付） | 必須 |
| `startTime` | 例: `13:00` | 任意 |
| `endTime` | 例: `17:00` | 任意 |
| `venue` | 開催場所名 | 任意 |
| `venueAddress` | 会場住所 | 任意 |
| `applyUrl` | 申込フォームURL | あると申込ボタンが表示される |
| `applyDeadline` | 申込締切日 | 任意 |
| `category` | **`イベント`** | ← これが重要 |
| `projectCategory` | **`seminars`** | ← これも必須（セミナーページに出る） |
| `body` | Rich Text本文 | 任意 |

### 「開催予定」→「過去アーカイブ」に切り替えたい場合

Contentful管理画面で `category` を `イベント` → `レポート` に変更して「公開」するだけ。
自動デプロイで数分後に反映される。

---

## 管理ツール（PDF→Contentful登録）

※**過去資産のPDF一括登録用**。新規セミナーはContentful管理画面から直接登録推奨。

### 場所
```
scripts/admin/server.js   ← サーバー本体
scripts/admin/index.html  ← ブラウザUI
```

### 起動方法
```bash
cd scripts/admin
node server.js
# → http://localhost:4000 をブラウザで開く
```

### 動作フロー
1. ブラウザでPDFをアップロード
2. サーバーがPDFテキストを抽出・パース（Claude APIがあれば自動解析）
3. Contentful Management APIで新規エントリ作成・公開
4. Cloudflare Deploy Hook を POST → サイト自動再ビルド（数分で反映）

---

## Contentful Content Type: `news`

### 全フィールド

| フィールドID | 型 | 備考 |
|---|---|---|
| `title` | Short text | セミナータイトル |
| `slug` | Short text | URLスラッグ。`omitted: false` に修正済み（**重要・戻さないこと**） |
| `publishedAt` | Date | 開催日 |
| `startTime` | Short text | 開始時刻（HH:MM形式） |
| `endTime` | Short text | 終了時刻（HH:MM形式） |
| `venue` | Short text | 開催場所名 |
| `venueAddress` | Short text | 会場住所 |
| `applyUrl` | Short text | 申込URL |
| `applyDeadline` | Date | 申込締切日 |
| `coverImage` | Media | カバー画像 |
| `category` | Short text | `お知らせ` `イベント` `レポート` `その他` |
| `body` | Rich Text | 本文 |
| `metaDescription` | Short text | メタ説明文（要約・リード文にも使用） |
| `projectCategory` | Short text | `seminars` など（セミナーページへの表示に必須） |
| `projectTags` | Array | 検索用タグ（講演者名・キーワード） |

---

## 主要ファイル

### `lib/contentful-helpers.ts`
ContentfulエントリをアプリのNews型に変換。`\n` → `<br />` 変換でスピーカー改行表示。

### `app/seminars/page.tsx`
セミナー一覧ページ。

- `category === 'イベント' && publishedAt >= 今日` → 開催予定に分類
- それ以外 → 過去アーカイブに分類
- `featured = upcoming[0] ?? past[0]` — 開催予定がない時は最新アーカイブを表示
- `FeaturedSeminarCard` — 日時・会場・申込URLを専用UIで表示。`applyUrl` があると金色の申込ボタンが出る

### `app/news/[slug]/page.tsx`
セミナー詳細ページ（静的生成）。

---

## 静的サイト × Contentful の注意点

Next.js の `output: 'export'` は**ビルド時点のデータだけ**を使って静的HTML生成。

新しいセミナーを登録しても、**Cloudflareでビルドし直さないと404になる**。

→ Contentful Webhookで自動解決済み。Contentfulで「公開」するとビルドが走る。

---

## ✅ 完了済み作業

1. **404修正** — Deploy Hook で登録後に自動再ビルド
2. **slug フィールド修正** — Contentful Content Typeの `slug` を `omitted: false` に変更
3. **最新セミナー常時表示** — `upcoming` 空時は `past[0]` にフォールバック
4. **セミナー詳細ページレイアウト改善** — `○` → `h3`、prose スタイル調整
5. **`\n` → `<br />` 変換** — `renderText` オプション追加
6. **Contentful Webhook設定** — 管理画面で公開するだけで自動デプロイ
7. **新フィールド追加** — venue / startTime / endTime / applyUrl / applyDeadline
8. **FeaturedSeminarCard デザイン刷新** — インフォボックス・申込ボタン追加

---

## 🔲 残タスク

### 管理ツール：更新機能
同じセミナーのPDFが更新された場合、現状は**毎回新規エントリが作られる**。

**実装方針（案）**：
- 登録時に同一 `slug` の既存エントリをManagement APIで検索
- 存在すれば → unpublish → delete → 新規作成

対象ファイル：`scripts/admin/server.js` の `/submit` ハンドラ

---

## よくある作業メモ

### Contentfulエントリを手動削除したい
```bash
# unpublish
curl -X DELETE "https://api.contentful.com/spaces/nxfitkrn7x84/environments/master/entries/{ENTRY_ID}/published" \
  -H "Authorization: Bearer $CONTENTFUL_MANAGEMENT_TOKEN"

# delete
curl -X DELETE "https://api.contentful.com/spaces/nxfitkrn7x84/environments/master/entries/{ENTRY_ID}" \
  -H "Authorization: Bearer $CONTENTFUL_MANAGEMENT_TOKEN"
```

### Cloudflare手動ビルド
```bash
source .env.local && curl -X POST "$CLOUDFLARE_DEPLOY_HOOK"
```

### Contentful Delivery APIでエントリ確認
```bash
curl "https://cdn.contentful.com/spaces/nxfitkrn7x84/environments/master/entries?content_type=news&select=fields.slug,fields.title&limit=10" \
  -H "Authorization: Bearer $CONTENTFUL_DELIVERY_TOKEN"
```
