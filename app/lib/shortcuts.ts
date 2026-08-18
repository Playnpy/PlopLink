const STORAGE_KEY = "plop_tool_shortcuts";

/** Normalizes a keydown event into a display/storage string, e.g. "Ctrl+Shift+D". Returns null for a bare modifier press. */
export function normalizeShortcut(e: KeyboardEvent): string | null {
  const key = e.key;
  if (key === "Control" || key === "Shift" || key === "Alt" || key === "Meta") return null;

  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.metaKey) parts.push("Cmd");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");
  parts.push(key.length === 1 ? key.toUpperCase() : key);

  return parts.join("+");
}

export function loadShortcuts(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveShortcuts(map: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error("Couldn't save shortcuts", err);
  }
}
