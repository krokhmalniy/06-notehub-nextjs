"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { fetchNotes } from "@/lib/api";

type Props = {
  initialPage: number;
  perPage: number;
  initialSearch: string;
};

export default function NotesClient({
  initialPage,
  perPage,
  initialSearch,
}: Props) {

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryKey = useMemo(
    () => ["notes", { page, perPage, search: debouncedSearch }] as const,
    [page, perPage, debouncedSearch]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.header}>
          <h1 className={css.title}>Notes</h1>

          <button
            className={css.button}
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Create note
          </button>
        </div>

        <SearchBox value={search} onChange={handleSearchChange} />

        {isLoading && <p>Loading, please wait...</p>}
        {isError && <p>Something went wrong.</p>}

        {!isLoading && !isError && (
          <>
            <NoteList notes={notes} />

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChangePage={setPage}
              />
            )}
          </>
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}
