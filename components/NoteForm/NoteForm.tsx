"use client";

import { useState } from "react";
import type { CreateNoteParams, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

type Props = {
  onSubmit: (values: CreateNoteParams) => void;
};

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, content, tag });
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className={css.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <select
        className={css.select}
        value={tag}
        onChange={(e) => setTag(e.target.value as NoteTag)}
      >
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button className={css.button} type="submit">
        Save
      </button>
    </form>
  );
}
