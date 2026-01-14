"use client";

import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note } from "@/types/note";

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <h2 className={css.title}>{note.title}</h2>

          <p className={css.content}>{note.content}</p>

          <p className={css.tag}>Tag: {note.tag}</p>

          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.detailsBtn}>
              View details
            </Link>

            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className={css.deleteBtn}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
