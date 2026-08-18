"use client";

import { useMemo, useState } from "react";
import { convertUnit, UNIT_OPTIONS, type UnitCategory } from "@/app/lib/unitTools";

const CATEGORIES: { id: UnitCategory; label: string; icon: string }[] = [
  { id: "length", label: "Length", icon: "📏" },
  { id: "weight", label: "Weight", icon: "⚖️" },
  { id: "temperature", label: "Temperature", icon: "🌡️" },
];

export default function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(UNIT_OPTIONS.length[2]); // meters
  const [to, setTo] = useState(UNIT_OPTIONS.length[0]); // mm

  const options = UNIT_OPTIONS[category];

  const result = useMemo(() => {
    const num = Number(value);
    if (Number.isNaN(num)) return null;
    return convertUnit(num, from, to, category);
  }, [value, from, to, category]);

  const changeCategory = (next: UnitCategory) => {
    setCategory(next);
    setFrom(UNIT_OPTIONS[next][0]);
    setTo(UNIT_OPTIONS[next][1]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => changeCategory(c.id)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition flex items-center justify-center gap-1.5 ${
              category === c.id
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">From</label>
          <div className="space-y-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {options.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">To</label>
          <div className="space-y-2">
            <div className="p-2.5 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono truncate">
              {result === null ? "—" : Number(result.toFixed(6)).toString()}
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {options.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
