"use client";

import { useState, type FormEvent } from "react";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

interface NewDrawerModalProps {
  onCreate: (name: string, icon: string) => void;
  onClose: () => void;
}

const PRESET_ICONS = [
  "📁", "🗂️", "📦", "🎯", "💡", "🚀", "⭐", "🔥",
  "🎨", "🎵", "🍔", "🏠", "💼", "🎮", "📚", "✈️",
  "🛒", "💰", "🏆", "❤️", "🔖", "🧩", "🌱", "⚙️",
];

export default function NewDrawerModal({ onCreate, onClose }: NewDrawerModalProps) {
  useEscapeKey(onClose);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(PRESET_ICONS[0]);

  const canCreate = name.trim().length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    onCreate(name.trim(), icon || "📁");
  };

  return (
    <div className="prevent-autopaste fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">New drawer</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="e.g. Recipes, Work, Gift ideas..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Logo
          </label>
          <div className="flex items-center gap-2">
            <span className="w-11 h-11 flex items-center justify-center text-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0">
              {icon}
            </span>
            <input
              type="text"
              value={icon}
              onChange={(e) => {
                // Keep only the last character typed, so pasting a longer
                // string doesn't fill the badge with a wall of text.
                const chars = Array.from(e.target.value);
                setIcon(chars.length ? chars[chars.length - 1] : "");
              }}
              maxLength={4}
              placeholder="Or type any emoji..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="grid grid-cols-8 gap-1.5 pt-1">
            {PRESET_ICONS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setIcon(preset)}
                className={`text-lg p-1.5 rounded-lg transition ${
                  icon === preset
                    ? "bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canCreate}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
        >
          Create drawer
        </button>
      </form>
    </div>
  );
}
