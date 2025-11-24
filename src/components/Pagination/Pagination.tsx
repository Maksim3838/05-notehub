interface PaginationProps {
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ currentPage, onPrev, onNext }: PaginationProps) {
  return (
    <div style={{ marginTop: "20px" }}>
      <button onClick={onPrev}>Previous</button>
      <span style={{ margin: "0 10px" }}>Page: {currentPage}</span>
      <button onClick={onNext}>Next</button>
    </div>
  );
}
