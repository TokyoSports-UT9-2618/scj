import Link from 'next/link';
import Image from 'next/image';
import { Noto_Serif_JP } from 'next/font/google';
import { PROJECT_GROUPS } from '@/lib/projects-data';

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: '実績一覧 | 一般財団法人日本スポーツコミッション',
  description: '日本スポーツコミッションが取り組んできた地域活性化・スポーツ振興の実績をご紹介します。',
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-20 relative overflow-hidden">
        {/* 装飾背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent-gold translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <p className="text-accent-gold text-sm font-medium tracking-widest mb-3 uppercase">
            Achievements
          </p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${notoSerifJP.className}`}>
            実績一覧
          </h1>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            日本スポーツコミッションは設立以来、スポーツを活用したまちづくり・地域活性化に向けて
            多岐にわたる事業を展開してきました。
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="bg-slate-50 py-16 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          {/* リード文 */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-gray-600 leading-relaxed">
              以下の7つの事業カテゴリーを通じて、産官学民の連携による
              スポーツを活用した持続可能なまちづくりを推進しています。
            </p>
          </div>

          {/* Tile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {PROJECT_GROUPS.map((group) => (
              <ProjectTile key={group.id} group={group} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── タイルコンポーネント ───────────────────────────────────────────
function ProjectTile({ group }: { group: (typeof PROJECT_GROUPS)[number] }) {
  return (
    <Link
      href={group.href}
      className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl
                 transition-all duration-500 hover:-translate-y-2 bg-navy-900"
      style={{ minHeight: '340px' }}
    >
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src={group.imageUrl}
          alt={group.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105
                     transition-all duration-700 ease-out"
        />
        {/* グラデーションオーバーレイ */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30
                     group-hover:from-navy-900 group-hover:via-navy-900/60 group-hover:to-navy-900/20
                     transition-all duration-500"
        />
        {/* カラーアクセントライン（下部） */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-80 group-hover:opacity-100
                     transition-opacity duration-300"
          style={{ backgroundColor: group.color }}
        />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col h-full p-7" style={{ minHeight: '340px' }}>
        {/* 番号バッジ */}
        <div className="flex items-start justify-between mb-auto">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full
                       text-white text-sm font-bold border-2 border-white/30
                       group-hover:border-white/60 transition-colors duration-300"
            style={{ backgroundColor: group.color }}
          >
            {group.number}
          </span>
          {/* 矢印アイコン（ホバーで表示） */}
          <svg
            className="w-6 h-6 text-white/0 group-hover:text-white/80 transform translate-x-2
                       group-hover:translate-x-0 transition-all duration-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

        {/* タイトルエリア（下部固定） */}
        <div className="mt-auto">
          {/* ショートタイトル */}
          <p className="text-xs font-bold tracking-widest text-white/50
                        group-hover:text-white/70 transition-colors duration-300 mb-2 uppercase">
            {`0${group.number}`.slice(-2)} — {group.shortTitle}
          </p>
          {/* メインタイトル */}
          <h2 className="text-white text-lg font-bold leading-snug mb-4 line-clamp-2
                         group-hover:text-white transition-colors duration-300">
            {group.title}
          </h2>
          {/* 説明文（ホバーで表示） */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3
                        opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24
                        transition-all duration-500 ease-out overflow-hidden">
            {group.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
