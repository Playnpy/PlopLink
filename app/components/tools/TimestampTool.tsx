"use client";

import { useMemo, useState } from "react";
import { parseTimestampInput } from "@/app/lib/devTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function TimestampTool() {
  const [value, setValue] = useState("");

  const result = useMemo(() => parseTimestampInput(value), [value]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="1735689600 or 2025-01-01T00:00:00Z"
          spellCheck={false}
          className="flex-1 p-3 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="button"
          onClick={() => setValue(Math.floor(Date.now() / 1000).toString())}
          className="px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition border-none outline-none shrink-0"
        >
          Now
        </button>
      </div>

      {value.trim() && !result && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">
          Couldn't parse that as a timestamp or date.
        </p>
      )}

      {result && (
        <div className="space-y-2">
          <CopyableOutput label="Unix seconds" value={result.unixSeconds} />
          <CopyableOutput label="Unix milliseconds" value={result.unixMillis} />
          <CopyableOutput label="ISO 8601" value={result.iso} />
          <CopyableOutput label="Local time" value={result.local} mono={false} />
          <CopyableOutput label="UTC" value={result.utc} mono={false} />
        </div>
      )}
    </div>
  );
}
