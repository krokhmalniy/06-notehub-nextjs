"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  function handlePageChange(event: { selected: number }) {
    onPageChange(event.selected + 1);
  }

  return (
    <div className={css.paginationWrapper}>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        previousLabel="< Prev"
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.activePage}
        pageClassName={css.pageItem}
        previousClassName={css.pageItem}
        nextClassName={css.pageItem}
        breakClassName={css.pageItem}
      />
    </div>
  );
}
