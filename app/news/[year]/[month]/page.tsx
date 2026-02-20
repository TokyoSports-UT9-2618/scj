import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllMonthlyArchives, getNewsByYearMonth } from '@/lib/news-service';
import Section from '@/components/ui/Section';
import DuotoneImage from '@/components/ui/DuotoneImage';
import MonthlyArchiveSidebar from '@/components/ui/MonthlyArchiveSidebar';
import { Noto_Serif_JP } from 'next/font/google';

const notSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// 静的生成: 全年月の組み合わせを事前生成
export async function generateStaticParams() {
  const archives = await getAllMonthlyArchives();
  return archives.map(({ year, month }) => ({
    year: String(year),
    month: String(month).padStart(2, '0'),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; month: string }> }) {
  const { year, month } = await params;
  return {
    title: `${year}年${parseInt(month)}月のニュース | 一般財団法人日本スポーツコミッション`,
  };
}

export default async function NewsArchivePage({ params }: { params: Promise<{ year: string; month: string }> }) {
  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    notFound();
  }

  const [newsList, archives] = await Promise.all([
    getNewsByYearMonth(year, month),
    getAllMonthlyArchives(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-gray-400 text-sm mb-2">
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
            {' › '}
            {year}年{month}月
          </p>
          <h1 className={`text-4xl md:text-5xl font-bold ${notSerifJP.className}`}>
            {year}年{month}月
          </h1>
          <p className="text-gray-400 mt-2">{newsList.length}件の記事</p>
        </div>
      </div>

      <Section bgColor="subtle" className="flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <div className="flex-1">
            {newsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsList.map((news) => (
                  <article
                    key={news.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <Link href={`/news/${news.slug}`} className="flex flex-col h-full">
                      <div className="relative h-40 overflow-hidden bg-gray-200">
                        {news.coverImage ? (
                          <DuotoneImage
                            src={news.coverImage.url}
                            alt={news.coverImage.title}
                            fill
                          />
                        ) : (
                          <div className="w-full h-full bg-navy-900/10 flex items-center justify-center text-navy-900/30 font-bold text-sm">
                            No Image
                          </div>
                        )}
                        {news.category && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                              news.category === 'イベント' ? 'bg-blue-600 text-white' :
                              news.category === 'お知らせ' ? 'bg-accent-gold text-navy-900' :
                              'bg-gray-800 text-white'
                            }`}>
                              {news.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <time className="text-xs text-gray-400 mb-2 block">
                          {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
                        </time>
                        <h2 className="text-base font-bold text-navy-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                          {news.title}
                        </h2>
                        <div className="mt-auto pt-3">
                          <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                            READ MORE
                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-gray-500">この月の記事はありません。</p>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <MonthlyArchiveSidebar
            archives={archives}
            currentYear={year}
            currentMonth={month}
          />
        </div>
      </Section>
    </div>
  );
}
