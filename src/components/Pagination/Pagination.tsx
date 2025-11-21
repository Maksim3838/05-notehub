interface Props {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            padding: "6px 12px",
            background: p === currentPage ? "#333" : "#eee",
            color: p === currentPage ? "#fff" : "#000",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
