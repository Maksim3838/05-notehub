import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;       
  pageCount: number;         
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ currentPage, pageCount, onPrev, onNext }: PaginationProps) {
  return (
    <div style={{ marginTop: "20px" }}>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={(event) => {
          const selected = event.selected + 1; 
          if (selected < currentPage) onPrev();
          if (selected > currentPage) onNext();
        }}
        forcePage={currentPage - 1} 
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}
