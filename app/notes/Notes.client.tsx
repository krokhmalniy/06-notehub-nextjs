"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", { page, perPage: PER_PAGE, search }],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    keepPreviousData: true,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <button className={css.button} type="button" onClick={openModal}>
          Create note
        </button>
      </div>

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p className={css.empty}>No notes found.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCancel={closeModal}
            onCreated={() => {
              // опційно: після створення — повернутись на 1 сторінку
              setPage(1);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
