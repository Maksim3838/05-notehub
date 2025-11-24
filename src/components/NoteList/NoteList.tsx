import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (deletedNote) => {
  
      queryClient.setQueryData<{ notes: Note[]; totalPages: number }>(
        ["notes"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            notes: oldData.notes.filter((note) => note.id !== deletedNote.id),
          };
        }
      );
    },
  });

  return (
    <div className="note-list">
      {notes.length === 0 && <p>No notes found.</p>}
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <small>{note.tag}</small>
          <div style={{ marginTop: "0.5rem" }}>
            <button
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
