# 🚀 クイックスタートガイド

## 今すぐ始める2ステップ（Contentful不要）

### ステップ1: ローカルで起動（1分）⭐️

```bash
# 開発サーバー起動（環境変数は設定済み）
npm run dev
```

http://localhost:3000 を開いてサイトを確認！

**ダミーデータモード**なので、Contentfulの設定なしでデザインを確認できます。

### ステップ2: Cloudflare Pagesにデプロイ（15分）

1. GitHubに新規リポジトリを作成
2. このプロジェクトをpush:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
3. Cloudflare Pagesで「Connect to Git」
4. リポジトリを選択してビルド設定:
   - Framework: **Next.js**
   - Build command: `npm run build`
   - Build output: `out`
5. 環境変数を追加:
   - `USE_MOCK_DATA` = `true`
6. 「Save and Deploy」

**これだけで動作するサイトが公開されます！**

---

## 📝 本番運用時: Contentfulを設定（30分）

実際のCMSとして運用する場合は、Contentfulを設定します。

### ステップ1: Contentful CMSを設定（10分）

1. https://www.contentful.com/ にアクセスしてアカウント作成
2. 新しいスペースを作成
3. `CONTENTFUL_SETUP_GUIDE.md` を開いて、モデル定義を作成
4. テストニュースを3件作成
5. Space ID と Delivery API tokenをコピー

### ステップ2: 環境変数を更新（1分）

`.env.local` を編集:

```bash
# ダミーデータモードを無効化
# USE_MOCK_DATA=true  ← この行をコメントアウトまたは削除

# Contentful認証情報を追加
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-delivery-api-token
```

### ステップ3: 開発サーバーを再起動

```bash
npm run dev
```

Contentfulからのデータが表示されます！

---

## 🎯 次にやること

### Contentfulでコンテンツを増やす

- ニュース記事を追加
- カテゴリーを使い分ける（お知らせ/イベント/レポートなど）
- アイキャッチ画像をアップロード

### カスタマイズする

- `components/Header.tsx` でロゴやナビを編集
- `app/page.tsx` でトップページの文言を調整
- Tailwind CSSで色やデザインを変更

### 本番運用

- カスタムドメイン設定（`CLOUDFLARE_DEPLOY_GUIDE.md`参照）
- Webhook設定でコンテンツ更新時に自動デプロイ
- Google Analyticsなどのアクセス解析追加

---

## 💡 よくある質問

**Q. ローカルで起動したけどコンテンツが表示されない**
A. `.env.local` に `USE_MOCK_DATA=true` が設定されていれば、ダミーデータが表示されます。Contentful設定後は、環境変数が正しいか確認してください。

**Q. ダミーデータを本番デプロイしたくない**
A. Cloudflare Pagesの環境変数で `USE_MOCK_DATA` を削除し、Contentfulの認証情報を設定してください。

**Q. デプロイしたけどサイトが表示されない**
A. Cloudflare Pagesの環境変数に `USE_MOCK_DATA=true` またはContentfulの認証情報を設定したか確認。

**Q. 既存のWordPressサイトと並行運用したい**
A. まずは `new.sportscommission.or.jp` などサブドメインで公開して、テスト後にメインドメインに切り替えるのがおすすめ。

---

## 📞 困ったら

- `README.md` - 詳細なドキュメント
- `CONTENTFUL_SETUP_GUIDE.md` - Contentful設定の詳細
- `CLOUDFLARE_DEPLOY_GUIDE.md` - デプロイの詳細

それでも解決しない場合は、エラーメッセージをClaude Codeに共有してください！
