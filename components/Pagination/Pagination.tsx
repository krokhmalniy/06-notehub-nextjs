"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  page: number; // 1-based
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChangePage,
}: PaginationProps) {
  return (
    <div className={css.paginationWrapper}>
      <ReactPaginate
        breakLabel="..."
        previousLabel="<"
        nextLabel=">"
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={page - 1} // ReactPaginate expects 0-based index
        onPageChange={(event) => onChangePage(event.selected + 1)}
        containerClassName={css.pagination}
        pageClassName={css.page}
        activeClassName={css.active}
        previousClassName={css.prev}
        nextClassName={css.next}
        disabledClassName={css.disabled}
        breakClassName={css.break}
      />
    </div>
  );
}
