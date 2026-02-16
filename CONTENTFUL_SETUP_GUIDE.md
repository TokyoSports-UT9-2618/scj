# Contentful セットアップガイド

このガイドに従って、Contentfulの設定を行ってください。

## 1. Contentfulアカウント作成

1. https://www.contentful.com/ にアクセス
2. 「Start building for free」をクリック
3. メールアドレスで登録（またはGitHub/Google連携）
4. 無料プラン（Free）を選択

## 2. スペース作成

1. 「Create a space」をクリック
2. スペース名: `Sports Commission`（任意）
3. 「Empty space」を選択
4. 「Create space」をクリック

## 3. コンテンツモデルの作成

### 📝 Newsモデル（ニュース記事）

1. 左サイドバーから「Content model」をクリック
2. 「Add content type」をクリック
3. 以下を入力：
   - **Name**: `News`
   - **API Identifier**: `news`（自動生成される）
4. 「Create」をクリック

### フィールドの追加

「Add field」ボタンから、以下のフィールドを順番に追加していきます：

#### 1. タイトル
- **Field type**: Text
- **Name**: `Title`
- **Field ID**: `title`
- **Appearance**: Single line
- **Validation**: Required（必須）

#### 2. スラッグ
- **Field type**: Text
- **Name**: `Slug`
- **Field ID**: `slug`
- **Appearance**: Single line
- **Validation**: Required（必須）、Unique（一意）

#### 3. 公開日
- **Field type**: Date and time
- **Name**: `Published At`
- **Field ID**: `publishedAt`
- **Validation**: Required（必須）

#### 4. カバー画像
- **Field type**: Media
- **Name**: `Cover Image`
- **Field ID**: `coverImage`
- **Validation**: 任意（必須ではない）
- **Media type**: One file

#### 5. カテゴリー
- **Field type**: Text
- **Name**: `Category`
- **Field ID**: `category`
- **Appearance**: Dropdown
- **Predefined values**（選択肢を追加）:
  - `お知らせ`
  - `イベント`
  - `レポート`
  - `その他`
- **Validation**: 任意

#### 6. 本文
- **Field type**: Rich text
- **Name**: `Body`
- **Field ID**: `body`
- **Validation**: Required（必須）

#### 7. メタ説明
- **Field type**: Text
- **Name**: `Meta Description`
- **Field ID**: `metaDescription`
- **Appearance**: Single line
- **Validation**: 任意
- **Help text**: `SEO用のディスクリプション（160字以内推奨）`

### Entry titleの設定

1. 「Settings」タブをクリック
2. 「Entry title」で `title` フィールドを選択
3. 「Save」

これで、コンテンツ一覧で記事タイトルが表示されるようになります。

## 4. APIキーの取得

1. 左サイドバーから「Settings」→「API keys」をクリック
2. 「Add API key」をクリック
3. 名前: `Website`（任意）
4. 「Save」をクリック
5. 以下の情報をコピーしてメモ：
   - **Space ID**
   - **Content Delivery API - access token**

⚠️ **注意**: Content Preview API（CDN）ではなく、**Content Delivery API** のトークンを使用してください。

## 5. テストコンテンツの作成

1. 左サイドバーから「Content」をクリック
2. 「Add entry」→「News」を選択
3. 以下の内容で記事を作成：

**記事1: サイトリニューアルのお知らせ**
- **Title**: `公式サイトをリニューアルしました`
- **Slug**: `site-renewal-2026`
- **Published At**: 今日の日付
- **Category**: `お知らせ`
- **Body**:
  ```
  この度、一般財団法人日本スポーツコミッションの公式サイトをリニューアルいたしました。

  新しいサイトでは、より見やすく、使いやすいデザインに刷新し、
  モバイル端末でも快適にご覧いただけるようになりました。

  今後とも、どうぞよろしくお願いいたします。
  ```
- **Meta Description**: `日本スポーツコミッション公式サイトをリニューアルしました。`

4. 「Publish」ボタンをクリック

### 追加でテスト記事を2-3件作成
動作確認のため、合計3件程度の記事を作成してください。

## 6. 環境変数の設定

プロジェクトの `.env.local` ファイルを以下のように更新：

```bash
# Contentful設定
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-delivery-api-token
```

`.env.local.example` も更新しておきます。

## 7. 完了チェックリスト

- [ ] Contentfulアカウントを作成
- [ ] スペース「Sports Commission」を作成
- [ ] Newsモデルを定義（7フィールド）
- [ ] APIキー（Space ID、Delivery API token）を取得
- [ ] テスト記事を3件作成・公開
- [ ] `.env.local` に認証情報を設定
- [ ] `npm run dev` でローカル動作確認

---

## 💡 Tips

### 日本語UIに切り替え
1. 右上のアカウントアイコンをクリック
2. 「User settings」
3. 「Language」で「日本語」を選択

### 画像の追加方法
1. 記事編集画面で「Cover Image」フィールドをクリック
2. 「Select existing asset」または「Upload new asset」
3. 画像をアップロード（推奨: 1200x630px以上）

### リッチテキストの使い方
Bodyフィールドでは以下が使えます：
- 見出し（H2, H3）
- 太字、斜体
- リスト（箇条書き、番号付き）
- リンク
- 画像の埋め込み
- 引用

---

## トラブルシューティング

### APIキーが表示されない
「Settings」→「API keys」→既存のキーをクリックすると再表示されます。

### 記事が表示されない
- 記事が「Published」状態になっているか確認
- APIトークンが「Content Delivery API」のものか確認（Preview APIではない）

### 画像が表示されない
Contentfulの画像URLは自動的に `images.ctfassets.net` から配信されます。特別な設定は不要です。

---

設定が完了したら、Next.jsプロジェクトで `npm run dev` を実行して動作確認してください！
