// 実績グループデータ（元サイトから取得）
export interface ProjectGroup {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  imageQuery: string; // Unsplash用キーワード
  imageUrl: string;
  color: string; // アクセントカラー（グラデーション用）
  href: string;
  highlights: string[]; // 主な実績ハイライト
}

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    id: 'research',
    number: 1,
    title: 'スポーツを活用したまちづくりと地域活性化に関する調査研究',
    shortTitle: '調査研究',
    description: '全国の自治体と連携し、スポーツを活用したまちづくり・地域活性化に関する調査研究を実施。スポーツコミッションの設立支援・多角化支援を中心に、30年以上の実績を積み重ねています。',
    imageQuery: 'research urban planning city',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop&q=80',
    color: '#1e40af',
    href: '/projects/research',
    highlights: [
      'スポーツコミッション設立・多角化支援業務',
      '全国20以上の自治体への調査・研究支援',
      'スポーツツーリズム推進事業',
      '自転車活用推進計画策定',
    ],
  },
  {
    id: 'advocacy',
    number: 2,
    title: 'スポーツを活用したまちづくりと地域活性化への意見表明等',
    shortTitle: '意見表明・提言',
    description: '行政・学術機関・メディアなど多方面に向けて、スポーツによる地域活性化の可能性を提言・発信。政策立案への貢献と社会的な認知拡大に取り組んでいます。',
    imageQuery: 'speech presentation conference hall',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop&q=80',
    color: '#065f46',
    href: '/projects/advocacy',
    highlights: [
      '「新たなまちづくり手段としてのスポーツ」冊子発刊',
      '「若者の力を活用したスポーツによるまちづくり」冊子',
      'スポーツ庁との対談記事掲載',
      '各種メディアでの提言・コメント提供',
    ],
  },
  {
    id: 'pr-lectures',
    number: 3,
    title: 'スポーツを活用した地域づくりと地域活性化に資する広報活動や依頼講演等',
    shortTitle: '広報・講演活動',
    description: '全国の自治体や団体からの依頼に応じた講演・アドバイス活動を通じて、スポーツコミッションの役割と可能性を広く伝えています。1995年から30年にわたる継続的な普及活動。',
    imageQuery: 'lecture seminar audience speaker',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop&q=80',
    color: '#7c2d12',
    href: '/projects/pr-lectures',
    highlights: [
      '地域活性化伝道師として全国各地へ派遣',
      '年間20〜39団体へのアドバイス実績',
      'ラジオ・メディア出演によるPR活動',
      'スポーツコミッション設立・運営サポート',
    ],
  },
  {
    id: 'seminars',
    number: 4,
    title: 'スポーツまちづくり研究会や講演・セミナー・シンポジウム等の開催',
    shortTitle: '研究会・セミナー',
    description: '定期的なスポーツコミッション研究会やセミナー、シンポジウムを主催。産官学民が集い、スポーツによるまちづくりの最新知見を共有するプラットフォームを提供しています。',
    imageQuery: 'sports community event symposium',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop&q=80',
    color: '#4c1d95',
    href: '/projects/seminars',
    highlights: [
      'スポーツコミッション研究会（年4〜8回開催）',
      'SCセミナー・シンポジウムの主催',
      'SCJ設立10周年記念シンポジウム',
      'eスポーツ活用研究分科会',
    ],
  },
  {
    id: 'publishing',
    number: 5,
    title: '出版事業',
    shortTitle: '出版事業',
    description: 'スポーツを活用したまちづくりに関する書籍・冊子を継続的に発刊。研究成果や実践事例を体系的にまとめ、全国のスポーツコミッション関係者への知識普及に貢献しています。',
    imageQuery: 'books publication library knowledge',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&q=80',
    color: '#1e3a5f',
    href: '/projects/publishing',
    highlights: [
      '「スポーツで地域を動かす」出版',
      '「スポーツで地域を拓く」出版',
      '国際的スポーツイベント活用に関する冊子',
      '自転車活用・若者力活用に関する冊子',
    ],
  },
  {
    id: 'membership',
    number: 6,
    title: '会員事業等',
    shortTitle: '会員事業',
    description: '会員組織を通じたネットワーク形成と共同研究を推進。eスポーツ研究分科会、組織のあり方研究分科会など、専門テーマごとのグループ活動を支援しています。',
    imageQuery: 'network community collaboration team',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&q=80',
    color: '#14532d',
    href: '/projects/membership',
    highlights: [
      'スポーツコミッション研究会（2009年〜）',
      'スポーツコミッション連絡協議会（2014年〜）',
      '自転車活用まちづくり研究分科会',
      'eスポーツ活用研究分科会（2023年〜）',
    ],
  },
  {
    id: 'related',
    number: 7,
    title: '以上に付属する関連事業他',
    shortTitle: '関連事業',
    description: '内閣府委嘱の地域活性化伝道師活動、大学での非常勤講師、各種有識者会議への参加など、組織の専門性を活かした幅広い関連事業を展開しています。',
    imageQuery: 'government policy meeting advisor',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&q=80',
    color: '#78350f',
    href: '/projects/related',
    highlights: [
      '地域活性化伝道師（内閣府委嘱）',
      'スポーツ推進審議会委員（各自治体）',
      '大学非常勤講師（日本大学・千葉工業大学）',
      'まちづくりDMO設立準備委員会委員',
    ],
  },
];
