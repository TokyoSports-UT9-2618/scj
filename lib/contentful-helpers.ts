import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { NewsEntry, News, NewsFields } from '@/types/contentful';

// slugが空の場合に自動生成: post-YYYY-MM-DD-xxxx（sys.idの末尾4文字）
function generateSlug(publishedAt: string, sysId: string): string {
  const date = new Date(publishedAt);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const suffix = sysId.slice(-4).toLowerCase();
  return `post-${yyyy}-${mm}-${dd}-${suffix}`;
}

// Contentful EntryをアプリのNews型に変換
export function transformNewsEntry(entry: NewsEntry): News {
  const fields = entry.fields as NewsFields;
  const publishedAt = fields.publishedAt || entry.sys.createdAt;
  const slug = fields.slug || generateSlug(publishedAt, entry.sys.id);

  return {
    id: entry.sys.id,
    title: fields.title || '',
    slug,
    publishedAt,
    coverImage: fields.coverImage?.fields?.file?.url ? {
      url: `https:${fields.coverImage.fields.file.url}`,
      title: (fields.coverImage.fields.title as string) || '',
      description: (fields.coverImage.fields.description as string) || '',
      width: ((fields.coverImage.fields.file.details as any)?.image?.width as number) || 0,
      height: ((fields.coverImage.fields.file.details as any)?.image?.height as number) || 0,
    } : undefined,
    category: fields.category,
    bodyHtml: documentToHtmlString(fields.body, {
      renderText: (text) => text.replace(/\n/g, '<br />'),
    }),
    metaDescription: fields.metaDescription,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    projectCategory: fields.projectCategory,
    projectTags: fields.projectTags,
  };
}

// モックデータ
export const MOCK_NEWS_DATA: News[] = [
  {
    id: 'mock-1',
    title: '公式サイトをリニューアルしました',
    slug: 'site-renewal-2026',
    publishedAt: '2026-02-17T00:00:00Z',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop',
      title: 'スポーツイメージ',
      width: 1200,
      height: 630,
    },
    category: 'お知らせ',
    bodyHtml: `
      <h2>サイトリニューアルのお知らせ</h2>
      <p>この度、一般財団法人日本スポーツコミッションの公式サイトをリニューアルいたしました。</p>
      <p>新しいサイトでは、より見やすく、使いやすいデザインに刷新し、モバイル端末でも快適にご覧いただけるようになりました。</p>
      <h3>主な変更点</h3>
      <ul>
        <li>レスポンシブデザインの採用により、スマートフォンやタブレットでも見やすく</li>
        <li>読み込み速度の大幅な改善</li>
        <li>ニュース・イベント情報の検索性向上</li>
      </ul>
      <p>今後とも、どうぞよろしくお願いいたします。</p>
    `,
    metaDescription: '日本スポーツコミッション公式サイトをリニューアルしました。',
    createdAt: '2026-02-17T00:00:00Z',
    updatedAt: '2026-02-17T00:00:00Z',
  },
  {
    id: 'mock-2',
    title: '第15回スポーツコミッション研究会を開催します',
    slug: 'study-group-15',
    publishedAt: '2026-02-10T00:00:00Z',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop',
      title: '会議イメージ',
      width: 1200,
      height: 630,
    },
    category: 'イベント',
    bodyHtml: `
      <h2>第15回スポーツコミッション研究会のご案内</h2>
      <p>来る3月15日（土）に、第15回スポーツコミッション研究会を開催いたします。</p>
      <h3>開催概要</h3>
      <ul>
        <li><strong>日時</strong>: 2026年3月15日（土）13:00〜17:00</li>
        <li><strong>場所</strong>: オンライン開催（Zoom）</li>
        <li><strong>テーマ</strong>: 「地域スポーツと観光の融合による地域活性化」</li>
        <li><strong>参加費</strong>: 無料</li>
      </ul>
      <h3>プログラム</h3>
      <p>基調講演、事例発表、パネルディスカッションを予定しています。詳細は後日ご案内いたします。</p>
      <p>お申し込みは2月末までにお願いいたします。</p>
    `,
    metaDescription: '第15回スポーツコミッション研究会を3月15日にオンライン開催します。',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'mock-3',
    title: '地域スポーツ振興事業の成果報告書を公開しました',
    slug: 'regional-sports-report-2025',
    publishedAt: '2026-01-20T00:00:00Z',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=630&fit=crop',
      title: 'ランニングイメージ',
      width: 1200,
      height: 630,
    },
    category: 'レポート',
    bodyHtml: `
      <h2>2025年度 地域スポーツ振興事業 成果報告</h2>
      <p>2025年度に実施した地域スポーツ振興事業の成果をまとめた報告書を公開いたしました。</p>
      <h3>主な成果</h3>
      <ul>
        <li>全国20地域でスポーツイベントを開催</li>
        <li>延べ参加者数: 約15,000名</li>
        <li>地域経済への波及効果: 約2億円（推計）</li>
      </ul>
      <p>報告書の詳細は、お問い合わせフォームよりご請求ください。</p>
    `,
    metaDescription: '2025年度地域スポーツ振興事業の成果報告書を公開しました。',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'mock-4',
    title: '冬季スポーツツーリズムシンポジウム開催報告',
    slug: 'winter-sports-symposium-2026',
    publishedAt: '2026-01-15T00:00:00Z',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=630&fit=crop',
      title: 'スキーイメージ',
      width: 1200,
      height: 630,
    },
    category: 'レポート',
    bodyHtml: `
      <h2>冬季スポーツツーリズムシンポジウムを開催しました</h2>
      <p>1月10日、北海道札幌市にて「冬季スポーツツーリズムシンポジウム」を開催いたしました。</p>
      <p>全国から約200名の関係者にご参加いただき、冬季スポーツを活用した地域振興について活発な議論が交わされました。</p>
      <h3>シンポジウムのハイライト</h3>
      <ul>
        <li>北海道ニセコ町の成功事例紹介</li>
        <li>インバウンド誘致のための戦略</li>
        <li>地域住民との共生モデル</li>
      </ul>
      <p>当日の講演資料は、後日公開予定です。</p>
    `,
    metaDescription: '冬季スポーツツーリズムシンポジウムの開催報告。',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'mock-5',
    title: '新年のご挨拶',
    slug: 'new-year-greeting-2026',
    publishedAt: '2026-01-01T00:00:00Z',
    category: 'お知らせ',
    bodyHtml: `
      <h2>新年のご挨拶</h2>
      <p>新年あけましておめでとうございます。</p>
      <p>旧年中は格別のご厚情を賜り、誠にありがとうございました。</p>
      <p>本年も、スポーツを通じた地域活性化に尽力してまいりますので、
      変わらぬご支援のほど、よろしくお願い申し上げます。</p>
      <p>皆様のご健勝とご多幸を心よりお祈り申し上げます。</p>
      <p style="text-align: right; margin-top: 2em;">
        令和8年 元旦<br>
        一般財団法人日本スポーツコミッション
      </p>
    `,
    metaDescription: '2026年 新年のご挨拶',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];
