"use client";

import { useState } from "react";
import { generateLorem } from "@/app/lib/generateTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function LoremIpsumTool() {
  const [mode, setMode] = useState<"words" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState(() => generateLorem(3, "paragraphs"));

  const regenerate = (nextMode = mode, nextCount = count) => {
    setResult(generateLorem(nextCount, nextMode));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <select
          value={mode}
          onChange={(e) => {
            const nextMode = e.target.value as "words" | "paragraphs";
            setMode(nextMode);
            regenerate(nextMode, count);
          }}
          className="p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="paragraphs">Paragraphs</option>
          <option value="words">Words</option>
        </select>
        <input
          type="number"
          min={1}
          max={mode === "words" ? 300 : 20}
          value={count}
          onChange={(e) => {
            const nextCount = Number(e.target.value);
            setCount(nextCount);
            regenerate(mode, nextCount);
          }}
          className="w-20 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="button"
          onClick={() => regenerate()}
          className="flex-1 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition border-none outline-none"
        >
          🔄 Regenerate
        </button>
      </div>

      <CopyableOutput value={result} mono={false} />
    </div>
  );
}
