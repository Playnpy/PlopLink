"use client";

import { useEffect, useRef, useState } from "react";
import type { PocketItem } from "@/app/types";

const STORAGE_KEY = "vide_poche_items";

/**
 * Charge les items depuis le localStorage au montage, puis les persiste
 * automatiquement à chaque changement. Comportement identique à l'ancien
 * code, simplement extrait dans son propre hook.
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
        console.error("Erreur de lecture du cache", e);
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
