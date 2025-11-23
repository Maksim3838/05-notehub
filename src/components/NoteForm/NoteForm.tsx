import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (note: { title: string; content: string; tag: string }) => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  content: Yup.string()
    .trim()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  tag: Yup.string().required("Tag is required"),
});

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "" }}
      validationSchema={NoteSchema}
      onSubmit={(values) => {
        onSubmit(values);
        onClose();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          {/* TITLE */}
          <label>
            Title:
            <Field type="text" name="title" placeholder="Note title" />
          </label>
          <div style={{ color: "red", fontSize: "0.9rem" }}>
            <ErrorMessage name="title" />
          </div>

          {/* CONTENT */}
          <label>
            Content:
            <Field
              as="textarea"
              name="content"
              placeholder="Note content..."
              rows={4}
            />
          </label>
          <div style={{ color: "red", fontSize: "0.9rem" }}>
            <ErrorMessage name="content" />
          </div>

          {/* TAG */}
          <label>
            Tag:
            <Field as="select" name="tag">
              <option value="">Select tag</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="personal">Personal</option>
              <option value="idea">Idea</option>
            </Field>
          </label>
          <div style={{ color: "red", fontSize: "0.9rem" }}>
            <ErrorMessage name="tag" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}


