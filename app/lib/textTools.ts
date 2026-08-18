export function toUppercase(text: string): string {
  return text.toUpperCase();
}

export function toLowercase(text: string): string {
  return text.toLowerCase();
}

export interface TextStats {
  characters: number;
  words: number;
  lines: number;
}

export function countStats(text: string): TextStats {
  const trimmed = text.trim();
  return {
    characters: text.length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: text.split(/\r\n|\r|\n/).length,
  };
}

export function encodeBase64(text: string): string | null {
  try {
    return window.btoa(unescape(encodeURIComponent(text)));
  } catch {
    return null;
  }
}

export function decodeBase64(text: string): string | null {
  try {
    return decodeURIComponent(escape(window.atob(text)));
  } catch {
    return null;
  }
}

export function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

export function decodeUrl(text: string): string | null {
  try {
    return decodeURIComponent(text);
  } catch {
    return null;
  }
}
