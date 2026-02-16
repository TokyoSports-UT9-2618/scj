import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 団体情報 */}
          <div>
            <h3 className="text-lg font-bold mb-4">一般財団法人日本スポーツコミッション</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              まちづくり・地域づくりの視点からスポーツを活用した
              地域の活性化を図る調査研究・活動組織
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="text-lg font-bold mb-4">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  私たちについて
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  ニュース
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="text-lg font-bold mb-4">お問い合わせ</h3>
            <address className="text-gray-400 text-sm not-italic leading-relaxed">
              〒166-0011<br />
              東京都杉並区梅里2丁目1-19<br />
              ライブラフラット701<br />
              <a href="mailto:info@sportscommission.or.jp" className="hover:text-white transition-colors">
                info@sportscommission.or.jp
              </a>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} 一般財団法人日本スポーツコミッション. All rights reserved.</p>
          <p className="mt-2 text-xs">Powered by Next.js + Newt CMS</p>
        </div>
      </div>
    </footer>
  );
}
