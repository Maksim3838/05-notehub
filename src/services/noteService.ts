import type { Note } from "../types/note";

export type AllowedTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page = 1,
  search = ""
): Promise<NotesResponse> => {
  const res = await fetch(
    `/api/notes/?page=${page}&search=${encodeURIComponent(search)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }

  const data: NotesResponse = await res.json();
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const res = await fetch("/api/notes/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  const createdNote: Note = await res.json();
  return createdNote;
};

export const updateNote = async (
  note: Note
): Promise<Note> => {
  const res = await fetch(`/api/notes/${note.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Failed to update note");
  }

  const updatedNote: Note = await res.json();
  return updatedNote;
};

export const deleteNote = async (
  id: string
): Promise<Note> => {
  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to delete note");
  }

  const deletedNote: Note = await res.json();
  return deletedNote;
};
