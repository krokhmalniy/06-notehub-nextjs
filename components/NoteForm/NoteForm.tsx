"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api";
import type { CreateNoteParams, NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
  onCreated?: () => void;
}

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Required"),
  content: Yup.string().trim().max(500, "Max 500 characters").notRequired(),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS, "Invalid tag").required("Required"),
});

export default function NoteForm({ onCancel, onCreated }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNoteParams) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCreated?.();
      onCancel();
    },
  });

  const initialValues: CreateNoteParams = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik<CreateNoteParams>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        mutation.mutate(
          {
            ...values,
            title: values.title.trim(),
            content: values.content?.trim() ?? "",
          },
          {
            onSettled: () => helpers.setSubmitting(false),
            onSuccess: () => helpers.resetForm(),
          }
        );
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h2 className={css.title}>Create note</h2>

          <label className={css.label}>
            Title
            <Field className={css.input} type="text" name="title" />
            <ErrorMessage name="title" component="span" className={css.error} />
          </label>

          <label className={css.label}>
            Content
            <Field
              className={css.textarea}
              as="textarea"
              name="content"
              rows={5}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </label>

          <label className={css.label}>
            Tag
            <Field className={css.select} as="select" name="tag">
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </label>

          {mutation.isError && (
            <p className={css.error}>Something went wrong.</p>
          )}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.submit}
              disabled={isSubmitting || mutation.isPending}
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
