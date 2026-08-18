"use client";

import { useEffect, useState } from "react";
import { generatePassword, passwordStrength, type PasswordOptions } from "@/app/lib/generateTools";
import CopyableOutput from "@/app/components/CopyableOutput";

const STRENGTH_COLORS: Record<number, string> = {
  0: "bg-slate-200 dark:bg-slate-700",
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-emerald-400",
  4: "bg-emerald-600",
};

export default function PasswordGeneratorTool() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");

  const regenerate = () => setPassword(generatePassword(options));

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const strength = passwordStrength(password);
  const toggle = (key: keyof Omit<PasswordOptions, "length">) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const activeCount = ["uppercase", "lowercase", "numbers", "symbols"].filter(
        (k) => next[k as keyof Omit<PasswordOptions, "length">]
      ).length;
      return activeCount === 0 ? prev : next;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <CopyableOutput value={password} />
        <div className="flex items-center gap-1.5 mt-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${step <= strength.score ? STRENGTH_COLORS[strength.score] : "bg-slate-200 dark:bg-slate-700"}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{strength.label}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Length</label>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{options.length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={48}
          value={options.length}
          onChange={(e) => setOptions((prev) => ({ ...prev, length: Number(e.target.value) }))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["uppercase", "A-Z"],
            ["lowercase", "a-z"],
            ["numbers", "0-9"],
            ["symbols", "!@#$"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
          >
            <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} className="accent-indigo-600" />
            {label}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={regenerate}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
      >
        🔄 Regenerate
      </button>
    </div>
  );
}
