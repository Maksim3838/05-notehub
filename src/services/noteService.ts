import axios from "axios";
import type { Note } from "../types/note";

export type AllowedTag =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const api = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  page = 1,
  search = ""
): Promise<NotesResponse> => {
  const res = await api.get<NotesResponse>(`/notes`, {
    params: { page, search },
  });

  return res.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const res = await api.post<Note>("/notes", note);
  return res.data;
};

export const updateNote = async (note: Note): Promise<Note> => {
  const res = await api.put<Note>(`/notes/${note.id}`, note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
