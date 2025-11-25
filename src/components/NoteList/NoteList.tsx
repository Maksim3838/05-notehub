import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService"; 

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes.length) return <p>No notes found</p>;

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id} style={{ marginBottom: "8px" }}>
          <strong>{note.title}</strong>

          <span
            style={{
              marginLeft: "8px",
              padding: "2px 6px",
              background: "#eee",
              borderRadius: "4px",
              fontSize: "0.85em",
            }}
          >
            {note.tag}
          </span>

          {note.content ? `: ${note.content}` : <em> (no content)</em>}

          <button
            onClick={() => deleteMutation.mutate(note.id)}
            style={{
              marginLeft: "12px",
              padding: "2px 8px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
