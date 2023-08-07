import { useEffect } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  paginationLimit: number;
  onPageChange: (page: number) => void;
}

export default function Pagenation(props: PaginationProps) {
  useEffect(() => {
    const pages: number[] = [];
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  }, [props.totalPages]);

  const calculatePaginationRange = () => {
    const paginationRange = props.paginationLimit;
    let start = Math.max(1, props.currentPage - paginationRange);
    let end = Math.min(props.totalPages, props.currentPage + paginationRange);

    if (props.currentPage <= paginationRange) {
      end = Math.min(props.totalPages, paginationRange * 2 + 1);
    }

    if (props.currentPage >= props.totalPages - paginationRange) {
      start = Math.max(1, props.totalPages - paginationRange * 2);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex justify-center">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => props.onPageChange(props.currentPage - 1)}
          className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            props.currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
          }`}
          disabled={props.currentPage === 1}
        >
          &lt;
        </button>
        {calculatePaginationRange().map((page) => (
          <button
            key={page}
            onClick={() => props.onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
              page === props.currentPage ? "text-red-500" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => props.onPageChange(props.currentPage + 1)}
          className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            props.currentPage === props.totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          disabled={props.currentPage === props.totalPages}
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}
