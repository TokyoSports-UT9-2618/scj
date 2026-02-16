import { contentfulClient, USE_MOCK_DATA } from './contentful';
import { transformNewsEntry, MOCK_NEWS_DATA } from './contentful-helpers';
import type { News, NewsEntry, NewsSkeleton } from '@/types/contentful';

// ニュース一覧を取得
export async function getAllNews(limit: number = 100): Promise<News[]> {
  // モックデータモードの場合
  if (USE_MOCK_DATA) {
    console.log('📝 Using MOCK_NEWS_DATA (Contentful not configured)');
    return MOCK_NEWS_DATA.slice(0, limit);
  }

  try {
    const response = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      limit,
      order: ['-fields.publishedAt'],
    } as any);

    return response.items.map((item) => transformNewsEntry(item as NewsEntry));
  } catch (error) {
    console.error('Error fetching news from Contentful:', error);
    console.log('📝 Falling back to MOCK_NEWS_DATA');
    return MOCK_NEWS_DATA.slice(0, limit);
  }
}

// スラッグから記事を取得
export async function getNewsBySlug(slug: string): Promise<News | null> {
  // モックデータモードの場合
  if (USE_MOCK_DATA) {
    console.log(`📝 Using MOCK_NEWS_DATA for slug: ${slug}`);
    return MOCK_NEWS_DATA.find((news) => news.slug === slug) || null;
  }

  try {
    const response = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      'fields.slug': slug,
      limit: 1,
    } as any);

    if (response.items.length === 0) {
      return null;
    }

    return transformNewsEntry(response.items[0] as NewsEntry);
  } catch (error) {
    console.error('Error fetching news by slug from Contentful:', error);
    console.log('📝 Falling back to MOCK_NEWS_DATA');
    return MOCK_NEWS_DATA.find((news) => news.slug === slug) || null;
  }
}

// 最新ニュースを取得
export async function getRecentNews(limit: number = 3): Promise<News[]> {
  return getAllNews(limit);
}
