import type { Note } from "../../types/note"; // ваш тип Note

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (!notes.length) return <p>No notes found</p>;

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <strong>{note.title}</strong>: {note.content}
        </li>
      ))}
    </ul>
  );
}
