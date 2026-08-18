"use client";

import { useMemo, useState } from "react";
import { diffTexts } from "@/app/lib/diffText";
import LineNumberedTextarea from "@/app/components/LineNumberedTextarea";

export default function TextDiffTool() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  // Recomputed automatically on every keystroke — no "compare" button.
  const parts = useMemo(() => diffTexts(textA, textB), [textA, textB]);
  const hasContent = textA.length > 0 || textB.length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Text A</label>
          <LineNumberedTextarea value={textA} onChange={setTextA} placeholder="Paste the original text..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Text B</label>
          <LineNumberedTextarea value={textB} onChange={setTextB} placeholder="Paste the changed text..." />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          Live diff{" "}
          <span className="font-normal text-slate-400 dark:text-slate-500">
            — <span className="text-emerald-600 dark:text-emerald-400 font-semibold">green</span> is shared text,{" "}
            <span className="text-red-600 dark:text-red-400 font-semibold">red</span> is different
          </span>
        </p>
        <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
          {!hasContent ? (
            <span className="text-slate-400 dark:text-slate-500 italic font-sans">
              Start typing in either box — the comparison updates as you go.
            </span>
          ) : (
            parts.map((part, i) => {
              if (part.added || part.removed) {
                return (
                  <span
                    key={i}
                    className={`bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 rounded px-0.5 ${
                      part.removed ? "line-through" : ""
                    }`}
                  >
                    {part.value}
                  </span>
                );
              }
              return (
                <span
                  key={i}
                  className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded px-0.5"
                >
                  {part.value}
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
