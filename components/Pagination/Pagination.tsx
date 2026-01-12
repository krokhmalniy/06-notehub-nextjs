"use client";

import css from "./Pagination.module.css";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  return (
    <div className={css.pagination}>
      <button
        className={css.button}
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span className={css.info}>
        {page} / {totalPages}
      </span>

      <button
        className={css.button}
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
