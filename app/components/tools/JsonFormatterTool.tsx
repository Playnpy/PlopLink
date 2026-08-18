"use client";

import { useMemo, useState } from "react";
import { formatJson } from "@/app/lib/textTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const { result, error } = useMemo(() => formatJson(input), [input]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Paste JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder='{"hello": "world"}'
          spellCheck={false}
          className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">
          {error}
        </p>
      ) : (
        <CopyableOutput label="Formatted" value={result} />
      )}
    </div>
  );
}
