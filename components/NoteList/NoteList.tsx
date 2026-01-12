import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

type NoteListProps = {
  notes: Note[];
  onDelete: (id: string) => void;
};

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.header}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.tag}>{note.tag}</p>
          </div>

          <p className={css.content}>{note.content}</p>

          <div className={css.actions}>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>

            <button
              className={css.button}
              type="button"
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
