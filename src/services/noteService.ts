import type { Note } from "../types/note";

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
}

interface NotesApiResponse {
  data: Note[];
  totalPages: number;
}

// Отримання нотаток
export async function fetchNotes({ page, perPage = 12, search = "" }: FetchNotesParams): Promise<NotesApiResponse> {
  const query = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (search) query.append("search", search);

  const res = await fetch(`https://notehub-public.goit.study/api/notes?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch notes: ${res.status}`);
  }
  const json = await res.json();
  
  return {
    data: json.data,
    totalPages: json.totalPages || 1,
  };
}

// Видалення нотатки (якщо бекенд дозволяє)
export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`https://notehub-public.goit.study/api/notes/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Failed to delete note: ${res.status}`);
  }
}
