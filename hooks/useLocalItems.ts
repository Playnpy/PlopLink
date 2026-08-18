"use client";

import { useEffect, useRef, useState } from "react";
import type { PocketItem } from "@/app/types";

const STORAGE_KEY = "vide_poche_items";

/**
 * Loads items from localStorage on mount, then persists them automatically
 * on every change.
 */
export function useLocalItems() {
  const [items, setItems] = useState<PocketItem[]>([]);
  const isLoaded = useRef(false);

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Error reading cache", e);
      }
    }
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  return [items, setItems] as const;
}
