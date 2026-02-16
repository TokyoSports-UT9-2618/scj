// Newt CMSの共通フィールド
export interface NewtBase {
  _id: string;
  _sys: {
    createdAt: string;
    updatedAt: string;
    raw: {
      createdAt: string;
      updatedAt: string;
      firstPublishedAt: string;
      publishedAt: string;
    };
  };
}

// 画像フィールドの型
export interface NewtImage {
  _id: string;
  src: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  width: number;
  height: number;
  title?: string;
  description?: string;
  altText?: string;
}

// ニュース記事の型
export interface News extends NewtBase {
  title: string;
  slug: string;
  publishedAt: string;
  coverImage?: NewtImage;
  category?: 'お知らせ' | 'イベント' | 'レポート' | 'その他';
  body: string;
  metaDescription?: string;
}

// 固定ページの型
export interface Page extends NewtBase {
  title: string;
  slug: string;
  body: string;
  metaDescription?: string;
}

// APIレスポンスの型
export interface NewtListResponse<T> {
  skip: number;
  limit: number;
  total: number;
  items: T[];
}
