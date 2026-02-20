'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { MonthlyArchive } from '@/lib/news-service';

interface MonthlyArchiveSidebarProps {
  archives: MonthlyArchive[];
  currentYear?: number;
  currentMonth?: number;
}

export default function MonthlyArchiveSidebar({ archives, currentYear, currentMonth }: MonthlyArchiveSidebarProps) {
  // 年ごとにグループ化
  const byYear = archives.reduce<Record<number, MonthlyArchive[]>>((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {});

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  // 現在の年、または最新年を初期展開
  const defaultOpen = currentYear ?? years[0];
  const [openYears, setOpenYears] = useState<Set<number>>(new Set([defaultOpen]));

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-6">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
          月別アーカイブ
        </h2>

        <nav>
          {years.map((year) => {
            const isOpen = openYears.has(year);
            const yearTotal = byYear[year].reduce((sum, m) => sum + m.count, 0);

            return (
              <div key={year} className="mb-1">
                {/* 年ヘッダー（クリックで開閉） */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full flex justify-between items-center px-2 py-2 rounded hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm font-bold text-navy-900">{year}年</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">{yearTotal}</span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* 月一覧（折りたたみ） */}
                {isOpen && (
                  <ul className="mb-2 ml-1">
                    {byYear[year].map(({ month, count }) => {
                      const isActive = currentYear === year && currentMonth === month;
                      return (
                        <li key={month}>
                          <Link
                            href={`/news/${year}/${String(month).padStart(2, '0')}`}
                            className={`flex justify-between items-center px-3 py-1.5 rounded text-sm transition-colors ${
                              isActive
                                ? 'bg-navy-900 text-white font-medium'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-navy-900'
                            }`}
                          >
                            <span>{month}月</span>
                            <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {count}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/news"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← ニュース一覧に戻る
          </Link>
        </div>
      </div>
    </aside>
  );
}
