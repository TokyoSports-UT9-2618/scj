import Link from 'next/link';
import { getAllNews } from '@/lib/news-service';
import Section from '@/components/ui/Section';
import DuotoneImage from '@/components/ui/DuotoneImage';
import { Noto_Serif_JP } from 'next/font/google';

const notSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'ニュース一覧 | 一般財団法人日本スポーツコミッション',
  description: '日本スポーツコミッションの最新ニュース・お知らせをご覧いただけます。',
};

export default async function NewsPage() {
  const newsList = await getAllNews();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${notSerifJP.className}`}>
            News
          </h1>
          <p className="text-gray-400">
            最新の活動情報やお知らせ
          </p>
        </div>
      </div>

      <Section bgColor="subtle" className="flex-grow">
        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <Link href={`/news/${news.slug}`} className="flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {news.coverImage ? (
                      <DuotoneImage
                        src={news.coverImage.url}
                        alt={news.coverImage.title}
                        fill
                      />
                    ) : (
                      <div className="w-full h-full bg-navy-900/10 flex items-center justify-center text-navy-900/30 font-bold">
                        No Image
                      </div>
                    )}

                    {news.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded shadow-sm ${news.category === 'イベント' ? 'bg-blue-600 text-white' :
                            news.category === 'お知らせ' ? 'bg-accent-gold text-navy-900' :
                              'bg-gray-800 text-white'
                          }`}>
                          {news.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <time className="text-sm text-gray-400 mb-3 block">
                      {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
                    </time>
                    <h2 className="text-xl font-bold text-navy-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {news.title}
                    </h2>
                    {news.metaDescription && (
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                        {news.metaDescription}
                      </p>
                    )}
                    <div className="mt-auto pt-4">
                      <span className="text-sm font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                        READ MORE
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">ニュースがまだありません。</p>
          </div>
        )}
      </Section>
    </div>
  );
}
