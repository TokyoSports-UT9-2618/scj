import Link from 'next/link';
import { getRecentNews } from '@/lib/news-service';

export default async function Home() {
  const recentNews = await getRecentNews();

  return (
    <>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              スポーツで地域を元気に
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              一般財団法人日本スポーツコミッションは、まちづくり・地域づくりの視点から
              スポーツを活用した地域の活性化を図る調査研究・活動組織です。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                私たちについて
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 最新ニュース */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最新ニュース</h2>
            <Link href="/news" className="text-blue-600 hover:text-blue-700 font-semibold">
              すべて見る →
            </Link>
          </div>

          {recentNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((news) => (
                <article key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {news.coverImage && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={news.coverImage.url}
                        alt={news.coverImage.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {news.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {news.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                      {news.title}
                    </h3>
                    <time className="text-sm text-gray-500">
                      {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
                    </time>
                    <Link
                      href={`/news/${news.slug}`}
                      className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      続きを読む →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">ニュースはまだ登録されていません。</p>
              <p className="text-sm text-gray-400 mt-2">Contentfulの管理画面から記事を追加してください。</p>
            </div>
          )}
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">私たちの活動</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">調査研究</h3>
              <p className="text-gray-600">
                スポーツを活用した地域活性化に関する調査研究活動を行っています。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">ネットワーク構築</h3>
              <p className="text-gray-600">
                全国のスポーツコミッションとの連携・情報交換を推進しています。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">コンサルティング</h3>
              <p className="text-gray-600">
                地方自治体や関連団体へのアドバイス・支援を行っています。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
