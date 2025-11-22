import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import type { Note } from "../../types/note";
import { fetchNotes, deleteNote } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";

interface NotesData {
  data: Note[];
  totalPages: number;
}

interface DeleteContext {
  previousData?: NotesData;
}

export default function App() {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError } = useQuery<NotesData, Error>({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes({ page: currentPage, search: debouncedSearch }),
    placeholderData: () =>
      queryClient.getQueryData<NotesData>(["notes", debouncedSearch, currentPage - 1]),
  });

    const deleteMutation = useMutation<void, Error, string, DeleteContext>({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notes", debouncedSearch, currentPage] });

      const previousData = queryClient.getQueryData<NotesData>(["notes", debouncedSearch, currentPage]);

      if (previousData) {
        queryClient.setQueryData<NotesData>(["notes", debouncedSearch, currentPage], {
          ...previousData,
          data: previousData.data.filter(note => note.id !== id),
        });
      }

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<NotesData>(["notes", debouncedSearch, currentPage], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", debouncedSearch, currentPage] });
    },
  });

  const handleDelete = (id: string) => deleteMutation.mutate(id);

  const notes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value);
            setCurrentPage(1);
          }}
        />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 ? (
        <>
          <NoteList notes={notes} onDelete={handleDelete} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <p>Немає нотаток</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
