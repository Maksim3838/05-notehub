import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-lite.onrender.com/api/notes";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});


export interface FetchNotesParams {
  page?: number;
  search?: string;
}


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/", {
    params: {
      page: params.page ?? 1,
      search: params.search ?? "",
    },
  });

  return response.data; 
}


export async function createNote(
  dto: CreateNoteDto
): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post("/", dto);
  return response.data; 
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/${id}`);
  return response.data; 
}
