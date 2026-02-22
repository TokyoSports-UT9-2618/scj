import Link from 'next/link';
import Image from 'next/image';
import { Noto_Serif_JP } from 'next/font/google';
import { getNewsByProjectCategory } from '@/lib/news-service';
import SeminarArchive from '@/components/ui/SeminarArchive';
import type { News } from '@/types/contentful';

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: '研究会・セミナー | 一般財団法人日本スポーツコミッション',
  description:
    'スポーツコミッション研究会・シンポジウムの開催情報と過去のアーカイブ。いつ・どこで・誰が・何を話したか、キーワードで検索できます。',
};

export default async function SeminarsPage() {
  const all = await getNewsByProjectCategory('seminars', 200);
  const now = new Date();

  // 開催予定：イベントカテゴリ＋publishedAt が今日以降（近い順）
  const upcoming = all
    .filter((n) => n.category === 'イベント' && new Date(n.publishedAt) >= now)
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());

  // 過去アーカイブ（新しい順 = publishedAt降順）
  const past = all
    .filter((n) => !(n.category === 'イベント' && new Date(n.publishedAt) >= now))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // 直近の開催予定1件をメインで大きく表示
  // 開催予定がない場合は最新のアーカイブ1件を表示
  const featured = upcoming[0] ?? past[0] ?? null;
  const featuredIsPast = upcoming.length === 0 && past.length > 0;
  const otherUpcoming = upcoming.slice(1);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── ページヒーロー ── */}
      <div className="relative bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold" />
        <div className="container mx-auto px-4 md:px-6 py-14 relative">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <span>/</span>
            <span className="text-white">研究会・セミナー</span>
          </nav>
          <p className="text-xs font-bold tracking-[0.3em] text-accent-gold uppercase mb-3">
            Seminars &amp; Symposiums
          </p>
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-3 ${notoSerifJP.className}`}>
            研究会・セミナー
          </h1>
          <p className="text-gray-300 text-sm max-w-2xl">
            一般財団法人日本スポーツコミッション主催の研究会・シンポジウムの開催情報と過去のアーカイブ。
          </p>
        </div>
      </div>

      {/* ── 次回開催（メイン告知） ── */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
            <h2 className={`text-2xl font-bold text-navy-900 ${notoSerifJP.className}`}>
              {featuredIsPast ? '直近の開催' : '開催予定'}
            </h2>
            {upcoming.length > 1 && (
              <span className="text-sm text-accent-gold font-bold">{upcoming.length}件</span>
            )}
          </div>

          {featured ? (
            <div className="space-y-8">
              {/* フィーチャードカード（bodyフル表示） */}
              <FeaturedSeminarCard seminar={featured} isPastFallback={featuredIsPast} />

              {/* 2件目以降の開催予定 */}
              {otherUpcoming.length > 0 && (
                <div className="space-y-4">
                  {otherUpcoming.map((s) => (
                    <UpcomingRow key={s.id} seminar={s} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
              <p className="text-gray-400 mb-1">現在、開催予定の研究会・セミナーはありません。</p>
              <p className="text-gray-400 text-xs">開催が決まり次第、このページでお知らせします。</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 過去のアーカイブ（検索付き） ── */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className={`text-2xl font-bold text-navy-900 ${notoSerifJP.className}`}>
                過去のアーカイブ
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                講演者名・テーマ・キーワードで絞り込めます
              </p>
            </div>
            {past.length > 0 && (
              <span className="text-sm text-gray-400">全{past.length}件</span>
            )}
          </div>

          <SeminarArchive items={past} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy-900 py-14">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className={`text-xl font-bold text-white mb-3 ${notoSerifJP.className}`}>
            研究会・セミナーへのご参加・ご相談
          </h2>
          <p className="text-gray-300 text-sm mb-8 max-w-lg mx-auto">
            スポーツコミッションの創設・活動・地方創生事業についてのご相談も承っています。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-accent-gold text-navy-900
                         font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
            >
              お問い合わせ・ご相談 →
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 border border-white/30
                         text-white font-bold px-8 py-3 rounded-lg
                         hover:border-white hover:bg-white/10 transition-colors"
            >
              ニュース一覧を見る
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── フィーチャードカード（bodyフル表示） ────────────────────────────────────
function FeaturedSeminarCard({ seminar, isPastFallback }: { seminar: News; isPastFallback?: boolean }) {
  const date = new Date(seminar.publishedAt);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  const year = date.getFullYear();

  // 時刻表示 (例: 13:00〜17:00)
  const timeStr = seminar.startTime
    ? seminar.endTime
      ? `${seminar.startTime}〜${seminar.endTime}`
      : `${seminar.startTime}〜`
    : null;

  // 申込締切
  const deadlineStr = seminar.applyDeadline
    ? (() => {
        const d = new Date(seminar.applyDeadline);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
      })()
    : null;

  return (
    <article className="bg-white rounded-2xl shadow-lg border-2 border-accent-gold overflow-hidden">

      {/* ── ヘッダー帯 ── */}
      <div className="bg-navy-900 px-8 py-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-block bg-accent-gold text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
            {isPastFallback ? '直近の開催' : '開催予定'}
          </span>
          {seminar.category && (
            <span className="inline-block bg-white/10 text-white/80 text-xs font-medium px-3 py-1 rounded-full">
              {seminar.category}
            </span>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white leading-snug break-words">
          {seminar.title}
        </h3>
      </div>

      {/* ── インフォボックス ── */}
      <div className="bg-slate-50 border-b border-gray-100 px-8 py-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {/* 日時 */}
          <div className="flex items-start gap-3">
            <dt className="shrink-0 text-accent-gold font-bold w-5 text-base">📅</dt>
            <dd className="text-navy-900 font-medium">
              {year}年{month}月{day}日（{weekday}）
              {timeStr && <span className="ml-1 text-gray-600">{timeStr}</span>}
            </dd>
          </div>

          {/* 会場 */}
          {seminar.venue && (
            <div className="flex items-start gap-3">
              <dt className="shrink-0 text-accent-gold font-bold w-5 text-base">📍</dt>
              <dd className="text-navy-900 font-medium">
                {seminar.venue}
                {seminar.venueAddress && (
                  <span className="block text-gray-500 text-xs mt-0.5">{seminar.venueAddress}</span>
                )}
              </dd>
            </div>
          )}

          {/* 申込締切 */}
          {deadlineStr && !isPastFallback && (
            <div className="flex items-start gap-3">
              <dt className="shrink-0 text-accent-gold font-bold w-5 text-base">⏰</dt>
              <dd className="text-navy-900 font-medium">
                申込締切：{deadlineStr}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* カバー画像（あれば） */}
      {seminar.coverImage && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={seminar.coverImage.url}
            alt={seminar.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 960px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>
      )}

      {/* ── Body（Rich text）フル表示 ── */}
      <div className="px-8 py-8">
        {seminar.metaDescription && (
          <p className="text-gray-600 mb-6 text-base leading-relaxed border-l-4 border-accent-gold pl-4 bg-amber-50 py-3 pr-4 rounded-r-lg">
            {seminar.metaDescription}
          </p>
        )}
        <div
          className="prose prose-slate max-w-none
                     prose-headings:text-navy-900 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                     prose-h2:text-xl prose-h3:text-lg prose-h3:border-b prose-h3:border-gray-100 prose-h3:pb-1
                     prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-3
                     prose-ul:my-3 prose-li:text-gray-700 prose-li:leading-relaxed
                     prose-strong:text-navy-900
                     prose-table:text-sm prose-td:py-2 prose-td:px-3 prose-th:py-2 prose-th:px-3
                     prose-blockquote:border-accent-gold prose-blockquote:bg-amber-50 prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: seminar.bodyHtml }}
        />

        {/* ── フッターアクション ── */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* 申込ボタン（URLあり・開催予定の場合） */}
          {seminar.applyUrl && !isPastFallback && (
            <a
              href={seminar.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent-gold text-navy-900 font-bold
                         px-7 py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-md text-base"
            >
              参加申込はこちら →
            </a>
          )}
          <Link
            href={`/news/${seminar.slug}`}
            className="inline-flex items-center gap-2 bg-navy-900 text-white font-bold
                       px-6 py-3 rounded-lg hover:bg-navy-800 transition-colors shadow-sm"
          >
            {isPastFallback ? '開催報告を見る →' : '詳細を見る →'}
          </Link>
          {!isPastFallback && !seminar.applyUrl && (
            <span className="text-xs text-gray-400">
              ※申込方法・詳細は詳細ページをご確認ください
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── 2件目以降の開催予定（コンパクト行） ─────────────────────────────────────
function UpcomingRow({ seminar }: { seminar: News }) {
  const date = new Date(seminar.publishedAt);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${'日月火水木金土'[date.getDay()]}）`;

  return (
    <Link href={`/news/${seminar.slug}`}>
      <article className="group flex gap-4 items-center bg-white hover:bg-slate-50 rounded-xl
                          border-2 border-accent-gold/40 hover:border-accent-gold
                          transition-all p-5 shadow-sm">
        <span className="shrink-0 bg-accent-gold text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
          開催予定
        </span>
        <time className="shrink-0 text-sm font-medium text-gray-500 hidden sm:block">{dateStr}</time>
        <h3 className="flex-1 font-bold text-navy-900 group-hover:text-blue-700 transition-colors
                       leading-snug line-clamp-1">
          {seminar.title}
        </h3>
        <span className="shrink-0 text-gray-300 group-hover:text-navy-900 transition-colors">→</span>
      </article>
    </Link>
  );
}
