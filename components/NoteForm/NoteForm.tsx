"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { CreateNoteParams, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => void;
  onCancel: () => void;
}

const TAG_OPTIONS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

// Yup validation schema
const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .min(5, "Content must be at least 5 characters")
    .required("Content is required"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(TAG_OPTIONS, "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo" as NoteTag,
      }}
      validationSchema={NoteSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.field}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" />
            <ErrorMessage name="title" component="p" className={css.error} />
          </div>

          <div className={css.field}>
            <label htmlFor="content">Content</label>
            <Field id="content" name="content" as="textarea" rows={5} />
            <ErrorMessage name="content" component="p" className={css.error} />
          </div>

          <div className={css.field}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select">
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="p" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.submit}
              disabled={isSubmitting}
            >
              Create
            </button>

            <button type="button" className={css.cancel} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
