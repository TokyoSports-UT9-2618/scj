// 出版事業の書籍・冊子データ
export interface Book {
  id: string;
  year: string;        // 和暦表記
  yearNum: number;     // 西暦（ソート用）
  title: string;
  subtitle?: string;
  authors: string;
  publisher: string;
  publisherUrl?: string;
  amazonUrl?: string;
  coverImage?: string; // 表紙画像URL（取得できたもの）
  description: string;
  type: 'book' | 'booklet' | 'article'; // 書籍 / 冊子 / 論文
}

export const BOOKS_DATA: Book[] = [
  {
    id: 'ugoku',
    year: '令和4年（2022年）',
    yearNum: 2022,
    title: 'スポーツで地域を動かす',
    authors: '木田悟 編（SCJ関係者共著）',
    publisher: '東京大学出版会',
    publisherUrl: 'https://www.utp.or.jp/book/b498543.html',
    amazonUrl: 'https://www.amazon.co.jp/dp/4130530305',
    coverImage: '/books/book-ugoku.jpg',
    description: 'スポーツ基本法・スポーツ基本計画の策定を背景に、スポーツが持つ力を地域づくり・まちづくりにどう活用し、具体的な実践につなげるかのノウハウを提供するシリーズ第3弾。',
    type: 'book',
  },
  {
    id: 'hiraku',
    year: '平成25年（2013年）',
    yearNum: 2013,
    title: 'スポーツで地域を拓く',
    authors: '木田悟・藤口光紀・高橋義雄 ほか',
    publisher: '東京大学出版会',
    publisherUrl: 'http://www.utp.or.jp/book/b515791.html',
    amazonUrl: 'https://www.amazon.co.jp/dp/4130530208',
    coverImage: '/books/book-hiraku.jpg',
    description: '「観るスポーツ」から「参加するスポーツ」への転換を提唱。行政・NPO・ボランティア組織と協働で進める地域活性化のデザインを、海外事例も含め提示するシリーズ第2弾。',
    type: 'book',
  },
  {
    id: 'tsukuru',
    year: '平成19年（2007年）',
    yearNum: 2007,
    title: 'スポーツで地域をつくる',
    authors: '堀繁・木田悟・薄井充裕 編',
    publisher: '東京大学出版会',
    publisherUrl: 'https://www.utp.or.jp/book/b305633.html',
    coverImage: '/books/book-tsukuru.jpg',
    description: 'スポーツを地域づくりのツールとして活用する考え方を体系的にまとめたシリーズ第1弾。長野オリンピック開催10周年を機に、スポーツと地域の関係を再定義した先駆的な一冊。',
    type: 'book',
  },
  {
    id: 'wakamono-booklet',
    year: '令和5年（2023年）',
    yearNum: 2023,
    title: '若者の力を活用したスポーツによるまちづくりに関する小冊子',
    authors: '日本スポーツコミッション',
    publisher: '自主事業',
    description: '若者のエネルギーをスポーツまちづくりに活かす実践的な知見をまとめた冊子。全国の事例を収集・分析し、若者参画型スポーツコミッションのモデルを提示。',
    type: 'booklet',
  },
  {
    id: 'sports-machi-booklet',
    year: '令和6年（2024年）',
    yearNum: 2024,
    title: '新たなまちづくり・地域活性化手段としてのスポーツの活用',
    authors: '日本スポーツコミッション',
    publisher: '自主事業',
    description: '近年のスポーツ政策の動向を踏まえ、自治体や団体がスポーツを地域活性化に活用する際の手引きとなる冊子。具体的な事業モデルと推進体制の構築方法を解説。',
    type: 'booklet',
  },
  {
    id: 'kokusai-booklet',
    year: '平成30年（2018年）',
    yearNum: 2018,
    title: '国際的スポーツイベント及び自転車を活用した地域の活性化',
    authors: '日本スポーツコミッション',
    publisher: '自主事業',
    description: '2020東京五輪を見据えた国際的スポーツイベントの地域活用と、自転車ツーリズムによるまちづくりの可能性を探った冊子。',
    type: 'booklet',
  },
  {
    id: 'masse-article',
    year: '平成29年（2017年）',
    yearNum: 2017,
    title: 'マッセOSAKA研究紀要21号 寄稿',
    authors: '木田悟',
    publisher: '大阪府市町村振興協会（マッセOSAKA）',
    description: '大阪府市町村振興協会の研究紀要にスポーツを活用した地域づくりに関する論考を寄稿。',
    type: 'article',
  },
  {
    id: 'chikara-hon',
    year: '平成7年（1995年）',
    yearNum: 1995,
    title: '地域の活力と魅力 第1巻 躍動',
    authors: '木田悟 ほか',
    publisher: 'ぎょうせい',
    description: '地域振興の各分野における事例を収録した書籍。スポーツを活用したまちづくりの視点を早くから体系化した初期の著作。',
    type: 'book',
  },
];

// タイプ別ラベル
export const BOOK_TYPE_LABEL = {
  book: '書籍',
  booklet: '冊子',
  article: '論文・寄稿',
} as const;
