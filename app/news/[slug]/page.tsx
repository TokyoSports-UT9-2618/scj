import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsBySlug, getAllNews } from '@/lib/news-service';

// 静的生成用のパス一覧を取得
export async function generateStaticParams() {
  const newsList = await getAllNews(100);
  return newsList.map((news) => ({
    slug: news.slug,
  }));
}

// メタデータ生成
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: '記事が見つかりません',
    };
  }

  return {
    title: `${news.title} | 一般財団法人日本スポーツコミッション`,
    description: news.metaDescription || news.title,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/news" className="hover:text-blue-600">ニュース</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{news.title}</span>
        </nav>

        {/* 記事ヘッダー */}
        <header className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <time className="text-sm text-gray-500">
              {new Date(news.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {news.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {news.category}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{news.title}</h1>
          {news.coverImage && (
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={news.coverImage.url}
                alt={news.coverImage.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* 記事本文 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900
              prose-p:text-gray-700
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: news.bodyHtml }}
          />
        </div>

        {/* 戻るリンク */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ニュース一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}
