# Cloudflare Pages デプロイガイド

このガイドに従って、Next.jsサイトをCloudflare Pagesにデプロイしてください。

## 前提条件

- ✅ Cloudflareアカウント（既に所有済み）
- ✅ GitHubリポジトリ（このプロジェクトをプッシュ）
- ✅ Contentful CMSの設定完了（NEWT_SETUP_GUIDE.md参照）

## デプロイ手順

### 1. GitHubにプロジェクトをプッシュ

```bash
# Gitリポジトリの初期化（まだの場合）
git init
git add .
git commit -m "Initial commit: Next.js + Contentful CMS site"

# GitHubリポジトリを作成してプッシュ
git remote add origin https://github.com/YOUR_USERNAME/sportscommission-site.git
git branch -M main
git push -u origin main
```

### 2. Cloudflare Pagesプロジェクトの作成

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/)にログイン
2. 左メニューから「Workers & Pages」を選択
3. 「Create application」→「Pages」→「Connect to Git」を選択
4. GitHubを連携し、このリポジトリを選択

### 3. ビルド設定

以下の設定を入力してください：

| 項目 | 値 |
|-----|-----|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` （デフォルト） |
| **Node version** | 20.x 以上 |

### 4. 環境変数の設定

「Settings」→「Environment variables」から以下の環境変数を追加：

```bash
NEWT_SPACE_UID=your-space-uid
NEWT_APP_UID=website
NEWT_API_TOKEN=your-cdn-api-token
```

**重要**:
- 「Production」と「Preview」の両方に同じ値を設定してください
- トークンは必ず「CDN API token」（読み取り専用）を使用

### 5. デプロイ実行

「Save and Deploy」をクリックすると、自動的にビルド＆デプロイが開始されます。

初回デプロイは3〜5分程度かかります。

### 6. カスタムドメインの設定（オプション）

sportscommission.or.jp をこのサイトに向ける場合：

1. Cloudflare Pagesプロジェクトの「Custom domains」タブを開く
2. 「Set up a custom domain」をクリック
3. `sportscommission.or.jp` を入力
4. DNS設定の指示に従って、CNAMEレコードを追加

**既存のWordPressサイトと並行運用する場合**:
- サブドメイン（例: `new.sportscommission.or.jp`）で先に公開
- テスト後、メインドメインに切り替え

## 自動デプロイ（CI/CD）

Cloudflare Pagesは、GitHubのmainブランチへのpushを検知して自動的にデプロイします。

```bash
# ローカルで変更を加えたら
git add .
git commit -m "Update content"
git push origin main

# 約3分後、自動的にデプロイされます
```

## Contentfulとの連携

Contentfulでコンテンツを更新した際に自動デプロイするには、Webhook設定が必要です：

### Webhook設定手順

1. **Cloudflare Pages側**:
   - プロジェクトの「Settings」→「Builds & deployments」
   - 「Deploy hooks」から新しいフックを作成
   - URLをコピー（例: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy/xxx`）

2. **Contentful側**:
   - App設定 → Webhooks
   - 新しいWebhookを作成
   - URLに上記のCloudflare URLを設定
   - イベント: 「Content published」「Content unpublished」を選択

これで、Contentfulで記事を公開/非公開にするたびに、自動的にサイトが再ビルドされます。

## パフォーマンス最適化

Cloudflare Pagesは自動的に以下を提供します：

- ✅ 世界中のCDNからの配信
- ✅ HTTP/2 & HTTP/3対応
- ✅ 自動HTTPS化
- ✅ Brotli圧縮
- ✅ DDoS protection

追加の最適化設定は、Cloudflare ダッシュボードの「Speed」タブから可能です。

## トラブルシューティング

### ビルドエラーが出る場合

1. ローカルで `npm run build` が成功するか確認
2. Node.jsバージョンが20.x以上か確認
3. 環境変数が正しく設定されているか確認

### コンテンツが表示されない場合

1. Contentfulの環境変数が正しいか確認（`NEWT_SPACE_UID`, `NEWT_API_TOKEN`）
2. ContentfulのCDN API tokenが正しいか確認（Management API tokenではない）
3. Contentfulでコンテンツが「公開済み」になっているか確認

### 画像が表示されない場合

`next.config.ts` の `images.unoptimized: true` 設定を確認

## 料金について

Cloudflare Pagesは **無料プラン** で以下が利用可能：

- 無制限のサイト数
- 無制限のリクエスト
- 無制限の帯域幅
- 月500ビルド

このプロジェクト規模であれば、無料プランで十分です。

---

## 次のステップ

デプロイが完了したら：

1. ✅ サイトが正しく表示されるか確認
2. ✅ Contentfulで新しい記事を作成して表示テスト
3. ✅ モバイルでの表示確認
4. ✅ ページ速度テスト（[PageSpeed Insights](https://pagespeed.web.dev/)）

問題がなければ、本番運用開始です！🎉
