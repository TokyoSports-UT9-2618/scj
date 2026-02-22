import { contentfulClient, USE_MOCK_DATA } from './contentful';
import { transformNewsEntry, MOCK_NEWS_DATA } from './contentful-helpers';
import type { News, NewsEntry, NewsSkeleton } from '@/types/contentful';

export const NEWS_PER_PAGE = 20;

// ニュース一覧を取得 (カテゴリ指定可)
export async function getAllNews(limit: number = 100, category?: string): Promise<News[]> {
  // モックデータモードの場合
  if (USE_MOCK_DATA) {
    console.log('📝 Using MOCK_NEWS_DATA (Contentful not configured)');
    let data = MOCK_NEWS_DATA;
    if (category) {
      data = data.filter(item => item.category === category);
    }
    return data.slice(0, limit);
  }

  try {
    const now = new Date().toISOString();
    const query: any = {
      content_type: 'news',
      limit,
      order: ['-fields.publishedAt'],
      'fields.publishedAt[lte]': now, // 未来日付の記事を除外
    };

    if (category) {
      query['fields.category'] = category;
    }

    const response = await contentfulClient!.getEntries<NewsSkeleton>(query);

    return response.items.map((item) => transformNewsEntry(item as NewsEntry));
  } catch (error) {
    console.error('Error fetching news from Contentful:', error);
    console.log('📝 Falling back to MOCK_NEWS_DATA');
    let data = MOCK_NEWS_DATA;
    if (category) {
      data = data.filter(item => item.category === category);
    }
    return data.slice(0, limit);
  }
}

// ページネーション対応ニュース取得
export async function getNewsPaginated(page: number = 1, perPage: number = NEWS_PER_PAGE): Promise<{ news: News[]; total: number; totalPages: number }> {
  if (USE_MOCK_DATA) {
    const skip = (page - 1) * perPage;
    const news = MOCK_NEWS_DATA.slice(skip, skip + perPage);
    return { news, total: MOCK_NEWS_DATA.length, totalPages: Math.ceil(MOCK_NEWS_DATA.length / perPage) };
  }

  try {
    const now = new Date().toISOString();
    const response = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      limit: perPage,
      skip: (page - 1) * perPage,
      order: ['-fields.publishedAt'],
      'fields.publishedAt[lte]': now, // 未来日付の記事を除外
    } as any);

    return {
      news: response.items.map((item) => transformNewsEntry(item as NewsEntry)),
      total: response.total,
      totalPages: Math.ceil(response.total / perPage),
    };
  } catch (error) {
    console.error('Error fetching paginated news:', error);
    return { news: [], total: 0, totalPages: 0 };
  }
}

// 総ページ数を取得（静的生成用）
export async function getTotalNewsPages(perPage: number = NEWS_PER_PAGE): Promise<number> {
  if (USE_MOCK_DATA) return Math.ceil(MOCK_NEWS_DATA.length / perPage);
  try {
    const now = new Date().toISOString();
    const response = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      limit: 1,
      'fields.publishedAt[lte]': now,
    } as any);
    return Math.ceil(response.total / perPage);
  } catch {
    return 1;
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

// カテゴリーごとのニュースを取得
export async function getNewsByCategory(category: string, limit: number = 10): Promise<News[]> {
  return getAllNews(limit, category);
}

// トップページPickUp用：直近の開催予定イベント、なければ最新レポート
export async function getPickUpEntry(): Promise<News | null> {
  const now = new Date().toISOString();

  if (USE_MOCK_DATA) {
    const upcoming = MOCK_NEWS_DATA
      .filter((n) => n.category === 'イベント' && n.publishedAt >= now)
      .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    if (upcoming[0]) return upcoming[0];
    const report = MOCK_NEWS_DATA
      .filter((n) => n.category === 'レポート')
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return report[0] ?? null;
  }

  try {
    // 今日以降のイベントを開催日昇順で1件
    const upcomingRes = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      'fields.category': 'イベント',
      'fields.publishedAt[gte]': now,
      order: ['fields.publishedAt'],
      limit: 1,
    } as any);
    if (upcomingRes.items.length > 0) {
      return transformNewsEntry(upcomingRes.items[0] as NewsEntry);
    }

    // 開催予定なし → 最新レポートを1件
    const reportRes = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      'fields.category': 'レポート',
      order: ['-fields.publishedAt'],
      limit: 1,
    } as any);
    if (reportRes.items.length > 0) {
      return transformNewsEntry(reportRes.items[0] as NewsEntry);
    }

    return null;
  } catch (error) {
    console.error('Error fetching pick up entry:', error);
    return null;
  }
}

// 実績カテゴリIDで記事を取得（projects/[id] ページ用）
export async function getNewsByProjectCategory(
  projectCategory: string,
  limit: number = 50,
): Promise<News[]> {
  if (USE_MOCK_DATA) {
    // モック時はprojectCategoryが未設定のため空を返す
    return [];
  }

  try {
    const response = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      'fields.projectCategory': projectCategory,
      order: ['-fields.publishedAt'],
      limit,
    } as any);

    return response.items.map((item) => transformNewsEntry(item as NewsEntry));
  } catch (error) {
    console.error('Error fetching news by projectCategory:', error);
    return [];
  }
}

// 月別アーカイブ型
export interface MonthlyArchive {
  year: number;
  month: number;
  count: number;
}

// 全記事の年月一覧を取得（サイドバー・静的生成用）
export async function getAllMonthlyArchives(): Promise<MonthlyArchive[]> {
  try {
    // 全件取得（最大1000件）
    let allNews: News[] = [];
    if (USE_MOCK_DATA) {
      allNews = MOCK_NEWS_DATA;
    } else {
      const now = new Date().toISOString();
      let skip = 0;
      while (true) {
        const response = await contentfulClient!.getEntries<NewsSkeleton>({
          content_type: 'news',
          limit: 1000,
          skip,
          select: ['fields.publishedAt'],
          'fields.publishedAt[lte]': now, // 未来日付の記事を除外
        } as any);
        allNews = allNews.concat(response.items.map((item) => transformNewsEntry(item as NewsEntry)));
        if (allNews.length >= response.total) break;
        skip += 1000;
      }
    }

    // 年月でグループ化
    const countMap = new Map<string, number>();
    for (const news of allNews) {
      const d = new Date(news.publishedAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      countMap.set(key, (countMap.get(key) || 0) + 1);
    }

    // 新しい順にソート
    return Array.from(countMap.entries())
      .map(([key, count]) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, count };
      })
      .sort((a, b) => b.year - a.year || b.month - a.month);
  } catch (error) {
    console.error('Error fetching monthly archives:', error);
    return [];
  }
}

// 特定の年月の記事を取得
export async function getNewsByYearMonth(year: number, month: number): Promise<News[]> {
  if (USE_MOCK_DATA) {
    return MOCK_NEWS_DATA.filter((news) => {
      const d = new Date(news.publishedAt);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }

  try {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    const response = await contentfulClient!.getEntries<NewsSkeleton>({
      content_type: 'news',
      'fields.publishedAt[gte]': startDate,
      'fields.publishedAt[lte]': endDate,
      order: ['-fields.publishedAt'],
      limit: 1000,
    } as any);

    return response.items.map((item) => transformNewsEntry(item as NewsEntry));
  } catch (error) {
    console.error('Error fetching news by year/month:', error);
    return [];
  }
}
