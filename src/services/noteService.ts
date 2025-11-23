import axios from "axios";
import type { Note } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});


export interface NotesResponse {
  data: Note[];
  totalPages: number;
}


export async function fetchNotes(params: { page: number; search: string }) {
  const { page, search } = params;

  const res = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
    },
  });

  return res.data;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete<void>(`/notes/${id}`);
}

export async function createNote(payload: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

