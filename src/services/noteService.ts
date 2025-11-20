import axios, { AxiosResponse } from "axios";
import { Note } from "../types/note";

const API_URL = "https://your-api-url.com/notes"; // заміни на свій бекенд


export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
  currentPage: number;
}


export interface FetchNotesParams {
  page?: number;
  search?: string;
}


export interface CreateNoteDto {
  content: string;
}


export interface DeleteNoteResponse {
  deleted: Note;
}

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await axios.get(
    API_URL,
    {
      params: {
        page: params.page ?? 1,
        search: params.search ?? "",
      },
    }
  );

  return response.data;
}


export async function createNote(
  dto: CreateNoteDto
): Promise<Note> {
  const response: AxiosResponse<Note> = await axios.post(API_URL, dto);
  return response.data;
}


export async function deleteNote(id: number): Promise<DeleteNoteResponse> {
  const response: AxiosResponse<DeleteNoteResponse> = await axios.delete(
    `${API_URL}/${id}`
  );
  return response.data;
}
