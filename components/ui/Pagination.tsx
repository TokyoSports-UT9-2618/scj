import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // 例: "/news/p"
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return '/news';
    return `${basePath}/${page}`;
  };

  // 表示するページ番号を決定（最大7個）
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="ページネーション">
      {/* 前へ */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-colors text-sm"
        >
          ← 前へ
        </Link>
      ) : (
        <span className="px-3 py-2 rounded border border-gray-200 text-gray-300 text-sm cursor-not-allowed">← 前へ</span>
      )}

      {/* ページ番号 */}
      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-navy-900 text-white border-navy-900'
                : 'border-gray-300 text-gray-600 hover:bg-navy-900 hover:text-white hover:border-navy-900'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* 次へ */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-colors text-sm"
        >
          次へ →
        </Link>
      ) : (
        <span className="px-3 py-2 rounded border border-gray-200 text-gray-300 text-sm cursor-not-allowed">次へ →</span>
      )}
    </nav>
  );
}
