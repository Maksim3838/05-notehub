import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteForm.module.css"

interface NoteFormProps {
   onSuccess?: () => void;
  onCancel: () => void;
  }


const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
type AllowedTag = (typeof allowedTags)[number];

const NoteSchema = Yup.object().shape({
  title: Yup.string().trim().min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters").required("Title is required"),
  content: Yup.string()
    .trim()
    .max(500, "Content must be at most 500 characters")
    .optional(),
  tag: Yup.mixed<AllowedTag>()
    .oneOf(allowedTags, "Invalid tag")
    .required("Tag is required"),
});
 

type NoteFormValues = {
  title: string;
  content: string;
  tag: "" | AllowedTag; 
};

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const  mutation = useMutation({
    mutationFn: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) =>
      createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
       if (onSuccess) onSuccess(); 
      onCancel();
    },
  });

  return (
    <Formik<NoteFormValues>
      initialValues={{ title: "", content: "", tag: "" }}
      validationSchema={NoteSchema}
      onSubmit={(values) => {
        
        mutation.mutate({
          title: values.title,
          content: values.content,
          tag: values.tag as AllowedTag, 
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <Field
      type="text"
      id="title"
      name="title"
      placeholder="Note title"
      className={css.input}
    />
    <ErrorMessage name="title" component="div" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <Field
      as="textarea"
      id="content"
      name="content"
      placeholder="Note content..."
      rows={4}
      className={css.textarea}
    />
    <ErrorMessage name="content" component="div" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <Field
      as="select"
      id="tag"
      name="tag"
      className={css.select}
    >
      <option value="">Select tag</option>
      {allowedTags.map((tag) => (
        <option key={tag} value={tag}>
          {tag}
        </option>
      ))}
    </Field>
    <ErrorMessage name="tag" component="div" className={css.error} />
  </div>

  <div className={css.actions}>
    <button
      type="submit"
      disabled={mutation.isPending || isSubmitting}
      className={css.submitButton}
    >
      {mutation.isPending ? "Saving..." : "Create note"}
    </button>

    <button
      type="button"
      onClick={onCancel}
      className={css.cancelButton}
    >
      Cancel
    </button>
  </div>
</Form>
      )}
    </Formik>
  );
}
