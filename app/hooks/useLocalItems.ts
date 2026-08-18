"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, PocketItem } from "@/app/types";

const STORAGE_KEY = "vide_poche_items";

// One-time migration for items saved before the app's category labels were
// translated to English (e.g. "Texte" -> "Text"). Anything already valid,
// or unrecognized, passes through unchanged.
const LEGACY_CATEGORY_MAP: Record<string, Category> = {
  Texte: "Text",
  "Liens web": "Web Link",
  Mail: "Email",
  Téléphone: "Phone",
};

function normalizeItem(item: PocketItem): PocketItem {
  const mapped = LEGACY_CATEGORY_MAP[item.category as string];
  return mapped ? { ...item, category: mapped } : item;
}

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
        const parsed: PocketItem[] = JSON.parse(savedItems);
        setItems(parsed.map(normalizeItem));
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
