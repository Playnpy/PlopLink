"use client";

import { useMemo, useState } from "react";
import { dedupeList } from "@/app/lib/textTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function ListDedupeTool() {
  const [input, setInput] = useState("");
  const [sort, setSort] = useState(true);
  const { result, removedCount } = useMemo(() => dedupeList(input, sort), [input, sort]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
          One item per line
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={"apple\nbanana\napple\ncherry"}
          className="w-full p-3 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={sort}
          onChange={(e) => setSort(e.target.checked)}
          className="accent-indigo-600"
        />
        Sort A → Z
      </label>

      {input.trim() && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {removedCount > 0 ? `Removed ${removedCount} duplicate${removedCount > 1 ? "s" : ""}` : "No duplicates found"}
        </p>
      )}

      <CopyableOutput label="Result" value={result} />
    </div>
  );
}
