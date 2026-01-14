"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.content}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.text}>{note.content}</p>
            <p className={css.tag}>{note.tag}</p>
          </div>

          <div className={css.actions}>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>

            <button
              className={css.button}
              type="button"
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
