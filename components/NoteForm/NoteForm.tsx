"use client";

import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";

import type { CreateNoteParams, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => void;
  onCancel?: () => void;
}

// Yup-схема валідації
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: Yup.string()
    .required("Content is required")
    .min(5, "Content must be at least 5 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
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
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
    >
      <Form className={css.form}>
        <label className={css.label}>
          Title:
          <Field name="title" className={css.input} />
          <FormikError name="title" component="p" className={css.error} />
        </label>

        <label className={css.label}>
          Content:
          <Field
            as="textarea"
            name="content"
            className={css.textarea}
            rows={4}
          />
          <FormikError name="content" component="p" className={css.error} />
        </label>

        <label className={css.label}>
          Tag:
          <Field as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <FormikError name="tag" component="p" className={css.error} />
        </label>

        <div className={css.actions}>
          <button type="submit" className={css.submitBtn}>
            Create
          </button>

          {onCancel && (
            <button type="button" className={css.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </Form>
    </Formik>
  );
}
