import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { Note } from "../../types/note";

interface NoteFormProps {
  onClose: () => void;
}

// Єдиний набір дозволених тегів
const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
type AllowedTag = (typeof allowedTags)[number];

// Yup-схема
const NoteSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  content: Yup.string()
    .trim()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  tag: Yup.mixed<AllowedTag>()
    .oneOf(allowedTags, "Invalid tag")
    .required("Tag is required"),
});

// Тип значень форми
type NoteFormValues = {
  title: string;
  content: string;
  tag: "" | AllowedTag; // "" дозволяємо тільки для placeholder
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) =>
      createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  return (
    <Formik<NoteFormValues>
      initialValues={{ title: "", content: "", tag: "" }}
      validationSchema={NoteSchema}
      onSubmit={(values) => {
        // Значення "" ніколи не дійде сюди через Yup
        mutation.mutate({
          title: values.title,
          content: values.content,
          tag: values.tag as AllowedTag, // безпечний каст
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label>
            Title:
            <Field type="text" name="title" placeholder="Note title" />
          </label>
          <div style={{ color: "red", fontSize: "0.9rem" }}>
            <ErrorMessage name="title" />
          </div>

          <label>
            Content:
            <Field as="textarea" name="content" placeholder="Note content..." rows={4} />
          </label>
          <div style={{ color: "red", fontSize: "0.9rem" }}>
            <ErrorMessage name="content" />
          </div>

          <label>
            Tag:
            <Field as="select" name="tag">
              <option value="">Select tag</option>
              {allowedTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
          </label>
          <div style={{ color: "red", fontSize: "0.9rem" }}>
            <ErrorMessage name="tag" />
          </div>

          <button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}
