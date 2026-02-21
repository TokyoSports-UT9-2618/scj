'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { News } from '@/types/contentful';

interface Props {
  items: News[];
}

function getWareki(year: number): string {
  if (year >= 2019) return `令和${year - 2018}年度`;
  if (year >= 1989) return `平成${year - 1988}年度`;
  return `昭和${year - 1925}年度`;
}

// HTML タグを除去してプレーンテキスト化（検索用）
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function SeminarArchive({ items }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const text = [
        item.title,
        stripHtml(item.bodyHtml),
        item.metaDescription ?? '',
        item.projectTags?.join(' ') ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(q);
    });
  }, [query, items]);

  // 年度グループ化
  const yearGroupsMap = new Map<number, News[]>();
  for (const item of filtered) {
    const year = new Date(item.publishedAt).getFullYear();
    if (!yearGroupsMap.has(year)) yearGroupsMap.set(year, []);
    yearGroupsMap.get(year)!.push(item);
  }
  const yearGroups = Array.from(yearGroupsMap.entries())
    .map(([year, groupItems]) => ({ year, items: groupItems }))
    .sort((a, b) => b.year - a.year);

  return (
    <div>
      {/* 検索バー */}
      <div className="mb-10">
        <div className="relative max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="講演者名・テーマ・キーワードで検索…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white
                       text-gray-800 placeholder-gray-400 text-sm shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900
                       transition"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="クリア"
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <p className="mt-2 text-sm text-gray-500 pl-1">
            「{query}」の検索結果：<span className="font-bold text-navy-900">{filtered.length}件</span>
          </p>
        )}
      </div>

      {/* 結果 */}
      {yearGroups.length > 0 ? (
        <div className="space-y-12">
          {yearGroups.map(({ year, items: groupItems }) => (
            <div key={year}>
              {/* 年度ヘッダー */}
              <div className="flex items-center gap-4 mb-5">
                <span className="bg-navy-900 text-white text-sm font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  {getWareki(year)}（{year}年）
                </span>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 whitespace-nowrap">{groupItems.length}件</span>
              </div>

              {/* 記事リスト */}
              <div className="space-y-3">
                {groupItems.map((item) => (
                  <ArchiveRow key={item.id} item={item} query={query} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-gray-100 rounded-xl p-10 text-center">
          {query ? (
            <>
              <p className="text-gray-500 font-bold mb-1">該当する記事が見つかりませんでした</p>
              <p className="text-gray-400 text-sm">別のキーワードをお試しください</p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">過去の研究会・セミナーのアーカイブは準備中です。</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── アーカイブ行 ───────────────────────────────────────────────────────────
function ArchiveRow({ item, query }: { item: News; query: string }) {
  const date = new Date(item.publishedAt);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  // 検索キーワードをbody内で見つけてスニペット表示
  const snippet = useMemo(() => {
    if (!query) return null;
    const plain = stripHtml(item.bodyHtml);
    const idx = plain.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return null;
    const start = Math.max(0, idx - 30);
    const end = Math.min(plain.length, idx + query.length + 60);
    return (start > 0 ? '…' : '') + plain.slice(start, end) + (end < plain.length ? '…' : '');
  }, [item.bodyHtml, query]);

  // ハイライト処理
  function highlight(text: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark>
        : part
    );
  }

  return (
    <Link href={`/news/${item.slug}`}>
      <article className="group flex gap-4 items-start bg-slate-50 hover:bg-white rounded-xl
                          border border-gray-100 hover:border-gray-200 hover:shadow-sm
                          transition-all p-5">
        {/* 日付 */}
        <time className="shrink-0 text-sm text-gray-400 font-medium w-28 pt-0.5">
          {dateStr}
        </time>

        {/* タイトル＋スニペット */}
        <div className="flex-1 min-w-0">
          {item.projectTags && item.projectTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {item.projectTags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-navy-900/5 text-navy-900">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-700
                         transition-colors leading-snug">
            {highlight(item.title)}
          </h3>
          {snippet && (
            <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
              {highlight(snippet)}
            </p>
          )}
        </div>

        {/* 矢印 */}
        <span className="shrink-0 text-gray-300 group-hover:text-navy-900 transition-colors pt-1">→</span>
      </article>
    </Link>
  );
}
