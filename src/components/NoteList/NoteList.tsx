import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => mutate(id);

  if (notes.length === 0) return <p>No notes available.</p>;

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id} style={{ marginBottom: "1rem" }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <p>
            <strong>Tag:</strong> {note.tag}
          </p>
          <button onClick={() => handleDelete(note.id)} disabled={status === "pending"}>
            {status === "pending" ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
