"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { fetchNotes, createNote } from "@/lib/api";
import type { CreateNoteParams } from "@/types/note";

type NotesResponse = Awaited<ReturnType<typeof fetchNotes>>;

interface NotesClientProps {
  initialPage: number;
  perPage: number;
  initialSearch: string;
}

export default function NotesClient({
  initialPage,
  perPage,
  initialSearch,
}: NotesClientProps) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryKey: (string | number | undefined)[] = useMemo(
    () => ["notes", page, perPage, debouncedSearch],
    [page, perPage, debouncedSearch]
  );

  // Fetch notes (React Query v4 syntax)
  const { data, isLoading, isError } = useQuery<NotesResponse>(
    queryKey,
    () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
    }
  );

  // Create note
  const createMutation = useMutation({
    mutationFn: (payload: CreateNoteParams) => createNote(payload),
    onSuccess: () => {
      setPage(1);
      queryClient.invalidateQueries(["notes"]);
      setIsModalOpen(false);
    },
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCreate(values: CreateNoteParams) {
    createMutation.mutate(values);
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
                onPageChange={(selectedPage) => setPage(selectedPage)}
              />
            )}
          </>
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm
              onSubmit={handleCreate}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        )}
      </div>
    </main>
  );
}
