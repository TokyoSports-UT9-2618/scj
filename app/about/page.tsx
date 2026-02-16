export const metadata = {
  title: '私たちについて | 一般財団法人日本スポーツコミッション',
  description: '日本スポーツコミッションの概要、活動内容についてご紹介します。',
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">私たちについて</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">一般財団法人日本スポーツコミッションとは</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            一般財団法人日本スポーツコミッションは、まちづくり・地域づくりの視点からスポーツを活用した
            まちづくりや地域の活性化を図る調査研究・活動組織として、平成21年5月に設立されました。
          </p>
          <p className="text-gray-700 leading-relaxed">
            スポーツは、健康増進や地域の一体感の醸成、経済効果の創出など、多岐にわたる価値を持っています。
            私たちは、これらスポーツの持つ力を最大限に活用し、地域社会の発展に貢献することを目指しています。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">主な活動内容</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">スポーツコミッションに関する調査研究</h3>
                <p className="text-gray-700">地域におけるスポーツ活用の効果測定や成功事例の分析を行っています。</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">ネットワークの構築・情報交換</h3>
                <p className="text-gray-700">全国のスポーツコミッションとの連携を図り、知見の共有を推進しています。</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">自治体・団体へのコンサルティング</h3>
                <p className="text-gray-700">スポーツを活用した地域活性化に関する助言や支援を行っています。</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">団体情報</h2>
          <dl className="space-y-3">
            <div>
              <dt className="font-bold text-gray-900">名称</dt>
              <dd className="text-gray-700">一般財団法人日本スポーツコミッション</dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900">設立</dt>
              <dd className="text-gray-700">平成21年5月</dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900">所在地</dt>
              <dd className="text-gray-700">
                〒166-0011<br />
                東京都杉並区梅里2丁目1-19 ライブラフラット701
              </dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900">お問い合わせ</dt>
              <dd className="text-gray-700">
                <a href="mailto:info@sportscommission.or.jp" className="text-blue-600 hover:underline">
                  info@sportscommission.or.jp
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
