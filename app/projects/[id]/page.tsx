import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Noto_Serif_JP } from 'next/font/google';
import { PROJECT_GROUPS } from '@/lib/projects-data';

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// 静的生成用パラメータ
export async function generateStaticParams() {
  return PROJECT_GROUPS.map((g) => ({ id: g.id }));
}

// メタデータ
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = PROJECT_GROUPS.find((g) => g.id === id);
  if (!group) return {};
  return {
    title: `${group.title} | 実績一覧 | 一般財団法人日本スポーツコミッション`,
    description: group.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = PROJECT_GROUPS.find((g) => g.id === id);
  if (!group) notFound();

  // 前後のグループ
  const idx = PROJECT_GROUPS.indexOf(group);
  const prev = idx > 0 ? PROJECT_GROUPS[idx - 1] : null;
  const next = idx < PROJECT_GROUPS.length - 1 ? PROJECT_GROUPS[idx + 1] : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヒーローヘッダー */}
      <div className="relative h-64 md:h-80 bg-navy-900 overflow-hidden">
        <Image
          src={group.imageUrl}
          alt={group.title}
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/30" />
        {/* アクセントライン */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: group.color }}
        />

        <div className="absolute inset-0 flex items-end container mx-auto px-4 md:px-6 pb-10">
          {/* パンくず */}
          <div className="w-full">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-white transition-colors">実績一覧</Link>
              <span>/</span>
              <span className="text-white">{group.shortTitle}</span>
            </nav>
            <div className="flex items-center gap-4">
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-bold"
                style={{ backgroundColor: group.color }}
              >
                {group.number}
              </span>
              <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight ${notoSerifJP.className}`}>
                {group.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 本文エリア */}
      <div className="bg-slate-50 flex-grow py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* メインコンテンツ */}
            <div className="lg:col-span-2">
              {/* 概要 */}
              <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8 shadow-sm">
                <h2 className={`text-xl font-bold text-navy-900 mb-4 ${notoSerifJP.className}`}>
                  事業概要
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {group.description}
                </p>
              </div>

              {/* 主な実績 */}
              <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                <h2 className={`text-xl font-bold text-navy-900 mb-6 ${notoSerifJP.className}`}>
                  主な実績
                </h2>
                <ul className="space-y-4">
                  {group.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                        style={{ backgroundColor: group.color }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 詳細は元サイトへ */}
              <div className="mt-8 p-6 bg-navy-900/5 rounded-xl border border-navy-900/10">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  各年度の詳細な活動内容・実績については、元サイトの実績紹介ページをご覧ください。
                </p>
                <a
                  href={`https://sportscommission.or.jp/%e5%ae%9f%e7%b8%be%e4%b8%80%e8%a6%a7/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-navy-900 font-bold hover:text-blue-700 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  元サイトの実績一覧を見る
                </a>
              </div>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* 全グループリスト */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h3 className={`text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 ${notoSerifJP.className}`}>
                    実績カテゴリー
                  </h3>
                  <ul className="space-y-2">
                    {PROJECT_GROUPS.map((g) => (
                      <li key={g.id}>
                        <Link
                          href={g.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                            ${g.id === group.id
                              ? 'bg-navy-900 text-white font-bold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                            }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: g.color }}
                          >
                            {g.number}
                          </span>
                          {g.shortTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* お問い合わせ */}
                <div className="bg-navy-900 text-white rounded-xl p-6">
                  <h3 className="font-bold mb-2">この事業についての<br />お問い合わせ</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    自治体・企業のご担当者様からのご相談を承っています。
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center bg-accent-gold text-navy-900 font-bold py-3 rounded-lg
                               hover:bg-yellow-400 transition-colors text-sm"
                  >
                    お問い合わせはこちら
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 前後ナビゲーション */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={prev.href}
                className="group flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-6
                           hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <svg className="w-8 h-8 text-gray-400 group-hover:text-navy-900 transition-colors shrink-0 rotate-180"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400 mb-1">前の実績カテゴリー</p>
                  <p className="text-sm font-bold text-navy-900 line-clamp-1">{prev.shortTitle}</p>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={next.href}
                className="group flex items-center justify-end gap-4 bg-white border border-gray-100 rounded-xl p-6
                           hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">次の実績カテゴリー</p>
                  <p className="text-sm font-bold text-navy-900 line-clamp-1">{next.shortTitle}</p>
                </div>
                <svg className="w-8 h-8 text-gray-400 group-hover:text-navy-900 transition-colors shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
