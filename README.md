# 一般財団法人日本スポーツコミッション 公式サイト

Next.js 15 + Contentful + Cloudflare Pages で構築された、モダンで高速なWebサイトです。

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **CMS**: Contentful (ヘッドレスCMS)
- **ホスティング**: Cloudflare Pages (CDN配信)
- **デプロイ**: Git連携による自動デプロイ

## 📋 セットアップ手順

### 1. まずはローカルで動作確認（Contentful不要）

`.env.local` はすでに設定済みで、**ダミーデータモード**になっています。

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてサイトのデザインを確認できます。

### 2. Contentful CMSの設定（本番運用時）

`CONTENTFUL_SETUP_GUIDE.md` を参照して、Contentfulのセットアップを完了してください。

### 3. 環境変数の更新（Contentful設定後）

`.env.local` を編集して、Contentfulの認証情報を設定：

```bash
# ダミーデータモードを無効化
# USE_MOCK_DATA=true  ← この行をコメントアウト

# Contentful認証情報を追加
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-delivery-api-token
```

### 4. 開発サーバーを再起動

```bash
npm run dev
```

Contentfulからのデータが表示されます。

## 🏗️ プロジェクト構造

```
.
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   ├── news/              # ニュース関連
│   │   ├── page.tsx       # ニュース一覧
│   │   └── [slug]/        # 記事詳細（動的ルート）
│   ├── about/             # 私たちについて
│   ├── contact/           # お問い合わせ
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── Header.tsx         # ヘッダー
│   └── Footer.tsx         # フッター
├── lib/                   # ユーティリティ
│   └── newt.ts            # Contentful CMSクライアント
├── types/                 # TypeScript型定義
│   └── newt.ts            # Contentful関連の型
├── public/                # 静的ファイル
│   └── _headers           # Cloudflare Pages用ヘッダー設定
└── next.config.ts         # Next.js設定
```

## 🎨 主な機能

### ✅ 実装済み

- トップページ（ヒーロー、最新ニュース、特徴セクション）
- ニュース一覧ページ
- ニュース詳細ページ（動的ルーティング）
- 私たちについてページ
- お問い合わせページ
- レスポンシブデザイン（モバイル完全対応）
- 静的サイト生成（SSG）による高速表示
- SEO対策（メタタグ、構造化データ対応）

### 🔄 Contentfulとの連携

- ニュース記事の取得・表示
- カテゴリー分類
- アイキャッチ画像の表示
- リッチテキストエディタによる本文表示
- 公開日順のソート

## 📦 ビルド＆デプロイ

### ローカルでのビルドテスト

```bash
npm run build
```

ビルドが成功すると、`out/` ディレクトリに静的ファイルが生成されます。

### Cloudflare Pagesへのデプロイ

`CLOUDFLARE_DEPLOY_GUIDE.md` を参照して、Cloudflare Pagesにデプロイしてください。

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド（静的エクスポート）
npm run build

# Lint実行
npm run lint
```

## 📱 モバイル対応

このサイトは完全にレスポンシブ対応しており、以下のブレークポイントで最適化されています：

- モバイル: 〜768px
- タブレット: 768px〜1024px
- デスクトップ: 1024px〜

## ⚡ パフォーマンス

- **静的サイト生成**: ビルド時に全ページを生成し、CDNから配信
- **画像最適化**: Next.jsの画像最適化（Cloudflare Pages対応）
- **Tailwind CSS**: 使用していないCSSを自動削除
- **Cloudflare CDN**: 世界中のエッジサーバーから高速配信

## 🔐 セキュリティ

- HTTPSによる暗号化通信
- セキュリティヘッダーの設定（`public/_headers`）
- Cloudflare DDoS Protection
- 環境変数による認証情報の安全な管理

## 📝 コンテンツ更新フロー

1. [Contentful管理画面](https://app.newt.so/)にログイン
2. ニュース記事を作成・編集
3. 「公開」ボタンをクリック
4. Webhook経由で自動的にサイトが再ビルド（約3分）
5. 新しいコンテンツが公開サイトに反映

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### コンテンツが表示されない

1. `.env.local` の設定を確認
2. Contentfulの環境変数が正しいか確認
3. Contentfulでコンテンツが「公開済み」になっているか確認

### 開発サーバーが起動しない

```bash
# ポート3000が使用中の場合、別のポートで起動
PORT=3001 npm run dev
```

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentful Documentation](https://www.newt.so/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 ライセンス

© 2026 一般財団法人日本スポーツコミッション. All rights reserved.

---

**開発**: Claude Code (Anthropic) + のちさん
**更新日**: 2026年2月16日
