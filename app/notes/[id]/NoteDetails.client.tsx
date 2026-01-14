"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NoteDetailsPage.module.css";

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    enabled: Boolean(id),
  });

  // isLoading
  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  // error або note не отримали
  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}
