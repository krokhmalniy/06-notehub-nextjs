"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  // Портал-таргет: якщо в тебе є окремий div#modal-root — використай його.
  // Якщо немає — безпечно падаємо на document.body.
  const portalTarget =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") ?? document.body
      : null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    // Disable page scroll while modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!portalTarget) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalTarget
  );
}
