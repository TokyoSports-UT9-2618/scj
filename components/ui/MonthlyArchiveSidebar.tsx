import Link from 'next/link';
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

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-6">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
          月別アーカイブ
        </h2>

        <nav>
          {years.map((year) => (
            <div key={year} className="mb-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
                {year}年
              </div>
              <ul className="space-y-0.5">
                {byYear[year].map(({ month, count }) => {
                  const isActive = currentYear === year && currentMonth === month;
                  return (
                    <li key={month}>
                      <Link
                        href={`/news/${year}/${String(month).padStart(2, '0')}`}
                        className={`flex justify-between items-center px-3 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-navy-900 text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                        }`}
                      >
                        <span>{month}月</span>
                        <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
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
