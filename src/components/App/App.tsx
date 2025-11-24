import { useState, useEffect } from "react";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

    useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 500); 

    return () => clearTimeout(handler);
  }, [searchQuery]);

  
  useEffect(() => {
    async function loadNotes() {
      
      console.log("Fetch notes for page:", currentPage, "search:", debouncedSearch);
    }
    loadNotes();
  }, [currentPage, debouncedSearch]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button onClick={() => setIsModalOpen(true)}>Create Note</button>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <NoteForm
              onClose={() => setIsModalOpen(false)}
              onSubmit={(note) => {
                console.log("New note:", note);
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page: {currentPage}</span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
}
