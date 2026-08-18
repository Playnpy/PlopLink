"use client";

import { useMemo, useState } from "react";
import { convertBases, type NumberBase } from "@/app/lib/devTools";
import CopyableOutput from "@/app/components/CopyableOutput";

const BASES: { base: NumberBase; label: string }[] = [
  { base: 10, label: "Decimal" },
  { base: 2, label: "Binary" },
  { base: 8, label: "Octal" },
  { base: 16, label: "Hexadecimal" },
];

export default function NumberBaseTool() {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState<NumberBase>(10);

  const results = useMemo(() => convertBases(value, fromBase), [value, fromBase]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="42"
          spellCheck={false}
          className="flex-1 p-3 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <select
          value={fromBase}
          onChange={(e) => setFromBase(Number(e.target.value) as NumberBase)}
          className="p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {BASES.map((b) => (
            <option key={b.base} value={b.base}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {value.trim() && !results && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">
          Not a valid number in that base.
        </p>
      )}

      {results && (
        <div className="space-y-2">
          {BASES.map((b) => (
            <CopyableOutput key={b.base} label={b.label} value={results[b.base]} />
          ))}
        </div>
      )}
    </div>
  );
}
