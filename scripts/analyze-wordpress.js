/**
 * WordPress REST API 分析スクリプト
 * 既存のWordPressサイトから記事データを取得して分析します
 */

const WORDPRESS_URL = 'https://sportscommission.or.jp';
const WP_API_BASE = `${WORDPRESS_URL}/wp-json/wp/v2`;

// 分析結果を格納
const analysis = {
  posts: [],
  categories: new Map(),
  tags: new Map(),
  images: [],
  totalPosts: 0,
  dateRange: { oldest: null, newest: null },
};

/**
 * WordPressから投稿を取得（ページネーション対応）
 */
async function fetchPosts(page = 1, perPage = 100) {
  const url = `${WP_API_BASE}/posts?per_page=${perPage}&page=${page}&_embed`;
  console.log(`📥 ページ${page}を取得中...`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const posts = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');

    console.log(`✅ ${posts.length}件の記事を取得（全${totalPosts}件中）`);

    return { posts, totalPages, totalPosts };
  } catch (error) {
    console.error(`❌ エラー: ${error.message}`);
    return { posts: [], totalPages: 0, totalPosts: 0 };
  }
}

/**
 * カテゴリー情報を取得
 */
async function fetchCategories() {
  const url = `${WP_API_BASE}/categories?per_page=100`;
  console.log('📂 カテゴリー情報を取得中...');

  try {
    const response = await fetch(url);
    const categories = await response.json();
    console.log(`✅ ${categories.length}個のカテゴリーを取得`);
    return categories;
  } catch (error) {
    console.error(`❌ カテゴリー取得エラー: ${error.message}`);
    return [];
  }
}

/**
 * 投稿データを分析
 */
function analyzePost(post) {
  // 日付の更新
  const postDate = new Date(post.date);
  if (!analysis.dateRange.oldest || postDate < analysis.dateRange.oldest) {
    analysis.dateRange.oldest = postDate;
  }
  if (!analysis.dateRange.newest || postDate > analysis.dateRange.newest) {
    analysis.dateRange.newest = postDate;
  }

  // カテゴリーのカウント
  if (post.categories) {
    post.categories.forEach(catId => {
      const count = analysis.categories.get(catId) || 0;
      analysis.categories.set(catId, count + 1);
    });
  }

  // タグのカウント
  if (post.tags) {
    post.tags.forEach(tagId => {
      const count = analysis.tags.get(tagId) || 0;
      analysis.tags.set(tagId, count + 1);
    });
  }

  // アイキャッチ画像の収集
  if (post._embedded && post._embedded['wp:featuredmedia']) {
    const media = post._embedded['wp:featuredmedia'][0];
    if (media && media.source_url) {
      analysis.images.push({
        postId: post.id,
        postTitle: post.title.rendered,
        imageUrl: media.source_url,
        imageAlt: media.alt_text || '',
      });
    }
  }

  // 簡略化した投稿データを保存
  analysis.posts.push({
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    date: post.date,
    categories: post.categories,
    tags: post.tags,
    hasImage: !!(post._embedded && post._embedded['wp:featuredmedia']),
    contentLength: post.content.rendered.length,
    excerpt: post.excerpt.rendered,
  });
}

/**
 * 分析結果を表示
 */
function displayAnalysis(categories) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 WordPress コンテンツ分析結果');
  console.log('='.repeat(60));

  console.log(`\n📰 記事数: ${analysis.totalPosts}件`);

  console.log(`\n📅 投稿期間:`);
  console.log(`  最古: ${analysis.dateRange.oldest?.toLocaleDateString('ja-JP')}`);
  console.log(`  最新: ${analysis.dateRange.newest?.toLocaleDateString('ja-JP')}`);

  console.log(`\n📂 カテゴリー別記事数:`);
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  const sortedCategories = Array.from(analysis.categories.entries())
    .sort((a, b) => b[1] - a[1]);

  sortedCategories.forEach(([catId, count]) => {
    const catName = categoryMap.get(catId) || `ID:${catId}`;
    console.log(`  ${catName}: ${count}件`);
  });

  console.log(`\n🖼️  画像:`);
  console.log(`  アイキャッチ画像付き記事: ${analysis.images.length}件`);

  console.log(`\n📝 記事の長さ（平均）:`);
  const avgLength = Math.round(
    analysis.posts.reduce((sum, p) => sum + p.contentLength, 0) / analysis.posts.length
  );
  console.log(`  ${avgLength.toLocaleString()}文字`);

  console.log(`\n🏷️  タグ数: ${analysis.tags.size}個`);

  console.log('\n' + '='.repeat(60));
}

/**
 * 分析結果をJSONファイルに保存
 */
async function saveAnalysisToFile() {
  const fs = require('fs');
  const path = require('path');

  const outputPath = path.join(__dirname, 'wordpress-analysis.json');

  const output = {
    totalPosts: analysis.totalPosts,
    dateRange: {
      oldest: analysis.dateRange.oldest?.toISOString(),
      newest: analysis.dateRange.newest?.toISOString(),
    },
    categories: Array.from(analysis.categories.entries()).map(([id, count]) => ({ id, count })),
    tags: Array.from(analysis.tags.entries()).map(([id, count]) => ({ id, count })),
    imagesCount: analysis.images.length,
    posts: analysis.posts,
    images: analysis.images,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n💾 分析結果を保存しました: ${outputPath}`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 WordPress分析を開始します...\n');
  console.log(`対象サイト: ${WORDPRESS_URL}\n`);

  // カテゴリー情報を取得
  const categories = await fetchCategories();

  // 投稿を取得（ページネーション対応）
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const { posts, totalPages: pages, totalPosts } = await fetchPosts(currentPage);

    if (currentPage === 1) {
      analysis.totalPosts = totalPosts;
      totalPages = pages;
    }

    // 各投稿を分析
    posts.forEach(post => analyzePost(post));

    currentPage++;

    // API負荷軽減のため少し待機
    if (currentPage <= totalPages) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 分析結果を表示
  displayAnalysis(categories);

  // JSONファイルに保存
  await saveAnalysisToFile();

  console.log('\n✅ 分析完了！');
}

// 実行
main().catch(error => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
