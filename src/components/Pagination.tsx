import type { AnimePagination } from '../types/anime';

interface PaginationProps {
  pagination: AnimePagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, currentPage, onPageChange }: PaginationProps) {
  const { last_visible_page, has_next_page } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (last_visible_page <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= last_visible_page; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(last_visible_page - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < last_visible_page - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(last_visible_page);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (has_next_page) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page as number)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="pagination-button"
        onClick={handleNext}
        disabled={!has_next_page}
      >
        Next →
      </button>
    </div>
  );
}
