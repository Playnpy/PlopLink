"use client";

import { useMemo, useState } from "react";
import { testRegex } from "@/app/lib/textTools";

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("");
  const [text, setText] = useState("");

  const { segments, error, matchCount } = useMemo(() => testRegex(pattern, flags, text), [pattern, flags, text]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-z]+"
            spellCheck={false}
            className="w-full p-2.5 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-end gap-1">
          {["i", "m", "s"].map((flag) => (
            <button
              key={flag}
              type="button"
              onClick={() => toggleFlag(flag)}
              title={flag === "i" ? "Case insensitive" : flag === "m" ? "Multiline" : "Dot matches newline"}
              className={`w-8 h-[38px] rounded-lg text-xs font-mono font-bold border transition ${
                flags.includes(flag)
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Test text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Paste text to test against your pattern..."
          className="w-full p-3 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">
          {error}
        </p>
      ) : (
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            {matchCount} match{matchCount !== 1 ? "es" : ""}
          </p>
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
            {!text ? (
              <span className="text-slate-400 dark:text-slate-500 italic font-sans">
                Paste text above to test your pattern.
              </span>
            ) : (
              segments.map((seg, i) =>
                seg.matched ? (
                  <span
                    key={i}
                    className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded px-0.5"
                  >
                    {seg.value}
                  </span>
                ) : (
                  <span key={i} className="text-slate-700 dark:text-slate-300">
                    {seg.value}
                  </span>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
