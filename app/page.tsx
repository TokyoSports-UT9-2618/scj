import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    getRecentNews(4),
    getNewsByCategory('イベント', 1)
  ]);

  const featuredSeminar = seminarNews[0] || null;

  // PickUpと重複する記事をNewsから除外して最大3件表示
  const displayedNews = (featuredSeminar
    ? latestNews.filter((n) => n.id !== featuredSeminar.id)
    : latestNews).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* 理事長挨拶 Section */}
      <Section id="greeting" className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* 左：写真 + 肩書き */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-gray-200">
              <Image
                src="/director.png"
                alt="理事長 木田 悟"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 256px, 288px"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 tracking-widest mb-1">一般財団法人 日本スポーツコミッション</p>
              <p className="text-sm font-bold text-gray-500 mb-1">理事長</p>
              <p className={`text-2xl font-bold text-navy-900 ${notSerifJP.className}`}>木田 悟</p>
            </div>
          </div>

          {/* 右：挨拶文 */}
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent-gold uppercase mb-3">Greeting</p>
            <h2 className={`text-2xl md:text-3xl font-bold text-navy-900 mb-6 leading-snug ${notSerifJP.className}`}>
              スポーツのチカラで、<br />まちを、地域を、動かす。
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
              <p>
                当法人は、スポーツを活用したまちづくり・地域活性化を推進する組織として、平成21年（2009年）に設立いたしました。
              </p>
              <p>
                スポーツは、競技や身体活動の枠を超え、地域経済の活性化、観光振興、コミュニティ形成、そして人々の誇りや一体感の醸成など、多面的な社会的価値を持っています。Jリーグ開幕以来、スポーツと地域の結びつきは深まり、今やスポーツは地方創生の重要な柱のひとつとなっています。
              </p>
              <p>
                私たちは、こうしたスポーツの可能性を最大限に引き出し、持続可能なまちづくりに貢献するため、調査研究・提言・講演・出版など多角的な活動を続けています。
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                href="/about"
                className="text-navy-900 font-bold border-b-2 border-accent-gold hover:text-navy-800 transition-colors inline-flex items-center gap-2 group"
              >
                法人概要・ミッションを見る
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
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
              {displayedNews.length > 0 ? (
                displayedNews.map((news) => (
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
                        <div className="w-full h-full bg-navy-900 flex items-center justify-center p-8">
                          <Image
                            src="/logo.png"
                            alt="日本スポーツコミッション"
                            width={200}
                            height={80}
                            className="object-contain opacity-70"
                          />
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
