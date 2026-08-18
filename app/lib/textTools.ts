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

// --- JSON formatter ---

export function formatJson(text: string): { result: string; error: string | null } {
  if (!text.trim()) return { result: "", error: null };
  try {
    const parsed = JSON.parse(text);
    return { result: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { result: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

// --- Text cleaner ---

export function cleanText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// --- List dedupe & sort ---

export function dedupeList(text: string, sort: boolean): { result: string; removedCount: number } {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      unique.push(line);
    }
  }

  const removedCount = lines.length - unique.length;
  const finalList = sort ? [...unique].sort((a, b) => a.localeCompare(b)) : unique;
  return { result: finalList.join("\n"), removedCount };
}

// --- Case converter ---

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function toCamelCase(text: string): string {
  const words = splitWords(text).map((w) => w.toLowerCase());
  return words.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join("");
}

export function toSnakeCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("_");
}

export function toKebabCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("-");
}

export function toTitleCase(text: string): string {
  return splitWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function toConstantCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toUpperCase())
    .join("_");
}

// --- Slug generator ---

export function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Regex tester ---

export interface RegexSegment {
  value: string;
  matched?: boolean;
}

export function testRegex(
  pattern: string,
  flags: string,
  text: string
): { segments: RegexSegment[]; error: string | null; matchCount: number } {
  if (!pattern) return { segments: [{ value: text }], error: null, matchCount: 0 };

  try {
    const finalFlags = flags.includes("g") ? flags : flags + "g";
    const re = new RegExp(pattern, finalFlags);
    const segments: RegexSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ value: text.slice(lastIndex, match.index) });
      }
      segments.push({ value: match[0], matched: true });
      lastIndex = match.index + match[0].length;
      count++;
      if (match[0].length === 0) re.lastIndex++;
      if (count > 5000) break;
    }
    if (lastIndex < text.length) {
      segments.push({ value: text.slice(lastIndex) });
    }

    return { segments, error: null, matchCount: count };
  } catch (e) {
    return { segments: [{ value: text }], error: e instanceof Error ? e.message : "Invalid regex", matchCount: 0 };
  }
}
