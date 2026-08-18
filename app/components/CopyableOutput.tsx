"use client";

import { useState } from "react";

interface CopyableOutputProps {
  label?: string;
  value: string;
  mono?: boolean;
}

export default function CopyableOutput({ label, value, mono = true }: CopyableOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center justify-between mb-1">
        {label && <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>}
        <button
          onClick={handleCopy}
          disabled={!value}
          className="ml-auto text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-40 border-none outline-none"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p
        className={`text-sm text-slate-700 dark:text-slate-300 break-all whitespace-pre-wrap ${mono ? "font-mono" : ""}`}
      >
        {value || <span className="text-slate-400 dark:text-slate-500 italic font-sans">(empty)</span>}
      </p>
    </div>
  );
}
