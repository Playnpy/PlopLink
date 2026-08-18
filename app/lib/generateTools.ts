// --- Password generator ---

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

export function generatePassword(options: PasswordOptions): string {
  const pools = (Object.keys(CHARSETS) as (keyof typeof CHARSETS)[]).filter((key) => options[key]).map((key) => CHARSETS[key]);
  if (pools.length === 0) return "";

  const fullPool = pools.join("");
  const randomValues = new Uint32Array(options.length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (v) => fullPool[v % fullPool.length]).join("");
}

export function passwordStrength(password: string): { label: string; score: number } {
  if (!password) return { label: "—", score: 0 };

  let poolSize = 0;
  let varietyCount = 0;
  if (/[a-z]/.test(password)) {
    poolSize += 26;
    varietyCount++;
  }
  if (/[A-Z]/.test(password)) {
    poolSize += 26;
    varietyCount++;
  }
  if (/[0-9]/.test(password)) {
    poolSize += 10;
    varietyCount++;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    poolSize += 32;
    varietyCount++;
  }

  const bits = Math.log2(Math.pow(poolSize || 1, password.length));

  if (password.length < 8 || varietyCount < 2) return { label: "Weak", score: 1 };
  if (bits < 60) return { label: "Fair", score: 2 };
  if (bits < 100) return { label: "Good", score: 3 };
  return { label: "Strong", score: 4 };
}

// --- Lorem Ipsum generator ---

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateSentence(): string {
  const wordCount = randomInt(6, 14);
  const words = Array.from({ length: wordCount }, () => LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(): string {
  const sentenceCount = randomInt(3, 6);
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

export function generateLorem(count: number, mode: "words" | "paragraphs"): string {
  if (mode === "words") {
    const words = Array.from({ length: count }, () => LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
    return capitalize(words.join(" ")) + ".";
  }
  return Array.from({ length: count }, generateParagraph).join("\n\n");
}
