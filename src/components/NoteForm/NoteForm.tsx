import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { Note } from "../../types/note";

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (note: { title: string; content?: string; tag?: string }) => void;
}


const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
type AllowedTag = (typeof allowedTags)[number];

const NoteSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
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
        
        mutation.mutate({
          title: values.title,
          content: values.content,
          tag: values.tag as AllowedTag, 
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
