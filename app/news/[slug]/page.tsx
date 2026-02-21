import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsBySlug, getAllNews } from '@/lib/news-service';
import Section from '@/components/ui/Section';
import DuotoneImage from '@/components/ui/DuotoneImage';
import { Noto_Serif_JP } from 'next/font/google';

const notSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs Section */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 md:px-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-navy-900 transition-colors">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/news" className="hover:text-navy-900 transition-colors">ニュース</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 truncate">{news.title}</span>
        </div>
      </div>

      <article>
        {/* Article Header */}
        <div className="bg-navy-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <time className="text-gray-300 font-medium">
                {new Date(news.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {news.category && (
                <span className={`inline-block px-3 py-1 text-sm font-bold rounded ${news.category === 'イベント' ? 'bg-blue-600 text-white' :
                    news.category === 'お知らせ' ? 'bg-accent-gold text-navy-900' :
                      'bg-gray-700 text-white'
                  }`}>
                  {news.category}
                </span>
              )}
            </div>
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 ${notSerifJP.className}`}>
              {news.title}
            </h1>
          </div>
        </div>

        {/* Cover Image */}
        {news.coverImage && (
          <div className="container mx-auto px-4 md:px-6 max-w-5xl -mt-12 relative z-10">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
              <DuotoneImage
                src={news.coverImage.url}
                alt={news.coverImage.title}
                fill
                priority
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <Section className={news.coverImage ? "pt-16" : "pt-8"}>
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg prose-slate max-w-none
                    prose-headings:text-navy-900 prose-headings:font-bold
                    prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
                    prose-h3:pb-2 prose-h3:border-b-2 prose-h3:border-accent-gold
                    prose-p:text-gray-700 prose-p:leading-[2] prose-p:my-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-navy-900
                    prose-img:rounded-lg prose-img:shadow-md
                    prose-blockquote:border-accent-gold prose-blockquote:bg-amber-50
                    prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: news.bodyHtml }}
            />
          </div>
        </Section>

        {/* Navigation Footer */}
        <div className="bg-gray-50 py-12 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <Link
              href="/news"
              className="inline-flex items-center px-8 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 font-bold hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ニュース一覧に戻る
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
