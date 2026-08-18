"use client";

import { useState } from "react";

export default function RandomPickerTool() {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [removeAfterPick, setRemoveAfterPick] = useState(false);

  const options = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const pick = () => {
    if (options.length === 0) return;
    const choice = options[Math.floor(Math.random() * options.length)];
    setPicked(choice);
    if (removeAfterPick) {
      setInput(options.filter((o) => o !== choice).join("\n"));
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
          One option per line
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setPicked(null);
          }}
          rows={6}
          placeholder={"Pizza\nSushi\nBurgers\nTacos"}
          className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={removeAfterPick}
          onChange={(e) => setRemoveAfterPick(e.target.checked)}
          className="accent-indigo-600"
        />
        Remove picked option from the list
      </label>

      <button
        type="button"
        onClick={pick}
        disabled={options.length === 0}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
      >
        🎲 Pick one
      </button>

      {picked && (
        <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 text-center">
          <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{picked}</p>
        </div>
      )}
    </div>
  );
}
