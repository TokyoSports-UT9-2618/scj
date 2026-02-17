import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 text-white tracking-wide">
              一般財団法人<br />日本スポーツコミッション
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              まちづくり・地域づくりの視点からスポーツを活用した
              地域の活性化を図る調査研究・活動組織です。
            </p>
            <address className="text-gray-400 text-sm not-italic leading-relaxed">
              〒166-0011<br />
              東京都杉並区梅里2丁目1-19 ライブラフラット701<br />
              <a href="mailto:info@sportscommission.or.jp" className="text-accent-gold hover:text-white transition-colors mt-2 inline-block">
                info@sportscommission.or.jp
              </a>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">コンテンツ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent-gold transition-colors">
                  私たちについて
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-accent-gold transition-colors">
                  実績一覧
                </Link>
              </li>
              <li>
                <Link href="/seminars" className="text-gray-300 hover:text-accent-gold transition-colors">
                  研究会・セミナー
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-accent-gold transition-colors">
                  ニュース
                </Link>
              </li>
            </ul>
          </div>

          {/* Utility Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">その他</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/members" className="text-gray-300 hover:text-accent-gold transition-colors">
                  会員専用ページ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent-gold transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-accent-gold transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/trademarks" className="text-gray-300 hover:text-accent-gold transition-colors">
                  商標について
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Japan Sports Commission. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Powered by Next.js & Contentful</p>
        </div>
      </div>
    </footer>
  );
}
