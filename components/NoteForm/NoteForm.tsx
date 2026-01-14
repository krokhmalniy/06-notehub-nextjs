"use client";

import { useState } from "react";
import type { CreateNoteParams, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => void;
  onCancel: () => void;
}

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      title,
      content,
      tag,
    });

    // очищення форми після успішної відправки
    setTitle("");
    setContent("");
    setTag("Todo");
  }

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <label className={css.label}>
        Title:
        <input
          className={css.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className={css.label}>
        Content:
        <textarea
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>

      <label className={css.label}>
        Tag:
        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button type="submit" className={css.submit}>
          Create
        </button>

        <button type="button" className={css.cancel} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
