import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.title}
          <button onClick={() => onDelete(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
