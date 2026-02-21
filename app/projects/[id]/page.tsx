import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Noto_Serif_JP } from 'next/font/google';
import { PROJECT_GROUPS, AchievementItem } from '@/lib/projects-data';
import { BOOKS_DATA, BOOK_TYPE_LABEL } from '@/lib/books-data';
import { getNewsByProjectCategory } from '@/lib/news-service';
import ProjectNewsAccordion from '@/components/ui/ProjectNewsAccordion';

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

// 時代ラベル（yearNum から元号グループを返す）
function getEra(yearNum: number): string {
  if (yearNum >= 2019) return '令和';
  if (yearNum >= 1989) return '平成';
  return '昭和';
}

// achievements を時代別にグループ化
function groupByEra(achievements: AchievementItem[]) {
  const sorted = [...achievements].sort((a, b) => b.yearNum - a.yearNum);
  const groups: { era: string; items: AchievementItem[] }[] = [];
  for (const item of sorted) {
    const era = getEra(item.yearNum);
    const last = groups[groups.length - 1];
    if (last && last.era === era) {
      last.items.push(item);
    } else {
      groups.push({ era, items: [item] });
    }
  }
  return groups;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = PROJECT_GROUPS.find((g) => g.id === id);
  if (!group) notFound();

  // 前後のグループ
  const idx = PROJECT_GROUPS.indexOf(group);
  const prev = idx > 0 ? PROJECT_GROUPS[idx - 1] : null;
  const next = idx < PROJECT_GROUPS.length - 1 ? PROJECT_GROUPS[idx + 1] : null;

  const isPublishing = id === 'publishing';
  const eraGroups = groupByEra(group.achievements);

  // Contentfulから実績カテゴリ紐付き記事を取得
  const projectNews = await getNewsByProjectCategory(id);

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
                className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-bold shrink-0"
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

            {/* ── メインコンテンツ ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* 概要カード */}
              <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                <h2 className={`text-xl font-bold text-navy-900 mb-4 ${notoSerifJP.className}`}>
                  事業概要
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {group.description}
                </p>
                {group.note && (
                  <p className="mt-4 text-xs text-gray-400 border-t border-gray-100 pt-4">
                    ※ {group.note}
                  </p>
                )}
              </div>

              {/* ── 出版事業のみ: 書籍・冊子ギャラリー ── */}
              {isPublishing && (
                <div className="space-y-6">
                  {/* 書籍セクション */}
                  <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                    <h2 className={`text-xl font-bold text-navy-900 mb-8 flex items-center gap-3 ${notoSerifJP.className}`}>
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded text-white text-sm"
                        style={{ backgroundColor: group.color }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </span>
                      書籍
                    </h2>
                    <div className="grid gap-10">
                      {BOOKS_DATA.filter(b => b.type === 'book').sort((a, b) => b.yearNum - a.yearNum).map((book) => (
                        <BookCard key={book.id} book={book} accentColor={group.color} />
                      ))}
                    </div>
                  </div>

                  {/* 冊子・論文セクション */}
                  <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                    <h2 className={`text-xl font-bold text-navy-900 mb-6 flex items-center gap-3 ${notoSerifJP.className}`}>
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded text-white"
                        style={{ backgroundColor: group.color }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </span>
                      冊子・論文・寄稿
                    </h2>
                    <div className="space-y-4">
                      {BOOKS_DATA.filter(b => b.type !== 'book').sort((a, b) => b.yearNum - a.yearNum).map((book) => (
                        <BookletRow key={book.id} book={book} accentColor={group.color} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 会員事業: シンプルなカード形式 ── */}
              {id === 'membership' && group.achievements.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                  <h2 className={`text-xl font-bold text-navy-900 mb-6 flex items-center gap-3 ${notoSerifJP.className}`}>
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded text-white"
                      style={{ backgroundColor: group.color }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </span>
                    活動組織・会員グループ
                  </h2>
                  <div className="space-y-4">
                    {group.achievements.sort((a, b) => b.yearNum - a.yearNum).map((item, i) => (
                      <MembershipCard key={i} item={item} accentColor={group.color} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── 出版・会員以外: 実績タイムライン ── */}
              {!isPublishing && id !== 'membership' && group.achievements.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold text-navy-900 ${notoSerifJP.className}`}>
                      活動実績
                    </h2>
                    <span className="text-sm text-gray-400">
                      （{group.achievements.length}件・新しい順）
                    </span>
                  </div>

                  {eraGroups.map(({ era, items }) => (
                    <div key={era}>
                      {/* 時代見出し */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: group.color }}
                        >
                          {era}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* 実績リスト */}
                      <div className="relative pl-6 space-y-0">
                        {/* 縦ライン */}
                        <div
                          className="absolute left-2 top-2 bottom-2 w-0.5"
                          style={{ backgroundColor: `${group.color}33` }}
                        />

                        {items.map((item, i) => (
                          <AchievementRow
                            key={i}
                            item={item}
                            accentColor={group.color}
                            isLast={i === items.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── 最新の実績・活動記録（Contentful連携） ── */}
              {projectNews.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold text-navy-900 ${notoSerifJP.className}`}>
                      最新の活動記録
                    </h2>
                    <span className="text-sm text-gray-400">
                      （{projectNews.length}件・クリックで詳細表示）
                    </span>
                  </div>
                  <ProjectNewsAccordion news={projectNews} accentColor={group.color} />
                </div>
              )}

              {/* 実績なしフォールバック（念のため） */}
              {!isPublishing && id !== 'membership' && group.achievements.length === 0 && (
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
              )}
            </div>

            {/* ── サイドバー ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* 統計カード */}
                {group.achievements.length > 0 && (
                  <div
                    className="rounded-xl p-6 text-white"
                    style={{ backgroundColor: group.color }}
                  >
                    <p className="text-sm opacity-80 mb-1">掲載実績数</p>
                    <p className="text-4xl font-bold mb-1">{group.achievements.length}<span className="text-lg font-normal ml-1">件</span></p>
                    {group.achievements.length > 0 && (
                      <p className="text-xs opacity-70">
                        {group.achievements[group.achievements.length - 1]?.year}〜{group.achievements[0]?.year}
                      </p>
                    )}
                  </div>
                )}

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

// ─── タイムライン行コンポーネント ───────────────────────────────────────
function AchievementRow({
  item,
  accentColor,
  isLast,
}: {
  item: AchievementItem;
  accentColor: string;
  isLast: boolean;
}) {
  return (
    <div className={`relative flex gap-4 ${isLast ? 'pb-2' : 'pb-5'}`}>
      {/* ドット */}
      <div
        className="absolute -left-4 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm shrink-0"
        style={{ backgroundColor: accentColor }}
      />

      {/* カード */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm
                      hover:shadow-md hover:border-gray-200 transition-all">
        {/* 年度バッジ */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: accentColor }}
          >
            {item.year}
          </span>
          {item.client && (
            <span className="text-xs text-gray-400">
              {item.client}
            </span>
          )}
        </div>
        {/* 本文 */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {item.content}
        </p>
      </div>
    </div>
  );
}

// ─── 会員事業カード ──────────────────────────────────────────────────────
function MembershipCard({ item, accentColor }: { item: AchievementItem; accentColor: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50
                    hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all">
      {/* アイコンドット */}
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white mt-0.5"
        style={{ backgroundColor: accentColor }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: accentColor }}
          >
            {item.year}
          </span>
          {item.client && (
            <span className="text-xs text-gray-400">{item.client}</span>
          )}
        </div>
        <p className="text-sm font-bold text-navy-900 leading-snug">{item.content}</p>
      </div>
    </div>
  );
}

// ─── 書籍カード（横並び・表紙画像あり） ─────────────────────────────
function BookCard({ book, accentColor }: { book: (typeof BOOKS_DATA)[number]; accentColor: string }) {
  return (
    <div className="flex gap-6 group pb-8 border-b border-gray-100 last:border-0 last:pb-0">
      {/* 表紙画像エリア */}
      <div className="shrink-0 w-28 md:w-36">
        {book.coverImage ? (
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg
                          group-hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <Image
              src={book.coverImage}
              alt={`${book.title} 表紙`}
              fill
              sizes="144px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div
            className="aspect-[3/4] rounded-lg shadow-lg flex flex-col items-center justify-center
                       text-white p-3 text-center"
            style={{ background: `linear-gradient(145deg, ${accentColor}dd, ${accentColor}88)` }}
          >
            <svg className="w-8 h-8 mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xs font-bold leading-tight opacity-90">{book.title}</p>
          </div>
        )}
      </div>

      {/* 書誌情報 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded text-white mb-3 self-start"
          style={{ backgroundColor: accentColor }}
        >
          {book.year}
        </span>
        <h3 className="text-xl font-bold text-navy-900 mb-1 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{book.authors}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {book.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {book.publisherUrl && (
            <a
              href={book.publisherUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900
                         border border-navy-900/20 bg-white px-3 py-1.5 rounded-full
                         hover:bg-navy-900 hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {book.publisher}
            </a>
          )}
          {book.amazonUrl && (
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700
                         border border-orange-200 px-3 py-1.5 rounded-full bg-orange-50
                         hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Amazonで見る
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 冊子・論文 行形式 ───────────────────────────────────────────────
function BookletRow({ book, accentColor }: { book: (typeof BOOKS_DATA)[number]; accentColor: string }) {
  const typeLabel = BOOK_TYPE_LABEL[book.type];
  return (
    <div className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200
                    hover:shadow-sm transition-all">
      {/* アイコン */}
      <div
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: accentColor }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">{book.year}</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-bold text-white"
            style={{ backgroundColor: accentColor, opacity: 0.85 }}
          >
            {typeLabel}
          </span>
        </div>
        <h3 className="font-bold text-navy-900 leading-snug mb-1 text-sm md:text-base">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-1">{book.authors}　／　{book.publisher}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
      </div>
    </div>
  );
}
