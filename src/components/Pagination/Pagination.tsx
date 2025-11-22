interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      {pages.map(page => (
        <button
          key={page}
          disabled={page === currentPage}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
