/**
 * WordPress → Contentful 移行スクリプト (AntiGravity 最終版)
 * * 修正点:
 * 1. .env.local からの環境変数読み込みを確実化
 * 2. WP APIへのアクセス時に User-Agent を追加（ブロック回避）
 * 3. 記事分割ロジックとContentful登録を統合
 * 4. ロケールを ja から en-US に変更 (Spaceのデフォルトに合わせるため)
 */

const dotenv = require('dotenv');
// .env.localファイルを明示的に読み込む
dotenv.config({ path: '.env.local' });

const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// --- 設定チェック ---
const {
  CONTENTFUL_SPACE_ID: SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN: MANAGEMENT_TOKEN
} = process.env;

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ エラー: 環境変数が読み込めていません。');
  console.error('.env.local に SPACE_ID と MANAGEMENT_TOKEN が正しく設定されているか確認してください。');
  process.exit(1);
}

const ENVIRONMENT_ID = 'master';
const WP_API_BASE = 'https://sportscommission.or.jp/wp-json/wp/v2';
const LOCALE = 'en-US'; // Spaceのデフォルトロケールに変更

// カテゴリー判定用キーワード
const CATEGORY_KEYWORDS = {
  'イベント': ['セミナー', '研究会', 'シンポジウム', '講演会', '開催します', '参加者募集'],
  'レポート': ['訪問', '意見交換', '開催しました', '実施しました', '参加しました', '会議'],
  'お知らせ': ['募集', 'お知らせ', '案内', '申込', '〆切'],
};

// HTMLタグ除去
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// 記事分割ロジック
function splitMonthlyPost(post) {
  const content = stripHtml(post.content.rendered);
  const datePattern = /(\d{4}\/\d{1,2}\/\d{1,2})/g;
  const matches = [...content.matchAll(datePattern)];

  if (matches.length === 0) {
    return [{
      title: post.title.rendered,
      date: post.date.split('T')[0],
      content: content,
    }];
  }

  const topics = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startIndex = match.index;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : content.length;
    const topicContent = content.substring(startIndex, endIndex).trim();
    const dateStr = match[1].replace(/\//g, '-');

    // 最初の行をタイトルにする
    const lines = topicContent.split('\n').filter(l => l.trim());
    let title = lines[1] || `${dateStr}の活動報告`; // 0行目は日付なので1行目
    if (title.length > 50) title = title.substring(0, 50) + '...';

    topics.push({ title, date: dateStr, content: topicContent });
  }
  return topics;
}

// カテゴリー判定
function detectCategory(text) {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return category;
  }
  return 'その他';
}

async function main() {
  console.log('🚀 移行プロセスを開始します...');

  try {
    // 1. WordPressから記事取得 (User-Agent付き)
    console.log('📥 WordPressから記事を取得中...');
    const response = await fetch(`${WP_API_BASE}/posts?per_page=100`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error(`WP APIエラー: ${response.status}`);
    const posts = await response.json();
    console.log(`✅ ${posts.length}件の記事を取得しました。`);

    // 2. Contentful接続
    const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    console.log('🔗 Contentfulに接続完了。');

    // 3. 記事の分割と登録
    for (const post of posts) {
      const topics = splitMonthlyPost(post);
      for (const topic of topics) {
        console.log(`📤 登録中: ${topic.title} (${topic.date})`);

        try {
          const entry = await environment.createEntry('news', {
            fields: {
              title: { [LOCALE]: topic.title },
              slug: { [LOCALE]: `post-${topic.date}-${Math.random().toString(36).slice(-4)}` },
              publishedAt: { [LOCALE]: `${topic.date}T00:00:00Z` },
              category: { [LOCALE]: detectCategory(topic.content) },
              body: {
                [LOCALE]: {
                  nodeType: 'document',
                  data: {},
                  content: [{
                    nodeType: 'paragraph',
                    data: {},
                    content: [{ nodeType: 'text', value: topic.content, marks: [], data: {} }]
                  }]
                }
              }
            }
          });
          await entry.publish();
          // 負荷軽減のための待機
          await new Promise(r => setTimeout(r, 800));
        } catch (e) {
          console.error(`❌ 登録失敗: ${topic.title}`, e.message);
          // エラー詳細を表示
          if (e.details && e.details.errors) {
            console.error('詳細:', JSON.stringify(e.details.errors, null, 2));
          }
        }
      }
    }

    console.log('\n✨ 全ての処理が完了しました！');

  } catch (error) {
    console.error('💥 致命的なエラー:', error.message);
  }
}

main();
