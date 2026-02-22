import Link from 'next/link';
import { Noto_Serif_JP } from 'next/font/google';

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'プライバシーポリシー | 一般財団法人日本スポーツコミッション',
  description: '一般財団法人日本スポーツコミッションの個人情報保護方針についてご説明します。',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <span>/</span>
            <span className="text-white">プライバシーポリシー</span>
          </nav>
          <h1 className={`text-3xl md:text-4xl font-bold ${notoSerifJP.className}`}>
            プライバシーポリシー
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-50 py-16 flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className={`text-2xl font-bold text-navy-900 mb-2 ${notoSerifJP.className}`}>
              個人情報について
            </h2>
            <p className="text-gray-500 text-sm mb-8 pb-6 border-b border-gray-100">
              一般財団法人 日本スポーツコミッション
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              一般財団法人 日本スポーツコミッション（以下「財団」という。）は、個人情報保護の重要性を認識し、以下の方針に基づき個人情報保護に努めます。
            </p>

            <div className="space-y-8">

              <section>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  1. 個人情報の利用、取得、提供
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  財団は個人情報の利用目的を明確に定め、その目的達成に必要な範囲で、公正かつ適正な手段により個人情報の取得、利用をおこないます。
                </p>
              </section>

              <section>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  2. 個人情報の利用目的
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  財団が開催する講演会、研究会、セミナーなどの情報を提供させていただくDMの送付のため。その他財団がセミナー等の受講申込の際に取得した本人の氏名、電話番号等の個人情報は財団の業務を適正かつ円滑に遂行するための利用目的に沿って利用し、それ以外の目的では利用しません。
                </p>
              </section>

              <section>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  3. 個人情報の第三者への提供について
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  法令に定める場合を除いて、個人情報を事前に本人の同意なく、また利用目的以外に第三者に提供することはありません。
                </p>
              </section>

              <section>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  4. 個人情報管理について
                </h3>
                <ul className="space-y-3 text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent-gold mt-2" />
                    全ての個人情報は、不正アクセス、盗難、持出し等による、紛失、破壊、改ざん及び漏えい等が発生しないように適切に管理し、必要な予防・是正措置を講じます。
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent-gold mt-2" />
                    個人情報をもとに、利用目的内の業務を外部に委託する場合は、その業者と個人情報取扱契約書を締結する等とともに、適正な管理が行われるよう管理・監督します。
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent-gold mt-2" />
                    個人情報の本人による開示・訂正、利用停止等の取扱いに関する問合せがあった場合、適切かつ迅速に対応します。また、個人情報の取扱いに関する苦情を受け付ける窓口を設け、苦情を受け付けた場合には、適切かつ迅速に対応いたします。
                  </li>
                </ul>
              </section>

              <section>
                <h3 className={`text-lg font-bold text-navy-900 mb-3 ${notoSerifJP.className}`}>
                  5. 個人情報保護方針の改訂
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  財団は、上記の取扱いを必要に応じて見直し、その改善に努めます。
                </p>
              </section>

            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-navy-900 font-bold hover:text-blue-700 transition-colors"
              >
                ← トップページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
