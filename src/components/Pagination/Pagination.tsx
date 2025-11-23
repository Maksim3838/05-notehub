import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={currentPage - 1} 
      onPageChange={(selectedItem) => onChange(selectedItem.selected + 1)}
      previousLabel={"Prev"}
      nextLabel={"Next"}
      breakLabel={"..."}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      containerClassName={"pagination"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"page-item"}
      previousLinkClassName={"page-link"}
      nextClassName={"page-item"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
      activeClassName={"active"}
    />
  );
}
