import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const modalRoot = document.getElementById("modal-root")!; 

export default function Modal({ onClose, children }: ModalProps) {
  
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const modalContent = (
    <div
      onClick={onClose} 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} 
        style={{
          background: "white",
          padding: 20,
          width: 400,
          borderRadius: 8,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {children}
        <button onClick={onClose} style={{ marginTop: 10 }}>
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
}

