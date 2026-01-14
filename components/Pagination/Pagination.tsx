"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  function handlePageClick(selectedItem: { selected: number }) {
    onPageChange(selectedItem.selected + 1);
  }

  return (
    <div className={css.pagination}>
      <ReactPaginate
        pageCount={totalPages}
        forcePage={page - 1}
        onPageChange={handlePageClick}
        previousLabel="<"
        nextLabel=">"
        // CSS module classes
        containerClassName={css.pagination}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        disabledClassName={css.disabled}
        previousClassName={css.pageItem}
        nextClassName={css.pageItem}
        previousLinkClassName={css.pageLink}
        nextLinkClassName={css.pageLink}
        breakLabel="..."
        breakClassName={css.pageItem}
        breakLinkClassName={css.pageLink}
      />
    </div>
  );
}
