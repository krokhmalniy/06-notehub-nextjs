"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { createNote, deleteNote, fetchNotes } from "@/lib/api";
import type { CreateNoteParams, Note } from "@/types/note";
import type { FetchNotesResponse } from "@/lib/api";

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
  const queryClient = useQueryClient();

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // stable key for React Query
  const queryKey = useMemo(
    () => ["notes", { page, perPage, search: debouncedSearch }] as const,
    [page, perPage, debouncedSearch]
  );

  // Fetch notes with React Query v5
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
      }),
    // React Query v5 version of keepPreviousData
    placeholderData: (prev: FetchNotesResponse | undefined) => prev,
  });

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateNoteParams) => createNote(payload),
    onSuccess: () => {
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCreateNote(values: CreateNoteParams) {
    createMutation.mutate(values);
  }

  function handleDeleteNote(id: string) {
    deleteMutation.mutate(id);
  }

  const notes: Note[] = data?.notes ?? [];
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
            <NoteList notes={notes} onDelete={handleDeleteNote} />

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onSubmit={handleCreateNote} />
          </Modal>
        )}
      </div>
    </main>
  );
}
