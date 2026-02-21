# SCJ HP リニューアル プロジェクトメモ
最終更新: 2026-02-21

## プロジェクト概要
- **サイト**: 一般財団法人日本スポーツコミッション HP
- **技術スタック**: Next.js 15 + Contentful + Cloudflare Pages
- **リポジトリ**: https://github.com/TokyoSports-UT9-2618/scj
- **本番URL**: https://scj-4cb.pages.dev
- **デプロイ**: GitHub main ブランチへのpushで自動デプロイ
- **ローカルパス**: `/Users/takahironochiseabirdinc./Downloads/ClaudeCode/HP/sportscomission`

## 環境変数 (.env.local)
```
CONTENTFUL_SPACE_ID=nxfitkrn7x84
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_MANAGEMENT_TOKEN=tp_GXnDwH8kJpi95iGGmueuTTolxLEmVLF0fCKivkmg
CONTENTFUL_ACCESS_TOKEN=78D3Fehg_W4ych9IqTBhNTc2Bt2_1E_ME7oNI0wF_to
```

## ビルドコマンド
```bash
# ローカルビルド（Turbopack無効で実行すること）
NO_TURBOPACK=1 npm run build

# .nextが壊れたら
rm -rf .next && NO_TURBOPACK=1 npm run build

# git add時に[id]をクォートすること
git add "app/projects/[id]/page.tsx"
```

## 技術的な注意点
- `output: 'export'` + `images: { unoptimized: true }` (Cloudflare Pages対応)
- `trailingSlash: true`
- Tailwind CSS v4 (`@theme inline`)
- カスタムカラー: `navy-900` / `accent-gold`
- Google Fonts（Noto Serif JP / Noto Sans JP）はローカルビルド時にネット不要 → `NO_TURBOPACK=1` で回避

## Contentful コンテンツモデル: news
| フィールド | 型 | 備考 |
|---|---|---|
| title | Short text | 必須 |
| slug | Short text | **非表示・自動生成**（コード側で `post-YYYY-MM-DD-xxxx` 生成） |
| publishedAt | Date & time | 手動入力（予約投稿兼用） |
| coverImage | Media | 任意 |
| category | Short text | お知らせ/イベント/レポート/その他（選択式） |
| body | Rich text | 本文 |
| metaDescription | Short text | 任意 |
| projectCategory | Short text | **選択式**（research/advocacy/pr-lectures/seminars/publishing/membership/related） |
| projectTags | Short text, list | 任意・複数入力 |

## Contentful Management API
Management Tokenがあるのでコードから直接設定変更可能。
```js
// 例: フィールド設定変更
fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/master/content_types/news`, {
  method: 'PUT',
  headers: { 'Authorization': 'Bearer ' + MANAGEMENT_TOKEN, ... }
})
```

## 主要ファイル構成
```
app/
  page.tsx                    # トップページ（理事長挨拶 + ニュース）
  projects/
    page.tsx                  # 実績一覧（7グループのタイルUI）
    [id]/page.tsx             # 実績詳細（タイムライン + Contentful連携）
  news/
    [slug]/page.tsx           # ニュース詳細
    [year]/[month]/page.tsx   # 月別アーカイブ
    p/[pageNum]/page.tsx      # ページネーション

components/
  Header.tsx                  # ロゴ画像（/logo.png）使用
  Hero.tsx                    # トップヒーロー
  ui/
    ProjectNewsAccordion.tsx  # 実績ページのアコーディオン（Client Component）
    MonthlyArchiveSidebar.tsx
    Pagination.tsx

lib/
  contentful.ts               # Contentfulクライアント初期化
  contentful-helpers.ts       # transformNewsEntry（slug自動生成含む）
  news-service.ts             # getAllNews / getNewsByProjectCategory 等
  projects-data.ts            # 7カテゴリの実績データ（AchievementItem型）
  books-data.ts               # 出版物データ（Book型）

types/
  contentful.ts               # NewsFields / News / ProjectCategoryId 型定義

public/
  logo.png                    # SCJロゴ（scj150_150.png）
  director.png                # 木田理事長写真
  books/
    book-ugoku.jpg            # スポーツで地域を動かす
    book-hiraku.jpg           # スポーツで地域を拓く
    book-tsukuru.jpg          # スポーツで地域をつくる
```

## 実装済み機能
- [x] トップページ: 理事長挨拶（写真＋要約文）
- [x] トップページ: 最新ニュース3件 + Pick Upイベント
- [x] 実績一覧ページ: 7グループのホバーアニメーションタイル
- [x] 実績詳細ページ: 令和/平成/昭和の時代別タイムライン
- [x] 実績詳細ページ: Contentful記事との連携（projectCategoryで紐付け）
- [x] 実績詳細ページ: アコーディオン展開（タイトルクリックで本文表示）
- [x] 出版ページ: 書影ギャラリー（書籍3冊 + 冊子・論文）
- [x] ヘッダー: SCJロゴ画像
- [x] Contentful: slugフィールド非表示・コード側で自動生成
- [x] Contentful: projectCategoryをドロップダウン選択式に設定（Management API使用）

## 今後やること（優先順）
- [ ] トップページ: 最新ニュースセクションをContentfulから動的に（現在は上位3件）
- [ ] 研究会・セミナーの新規コンテンツ管理（Contentfulに seminar モデル追加？）
- [ ] トップページ: 最新セミナー情報を表示
- [ ] /about ページのコンテンツ整備
- [ ] /members ページのコンテンツ整備
- [ ] /seminars ページのコンテンツ整備

## projectCategoryのID対応表
| ID | 日本語名 |
|---|---|
| research | 調査研究 |
| advocacy | 意見表明・提言 |
| pr-lectures | 広報・講演活動 |
| seminars | 研究会・セミナー |
| publishing | 出版事業 |
| membership | 会員事業 |
| related | 関連事業 |
