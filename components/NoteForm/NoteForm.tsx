"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { CreateNoteParams, NoteTag } from "@/types/note";

export interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Must be at least 3 characters"),

  content: Yup.string()
    .required("Content is required")
    .min(5, "Must be at least 5 characters"),

  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

const initialValues: CreateNoteParams = {
  title: "",
  content: "",
  tag: "Personal",
};


export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {(formik) => (
        <Form className={css.form}>
          <label className={css.label}>
            Title
            <Field name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="p" className={css.error} />
          </label>

          <label className={css.label}>
            Content
            <Field name="content" as="textarea" className={css.textarea} />
            <ErrorMessage name="content" component="p" className={css.error} />
          </label>

          <label className={css.label}>
            Tag
            <Field name="tag" as="select" className={css.select}>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
            </Field>
            <ErrorMessage name="tag" component="p" className={css.error} />
          </label>

          <div className={css.buttons}>
            <button
              type="submit"
              className={css.submitBtn}
              disabled={formik.isSubmitting}
            >
              Create
            </button>

            {onCancel && (
              <button
                type="button"
                className={css.cancelBtn}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
