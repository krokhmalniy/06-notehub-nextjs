"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void; // 1-based
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className={css.wrapper}>
      <ReactPaginate
        pageCount={totalPages}
        forcePage={Math.max(0, page - 1)} // ReactPaginate uses 0-based
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        previousLabel="←"
        nextLabel="→"
        breakLabel="..."
        containerClassName={css.container}
        pageClassName={css.page}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        previousClassName={css.nav}
        nextClassName={css.nav}
        disabledClassName={css.disabled}
      />
    </div>
  );
}
