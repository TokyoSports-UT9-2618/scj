import Link from 'next/link';
import { getAllNews } from '@/lib/news-service';

export const metadata = {
  title: 'ニュース一覧 | 一般財団法人日本スポーツコミッション',
  description: '日本スポーツコミッションの最新ニュース・お知らせをご覧いただけます。',
};

export default async function NewsPage() {
  const newsList = await getAllNews();

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">ニュース</h1>

        {newsList.length > 0 ? (
          <div className="space-y-6">
            {newsList.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {news.coverImage && (
                    <div className="md:w-1/3 aspect-video md:aspect-auto bg-gray-200">
                      <img
                        src={news.coverImage.url}
                        alt={news.coverImage.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center gap-3 mb-3">
                      <time className="text-sm text-gray-500">
                        {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
                      </time>
                      {news.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {news.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                      <Link href={`/news/${news.slug}`}>{news.title}</Link>
                    </h2>
                    {news.metaDescription && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{news.metaDescription}</p>
                    )}
                    <Link
                      href={`/news/${news.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      続きを読む
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">ニュースはまだ登録されていません。</p>
            <p className="text-sm text-gray-400 mt-2">Contentfulの管理画面から記事を追加してください。</p>
          </div>
        )}
      </div>
    </div>
  );
}
