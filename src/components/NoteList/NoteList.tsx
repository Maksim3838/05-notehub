import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface Props {
  notes: Note[];
  onDelete: (id: number) => void;
}

export default function NoteList({ notes, onDelete }: Props) {
  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title ?? "Note title"}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag ?? "No tag"}</span>

            <button
              className={css.button}
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
