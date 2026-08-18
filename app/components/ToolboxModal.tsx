"use client";

import { useMemo, useState } from "react";
import { diffTexts } from "@/app/lib/diffText";
import LineNumberedTextarea from "@/app/components/LineNumberedTextarea";

type ToolId = "diff";

const TOOLS: { id: ToolId; icon: string; title: string }[] = [{ id: "diff", icon: "🔍", title: "Text diff" }];

function TextDiffTool() {
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

export default function ToolboxModal() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const openTool = (id: ToolId) => {
    setActiveTool(id);
    setIsPaletteOpen(false);
  };

  const paletteVisibility = isPaletteOpen
    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
    : "opacity-0 scale-90 translate-y-2 pointer-events-none";

  return (
    <>
      <div
        className="group/toolbox fixed right-5 bottom-6 z-40 flex flex-col items-center gap-3"
        onMouseEnter={() => setIsPaletteOpen(true)}
        onMouseLeave={() => setIsPaletteOpen(false)}
      >
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-200 ease-out ${paletteVisibility}`}
        >
          {TOOLS.map((tool, i) => (
            <div key={tool.id} className="group/item relative" style={{ transitionDelay: `${i * 40}ms` }}>
              <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg">
                {tool.title}
              </span>
              <button
                type="button"
                onClick={() => openTool(tool.id)}
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-lg shadow-slate-300/40 dark:shadow-black/40 flex items-center justify-center text-lg hover:scale-110 transition-transform border-none outline-none"
              >
                {tool.icon}
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPaletteOpen((prev) => !prev)}
          title="Toolbox"
          className="prevent-autopaste w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-400/40 dark:shadow-indigo-900/60 flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-transform border-none outline-none"
        >
          🧰
        </button>
      </div>

      {activeTool === "diff" && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Text diff</h3>
              <button
                onClick={() => setActiveTool(null)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TextDiffTool />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
