// --- Number base converter ---

export type NumberBase = 2 | 8 | 10 | 16;

export function convertBases(value: string, fromBase: NumberBase): Record<NumberBase, string> | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parseInt(trimmed, fromBase);
  if (Number.isNaN(parsed)) return null;
  return {
    2: parsed.toString(2),
    8: parsed.toString(8),
    10: parsed.toString(10),
    16: parsed.toString(16).toUpperCase(),
  };
}

// --- Timestamp converter ---

export interface TimestampResult {
  unixSeconds: string;
  unixMillis: string;
  iso: string;
  local: string;
  utc: string;
}

export function parseTimestampInput(value: string): TimestampResult | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  let date: Date;
  if (/^-?\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    // Heuristic: 10-digit-ish numbers are seconds, 13-digit-ish are milliseconds.
    date = new Date(Math.abs(num) < 1e11 ? num * 1000 : num);
  } else {
    date = new Date(trimmed);
  }

  if (Number.isNaN(date.getTime())) return null;

  return {
    unixSeconds: Math.floor(date.getTime() / 1000).toString(),
    unixMillis: date.getTime().toString(),
    iso: date.toISOString(),
    local: date.toLocaleString(),
    utc: date.toUTCString(),
  };
}

// --- Hash generator (Web Crypto API — no MD5, browsers don't support it natively) ---

export async function hashText(text: string): Promise<{ sha1: string; sha256: string; sha512: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const toHex = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const [sha1, sha256, sha512] = await Promise.all([
    crypto.subtle.digest("SHA-1", data),
    crypto.subtle.digest("SHA-256", data),
    crypto.subtle.digest("SHA-512", data),
  ]);

  return { sha1: toHex(sha1), sha256: toHex(sha256), sha512: toHex(sha512) };
}

// --- CSV <-> JSON ---

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function csvToJson(text: string): string {
  const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return "[]";
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ?? "";
    });
    return row;
  });
  return JSON.stringify(rows, null, 2);
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function jsonToCsv(text: string): string {
  const parsed = JSON.parse(text);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length === 0) return "";
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvCell(String(row[h] ?? ""))).join(","));
  }
  return lines.join("\n");
}

export function convertCsvJson(text: string): { result: string; direction: "csv-to-json" | "json-to-csv"; error: string | null } {
  const trimmed = text.trim();
  if (!trimmed) return { result: "", direction: "csv-to-json", error: null };

  const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[");

  try {
    if (looksLikeJson) {
      return { result: jsonToCsv(trimmed), direction: "json-to-csv", error: null };
    }
    return { result: csvToJson(trimmed), direction: "csv-to-json", error: null };
  } catch (e) {
    return {
      result: "",
      direction: looksLikeJson ? "json-to-csv" : "csv-to-json",
      error: e instanceof Error ? e.message : "Conversion failed",
    };
  }
}
