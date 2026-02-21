import Link from 'next/link';
import Image from 'next/image';
import { Noto_Serif_JP } from 'next/font/google';
import { getNewsByProjectCategory } from '@/lib/news-service';
import type { News } from '@/types/contentful';

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: '研究会・セミナー | 一般財団法人日本スポーツコミッション',
  description:
    'スポーツコミッション研究会・シンポジウムの開催情報と過去のアーカイブ。SCJが主催する研究会・セミナーの開催趣旨・プログラム・申込情報をご案内します。',
};

// 開催予定：seminars カテゴリ＋イベント category の記事（今日以降 publishedAt）
async function getUpcomingSeminars(): Promise<News[]> {
  const all = await getNewsByProjectCategory('seminars', 100);
  const now = new Date();
  return all
    .filter((n) => n.category === 'イベント' && new Date(n.publishedAt) >= now)
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
}

// 過去アーカイブ：seminars カテゴリの全記事（開催予定を除く）
async function getPastSeminars(): Promise<News[]> {
  const all = await getNewsByProjectCategory('seminars', 100);
  const now = new Date();
  return all
    .filter((n) => !(n.category === 'イベント' && new Date(n.publishedAt) >= now))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// 年度ラベル（年 → 令和/平成）
function getWareki(year: number): string {
  if (year >= 2019) return `令和${year - 2018}年度`;
  if (year >= 1989) return `平成${year - 1988}年度`;
  return `昭和${year - 1925}年度`;
}

// カテゴリバッジの色
function categoryColor(category?: string) {
  if (category === 'イベント') return 'bg-blue-100 text-blue-800';
  if (category === 'レポート') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-700';
}

export default async function SeminarsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingSeminars(), getPastSeminars()]);

  // 過去アーカイブを年度別にグループ化
  type YearGroup = { year: number; items: News[] };
  const yearGroupsMap = new Map<number, News[]>();
  for (const item of past) {
    const year = new Date(item.publishedAt).getFullYear();
    if (!yearGroupsMap.has(year)) yearGroupsMap.set(year, []);
    yearGroupsMap.get(year)!.push(item);
  }
  const yearGroups: YearGroup[] = Array.from(yearGroupsMap.entries())
    .map(([year, items]) => ({ year, items }))
    .sort((a, b) => b.year - a.year);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── ページヒーロー ── */}
      <div className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold" />

        <div className="container mx-auto px-4 md:px-6 py-16 relative">
          {/* パンくず */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <span>/</span>
            <span className="text-white">研究会・セミナー</span>
          </nav>

          <p className="text-xs font-bold tracking-[0.3em] text-accent-gold uppercase mb-3">
            Seminars &amp; Symposiums
          </p>
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${notoSerifJP.className}`}>
            研究会・セミナー
          </h1>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            一般財団法人日本スポーツコミッションが主催する「スポーツコミッション研究会」および
            シンポジウムの開催情報・過去のアーカイブをご覧いただけます。
          </p>
        </div>
      </div>

      {/* ── 研究会について ── */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="shrink-0 w-1 h-14 bg-accent-gold rounded-full" />
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">About</p>
              <h2 className={`text-2xl font-bold text-navy-900 ${notoSerifJP.className}`}>
                スポーツコミッション研究会とは
              </h2>
            </div>
          </div>
          <div className="pl-5 space-y-4 text-gray-600 leading-relaxed text-justify">
            <p>
              （一財）日本スポーツコミッション（SCJ）では、スポーツを競技スポーツのみならず、健康の維持・
              増進からレクリエーション、体育、余暇活動等を含む身体活動すべてと捉えた上で、スポーツの有する
              機能や効果を地域づくり・地域の活性化にどのように活用していくか、推進組織としてのスポーツ
              コミッション（SC）の創設や活動内容などについて、「スポーツコミッション研究会」（SC研究会）を
              平成21年度以降開催してきています。
            </p>
            <p>
              令和４年４月から第三期スポーツ基本計画が推進され「スポーツを活用したまちづくり・地方創生」が
              謳われ、スポーツをめぐる環境は大きく変化しつつあります。SCJでは調査研究・提言・講演・出版など
              多角的な活動を通じ、スポーツの可能性を最大限に引き出し、持続可能なまちづくりに貢献しています。
            </p>
          </div>

          {/* 開催形式バッジ */}
          <div className="pl-5 mt-8 flex flex-wrap gap-3">
            {[
              { label: '基調講演', icon: '🎤' },
              { label: '事例報告', icon: '📋' },
              { label: 'パネルディスカッション', icon: '💬' },
              { label: 'オンライン開催対応', icon: '💻' },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           bg-slate-100 text-navy-900 text-sm font-medium"
              >
                <span>{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 開催予定 ── */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-4">
            <h2 className={`text-2xl font-bold text-navy-900 ${notoSerifJP.className}`}>
              開催予定
            </h2>
            {upcoming.length > 0 && (
              <span className="text-sm text-accent-gold font-bold">
                {upcoming.length}件
              </span>
            )}
          </div>

          {upcoming.length > 0 ? (
            <div className="space-y-6 max-w-4xl">
              {upcoming.map((seminar) => (
                <UpcomingCard key={seminar.id} seminar={seminar} />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl bg-white border border-gray-100 rounded-xl p-10 text-center shadow-sm">
              <p className="text-gray-400 text-sm mb-2">現在、開催予定の研究会・セミナーはありません。</p>
              <p className="text-gray-400 text-xs">
                開催が決まり次第、このページおよびニュースにてお知らせします。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 過去のアーカイブ ── */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-4">
            <h2 className={`text-2xl font-bold text-navy-900 ${notoSerifJP.className}`}>
              過去のアーカイブ
            </h2>
            {past.length > 0 && (
              <span className="text-sm text-gray-400 font-medium">
                全{past.length}件
              </span>
            )}
          </div>

          {yearGroups.length > 0 ? (
            <div className="space-y-12 max-w-4xl">
              {yearGroups.map(({ year, items }) => (
                <div key={year}>
                  {/* 年度見出し */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-navy-900 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      {getWareki(year)}（{year}年）
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">{items.length}件</span>
                  </div>

                  {/* 記事リスト */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <PastSeminarRow key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl bg-slate-50 border border-gray-100 rounded-xl p-10 text-center">
              <p className="text-gray-400 text-sm">過去の研究会・セミナーのアーカイブは準備中です。</p>
            </div>
          )}
        </div>
      </section>

      {/* ── お問い合わせ CTA ── */}
      <section className="bg-navy-900 py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className={`text-2xl font-bold text-white mb-4 ${notoSerifJP.className}`}>
            研究会・セミナーへのご参加・ご相談
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            スポーツコミッションの創設・活動・地方創生事業についてお考えの
            自治体・企業・団体の方のご相談も承っています。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-accent-gold text-navy-900
                         font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
            >
              お問い合わせ・ご相談
              <span>→</span>
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30
                         text-white font-bold px-8 py-4 rounded-lg
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

// ─── 開催予定カード ────────────────────────────────────────────────────────
function UpcomingCard({ seminar }: { seminar: News }) {
  const date = new Date(seminar.publishedAt);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

  return (
    <Link href={`/news/${seminar.slug}`}>
      <article className="group flex gap-0 bg-white rounded-xl border-2 border-accent-gold
                          shadow-md hover:shadow-xl transition-all overflow-hidden">
        {/* 日付ブロック */}
        <div className="shrink-0 w-24 bg-navy-900 flex flex-col items-center justify-center text-white py-6 px-4">
          <span className="text-3xl font-bold leading-none">{month}</span>
          <span className="text-sm opacity-60 leading-none">/</span>
          <span className="text-4xl font-bold leading-none">{day}</span>
          <span className="text-xs opacity-70 mt-1">（{weekday}）</span>
        </div>

        {/* 本文 */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-accent-gold text-navy-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              開催予定
            </span>
            {seminar.category && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${categoryColor(seminar.category)}`}>
                {seminar.category}
              </span>
            )}
          </div>
          <h3 className={`text-lg font-bold text-navy-900 leading-snug mb-2
                          group-hover:text-blue-700 transition-colors`}>
            {seminar.title}
          </h3>
          {seminar.metaDescription && (
            <p className="text-sm text-gray-500 line-clamp-2">{seminar.metaDescription}</p>
          )}
          <span className="mt-4 text-sm font-bold text-accent-gold group-hover:underline">
            詳細・申込はこちら →
          </span>
        </div>

        {/* カバー画像（あれば） */}
        {seminar.coverImage && (
          <div className="hidden md:block shrink-0 w-44 relative overflow-hidden">
            <Image
              src={seminar.coverImage.url}
              alt={seminar.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="176px"
            />
          </div>
        )}
      </article>
    </Link>
  );
}

// ─── 過去アーカイブ 行 ────────────────────────────────────────────────────
function PastSeminarRow({ item }: { item: News }) {
  const date = new Date(item.publishedAt);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <Link href={`/news/${item.slug}`}>
      <article className="group flex gap-4 items-start bg-slate-50 hover:bg-white rounded-xl
                          border border-gray-100 hover:border-gray-200 hover:shadow-sm
                          transition-all p-5">
        {/* 日付 */}
        <time className="shrink-0 text-sm text-gray-400 font-medium w-32 pt-0.5">
          {dateStr}
        </time>

        {/* カテゴリ + タイトル */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {item.category && (
              <span className={`text-xs px-2 py-0.5 rounded ${categoryColor(item.category)}`}>
                {item.category}
              </span>
            )}
            {item.projectTags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-navy-900/5 text-navy-900">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-700 transition-colors
                         leading-snug line-clamp-2">
            {item.title}
          </h3>
        </div>

        {/* 矢印 */}
        <span className="shrink-0 text-gray-300 group-hover:text-navy-900 transition-colors pt-0.5">
          →
        </span>
      </article>
    </Link>
  );
}
