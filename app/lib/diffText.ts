import { diffWords } from "diff";

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function diffTexts(a: string, b: string): DiffPart[] {
  return diffWords(a, b);
}
