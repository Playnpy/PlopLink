"use client";

import { useEffect } from "react";

/**
 * Calls onClose whenever Escape is pressed. Meant to be used inside a modal
 * component that's only mounted while open, so the listener is naturally
 * attached/detached alongside the modal itself.
 */
export function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
}
