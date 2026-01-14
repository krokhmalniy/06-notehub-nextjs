import axios from "axios";
import type { Note, NoteTag, CreateNoteParams } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
  sortBy?: "created" | "updated";
}

function getAuthHeaders(): { Authorization: string } {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (!token) {
    throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

// Fetch notes list — SSR + CSR
export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
  sortBy = "created",
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params = {
    page,
    perPage,
    ...(search && search.trim() ? { search: search.trim() } : {}),
    ...(tag ? { tag } : {}),
    ...(sortBy ? { sortBy } : {}),
  };

  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params,
    headers: getAuthHeaders(),
  });

  return response.data;
}

// Create note — CSR mutation
export async function createNote(payload: CreateNoteParams): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", payload, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

// Delete note — MUST return deleted Note (mentor requirement)
export async function deleteNote(id: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

// Fetch note by ID — SSR + CSR
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
