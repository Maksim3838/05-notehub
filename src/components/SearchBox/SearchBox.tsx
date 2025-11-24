interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
