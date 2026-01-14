"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Hydrate } from "@tanstack/react-query";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import type { CreateNoteParams, Note } from "@/types/note";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";

import type { DehydratedState } from "@tanstack/react-query";

export interface NotesClientProps {
  initialPage: number;
  perPage: number;
  initialSearch: string;
  dehydratedState: DehydratedState;
}

export default function NotesClient({
  initialPage,
  perPage,
  initialSearch,
  dehydratedState,
}: NotesClientProps) {
  return (
    <Hydrate state={dehydratedState}>
      <NotesContent
        initialPage={initialPage}
        perPage={perPage}
        initialSearch={initialSearch}
      />
    </Hydrate>
  );
}

interface NotesContentProps {
  initialPage: number;
  perPage: number;
  initialSearch: string;
}

function NotesContent({
  initialPage,
  perPage,
  initialSearch,
}: NotesContentProps) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryKey = useMemo(
    () => ["notes", page, perPage, debouncedSearch],
    [page, perPage, debouncedSearch]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    refetchOnMount: false,
    placeholderData: (prev: unknown) => prev as any,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateNoteParams) => createNote(payload),
    onSuccess: () => {
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

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

  function handleCreate(values: CreateNoteParams) {
    createMutation.mutate(values);
  }

  function handleDelete(id: string) {
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
            <NoteList notes={notes} onDelete={handleDelete} />

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
            <NoteForm onSubmit={handleCreate} />
          </Modal>
        )}
      </div>
    </main>
  );
}
