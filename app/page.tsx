import { Suspense } from 'react';
import Link from 'next/link';
import { getRecentNews, getNewsByCategory } from '@/lib/news-service';
import Hero from '@/components/Hero';
import Section from '@/components/ui/Section';
import DuotoneImage from '@/components/ui/DuotoneImage';
import { Noto_Serif_JP } from 'next/font/google';

const notSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Server Component for fetching data
export default async function Home() {
  // Fetch data in parallel
  const [latestNews, seminarNews] = await Promise.all([
    getRecentNews(3),
    getNewsByCategory('イベント', 1)
  ]);

  const featuredSeminar = seminarNews[0] || null;

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Message Section */}
      <Section id="mission" className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <DuotoneImage
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=800&fit=crop"
              alt="Community Sports"
              fill
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className={`text-3xl md:text-4xl font-bold text-navy-900 mb-6 ${notSerifJP.className}`}>
              スポーツには、<br />地域を変える力がある。
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-justify">
              近年、スポーツは単なる身体活動や競技の枠を超え、地域活性化、観光振興、
              健康増進、コミュニティ形成など、多面的な社会的価値を持つものとして注目されています。
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-justify">
              日本スポーツコミッションは、産官学民の連携により、
              スポーツのチカラを最大限に活用した「持続可能なまちづくり」を推進します。
            </p>
            <Link
              href="/about"
              className="text-navy-900 font-bold border-b-2 border-accent-gold hover:text-navy-800 transition-colors inline-flex items-center gap-2 group"
            >
              私たちのミッション
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </Section>

      {/* Latest News & Featured Seminar */}
      <Section bgColor="subtle" id="updates">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* News Column (2/3) */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
              <h2 className={`text-3xl font-bold text-navy-900 ${notSerifJP.className}`}>News</h2>
              <Link href="/news" className="text-sm font-bold text-gray-500 hover:text-navy-900 transition-colors">
                一覧を見る
              </Link>
            </div>

            <div className="space-y-6">
              {latestNews.length > 0 ? (
                latestNews.map((news) => (
                  <Link
                    href={`/news/${news.slug}`}
                    key={news.id}
                    className="group block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="md:w-32 shrink-0">
                        <time className="text-sm text-gray-400 font-medium">
                          {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
                        </time>
                      </div>
                      <div className="grow">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded mb-2 md:mb-0 md:mr-3 ${news.category === 'イベント' ? 'bg-blue-100 text-blue-800' :
                          news.category === 'お知らせ' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {news.category || 'お知らせ'}
                        </span>
                        <h3 className="text-lg font-bold text-navy-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 py-8 text-center bg-white rounded-lg">記事がありません。</p>
              )}
            </div>
          </div>

          {/* Seminar/Side Column (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className={`text-2xl font-bold text-navy-900 mb-8 pb-4 border-b border-gray-200 ${notSerifJP.className}`}>
                Pick Up
              </h2>

              {featuredSeminar ? (
                <article className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 group">
                  <Link href={`/news/${featuredSeminar.slug}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      {featuredSeminar.coverImage ? (
                        <DuotoneImage
                          src={featuredSeminar.coverImage.url}
                          alt={featuredSeminar.title}
                          fill
                        />
                      ) : (
                        <div className="w-full h-full bg-navy-800 flex items-center justify-center text-white text-opacity-50">
                          SCJ Seminar
                        </div>
                      )}
                      <div className="absolute top-0 right-0 bg-accent-gold text-navy-900 text-xs font-bold px-3 py-1">
                        注目イベント
                      </div>
                    </div>
                    <div className="p-6">
                      <time className="text-sm text-gray-400 block mb-2">
                        {new Date(featuredSeminar.publishedAt).toLocaleDateString('ja-JP')}
                      </time>
                      <h3 className="text-lg font-bold text-navy-900 mb-4 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {featuredSeminar.title}
                      </h3>
                      <span className="text-sm font-bold text-blue-600 group-hover:underline">
                        詳細を見る →
                      </span>
                    </div>
                  </Link>
                </article>
              ) : (
                <div className="bg-gray-50 p-6 rounded text-center border border-gray-100">
                  <p className="text-gray-500 text-sm">現在、注目のイベント情報はありません。</p>
                </div>
              )}

              <div className="mt-8">
                <Link href="/contact" className="block w-full bg-navy-900 text-center py-4 rounded text-white font-bold hover:bg-navy-800 transition-colors shadow-lg">
                  お問い合わせ・ご相談
                  <span className="block text-xs font-normal text-gray-300 mt-1">
                    自治体・企業の方はこちら
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
}
