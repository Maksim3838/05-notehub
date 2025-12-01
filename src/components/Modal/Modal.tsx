import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import css from "../Modal/Modal.module.css"

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const modalRoot =
    document.getElementById("modal-root") ??
    (() => {
      const root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
      return root;
    })();
  
  useEffect(() => {
    if (!isOpen) return; 
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

       const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

    if (!isOpen) return null;

  return createPortal(
    <div className={css.backdrop}
      onClick={onClose}
          >
      <div className={css.modal}
        onClick={(e) => e.stopPropagation()}
              >
        {children}
      </div>
    </div>,
    modalRoot
  );
}
