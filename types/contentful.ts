import { Entry, Asset, EntrySkeletonType } from 'contentful';

// Contentfulのメタデータ
export interface ContentfulSys {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 実績カテゴリID（projects-data.ts の id と対応）
export type ProjectCategoryId =
  | 'research'
  | 'advocacy'
  | 'pr-lectures'
  | 'seminars'
  | 'publishing'
  | 'membership'
  | 'related';

// ニュース記事のフィールド型
export interface NewsFields {
  title: string;
  slug?: string; // 非表示・自動生成のためOptionalに変更
  publishedAt: string;
  coverImage?: Asset;
  category?: 'お知らせ' | 'イベント' | 'レポート' | 'その他';
  body: any; // Contentful Rich Text
  metaDescription?: string;
  projectCategory?: ProjectCategoryId; // 実績カテゴリ紐付け
  projectTags?: string[];              // 実績タグ（複数）
}

// Contentful Entry Skeleton型 (SDK v10対応)
export type NewsSkeleton = EntrySkeletonType<NewsFields, 'news'>;

// Contentful Entry型として定義
export type NewsEntry = Entry<NewsSkeleton, undefined, string>;

// アプリ内で使用する整形済みNews型
export interface News {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  coverImage?: {
    url: string;
    title: string;
    description?: string;
    width: number;
    height: number;
  };
  category?: 'お知らせ' | 'イベント' | 'レポート' | 'その他';
  bodyHtml: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  projectCategory?: ProjectCategoryId; // 実績カテゴリ紐付け
  projectTags?: string[];              // 実績タグ（複数）
}
