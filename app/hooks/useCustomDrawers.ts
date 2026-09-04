"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomDrawer } from "@/app/types";

const STORAGE_KEY = "vide_poche_custom_drawers";

/**
 * Loads user-created drawers from localStorage on mount, then persists them
 * automatically on every change. Mirrors useLocalItems.
 */
export function useCustomDrawers() {
  const [drawers, setDrawers] = useState<CustomDrawer[]>([]);
  const isLoaded = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDrawers(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading custom drawers", e);
      }
    }
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    if (isLoaded.current) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drawers));
      } catch (e) {
        console.error("Unable to save drawers: storage quota may be full.", e);
      }
    }
  }, [drawers]);

  return [drawers, setDrawers] as const;
}
