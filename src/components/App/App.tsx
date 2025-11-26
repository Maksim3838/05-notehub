import { useState, useEffect, startTransition } from "react";
import { useQuery } from "@tanstack/react-query";

import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import type { Note } from "../../types/note";

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

const fetchNotes = async (page: number, search: string): Promise<NotesResponse> => {
  const res = await fetch(`/api/notes?page=${page}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
    startTransition(() => setCurrentPage(1));
  }, [debouncedSearch]);

  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const { data, isLoading, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>My Notes App</h1>

      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      <button style={{ marginTop: "10px" }} onClick={() => setIsModalOpen(true)}>
        Create Note
      </button>

      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      {isLoading && <p>Loading notes...</p>}
      {error && <p style={{ color: "red" }}>Error loading notes: {error.message}</p>}

      {!isLoading && notes.length > 0 && <NoteList notes={notes} />}
      {!isLoading && notes.length === 0 && <p>No notes found</p>}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          pageCount={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
