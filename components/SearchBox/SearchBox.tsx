"use client";

import css from "./SearchBox.module.css";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleInput}
      placeholder="Search notes..."
      aria-label="Search notes"
      className={css.input}
    />
  );
}
