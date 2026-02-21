'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { News } from '@/types/contentful';

interface Props {
  news: News[];
  accentColor: string;
}

export default function ProjectNewsAccordion({ news, accentColor }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (news.length === 0) return null;

  return (
    <div className="space-y-2">
      {news.map((item) => {
        const isOpen = openId === item.id;
        const date = new Date(item.publishedAt);
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden
                       hover:border-gray-200 transition-colors"
          >
            {/* ヘッダー行（クリックで展開） */}
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left group"
            >
              {/* 展開インジケーター */}
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-transform duration-200"
                style={{ backgroundColor: accentColor, transform: isOpen ? 'rotate(45deg)' : 'none' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                    d="M12 4v16m8-8H4" />
                </svg>
              </span>

              <div className="flex-1 min-w-0">
                {/* 日付 + タグ */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{dateStr}</span>
                  {item.projectTags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{ color: accentColor, borderColor: `${accentColor}44` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* タイトル */}
                <p className="text-sm font-bold text-navy-900 leading-snug group-hover:text-blue-700 transition-colors">
                  {item.title}
                </p>
              </div>

              {/* 矢印 */}
              <svg
                className="shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 本文（展開時） */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div
                  className="prose prose-sm max-w-none mt-4 text-gray-700
                             prose-headings:text-navy-900 prose-headings:font-bold
                             prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                />
                {/* ニュース詳細リンク */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900
                               hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    ニュース詳細ページで見る
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
