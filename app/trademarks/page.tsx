import Link from 'next/link';
import { Noto_Serif_JP } from 'next/font/google';

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: '商標について | 一般財団法人日本スポーツコミッション',
  description: '「スポーツコミッション」の商標に関するSCJの方針についてご説明します。',
};

export default function TrademarksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white transition-colors">私たちについて</Link>
            <span>/</span>
            <span className="text-white">商標について</span>
          </nav>
          <h1 className={`text-3xl md:text-4xl font-bold ${notoSerifJP.className}`}>
            商標について
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-50 py-16 flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className={`text-2xl font-bold text-navy-900 mb-8 pb-4 border-b border-gray-100 ${notoSerifJP.className}`}>
              「スポーツコミッション」の商標について
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                一般財団法人日本スポーツコミッション（SCJ）は、スポーツを活用したまちづくり・地域づくりを推進することを目的に、「スポーツコミッション」を商標登録していました。
              </p>

              <div>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  商標延長申請をしないことを決定した経緯
                </h3>
                <p>
                  スポーツ庁による4要件の設定、および令和4年度からの第3期スポーツ基本計画で「スポーツまちづくり」が広く謳われるようになったことから、商標としての延長申請をしないことを決定しました。
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  今後の方針
                </h3>
                <p>
                  今後、「スポーツコミッション」と名乗る場合、SCJの使用許可は不必要となります。ただし、スポーツ庁の4要件に基づいて活動することが求められています。
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-navy-900 font-bold hover:text-blue-700 transition-colors"
              >
                ← 私たちについてに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
