interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)" }}>
      <div style={{ background: "white", margin: "10% auto", padding: 20, width: 400 }}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
