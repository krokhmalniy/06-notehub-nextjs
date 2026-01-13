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

function getAuthHeaders() {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (!token) {
    throw new Error(
      "TOKEN is missing. Set NEXT_PUBLIC_NOTEHUB_TOKEN in .env.local"
    );
  }

  return { Authorization: `Bearer ${token}` };
}

const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

// ===========================
// Fetch notes list
// ===========================
export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
  sortBy,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params = {
    page,
    perPage,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(tag ? { tag } : {}),
    ...(sortBy ? { sortBy } : {}),
  };

  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params,
    headers: getAuthHeaders(),
  });

  return response.data;
}

// ===========================
// Create note
// ===========================
export async function createNote(body: CreateNoteParams): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", body, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

// ===========================
// Delete note
// ===========================
export async function deleteNote(id: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

// ===========================
// Fetch single note
// ===========================
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
