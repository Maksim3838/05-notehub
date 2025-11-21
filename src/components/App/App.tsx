import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import type { Note } from "../../types/note";
import { fetchNotes, deleteNote } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";

export default function App() {
  const queryClient = useQueryClient();

    const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchValue, 500);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { data, isLoading, isError } = useQuery<{
    results: Note[];
    totalPages: number;
    currentPage: number;
  }>({
    queryKey: ["notes", debouncedSearch],
    queryFn: () => fetchNotes({ search: debouncedSearch }),
  });

    const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={setSearchValue} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* NoteList тільки якщо є нотатки */}
      {data && data.results.length > 0 && (
        <NoteList
          notes={data.results}
          onDelete={(id: number) => deleteMutation.mutate(id)}
        />
      )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {data && data.results.length === 0 && <p>Немає нотаток</p>}

      {/* Модалка для створення нотатки */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
