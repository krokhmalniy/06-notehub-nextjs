"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { CreateNoteParams, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),

  content: Yup.string()
    .min(5, "Content must be at least 5 characters")
    .required("Content is required"),

  tag: Yup.string()
    .oneOf(["work", "personal", "home"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CreateNoteParams) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "work" as NoteTag,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <label className={css.label}>
          Title
          <Field name="title" className={css.input} />
          <ErrorMessage name="title" component="p" className={css.error} />
        </label>

        <label className={css.label}>
          Content
          <Field as="textarea" name="content" className={css.textarea} />
          <ErrorMessage name="content" component="p" className={css.error} />
        </label>

        <label className={css.label}>
          Tag
          <Field as="select" name="tag" className={css.select}>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="home">Home</option>
          </Field>
          <ErrorMessage name="tag" component="p" className={css.error} />
        </label>

        <div className={css.buttons}>
          <button type="submit" className={css.submitBtn}>
            Create
          </button>

          <button type="button" className={css.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
