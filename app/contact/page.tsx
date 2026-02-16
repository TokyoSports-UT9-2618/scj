export const metadata = {
  title: 'お問い合わせ | 一般財団法人日本スポーツコミッション',
  description: '日本スポーツコミッションへのお問い合わせはこちらから。',
};

export default function ContactPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">お問い合わせ</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-gray-700 mb-6">
            一般財団法人日本スポーツコミッションへのお問い合わせは、
            以下のメールアドレスまでご連絡ください。
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">メールアドレス</p>
            <a
              href="mailto:info@sportscommission.or.jp"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700"
            >
              info@sportscommission.or.jp
            </a>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">所在地</h2>
            <address className="not-italic text-gray-700">
              〒166-0011<br />
              東京都杉並区梅里2丁目1-19<br />
              ライブラフラット701
            </address>
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">お問い合わせの際のお願い</h2>
          <ul className="space-y-2 text-sm">
            <li>• お問い合わせ内容によっては、回答までにお時間をいただく場合がございます</li>
            <li>• 土日祝日のお問い合わせは、翌営業日以降の対応となります</li>
            <li>• 迷惑メール対策などでドメイン指定受信をされている場合は、
              「@sportscommission.or.jp」からのメールを受信できるよう設定をお願いいたします</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
