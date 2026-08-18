"use client";

import { useMemo, useState } from "react";
import { diffTexts } from "@/app/lib/diffText";
import LineNumberedTextarea from "@/app/components/LineNumberedTextarea";

type ToolId = "diff";

const TOOLS: { id: ToolId; icon: string; title: string; description: string }[] = [
  {
    id: "diff",
    icon: "🔍",
    title: "Text diff",
    description: "Type or paste two texts and see what's shared and what changed, live.",
  },
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const closeAndReset = () => {
    setIsOpen(false);
    setActiveTool(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Toolbox"
        className="prevent-autopaste fixed right-5 bottom-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-300/40 dark:shadow-none flex items-center justify-center text-xl hover:scale-105 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all"
      >
        🧰
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                {activeTool && (
                  <button
                    onClick={() => setActiveTool(null)}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none text-sm"
                    title="Back"
                  >
                    ←
                  </button>
                )}
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {activeTool ? TOOLS.find((t) => t.id === activeTool)?.title : "Toolbox"}
                </h3>
              </div>
              <button
                onClick={closeAndReset}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!activeTool && (
                <div className="space-y-2">
                  {TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setActiveTool(tool.id)}
                      className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left"
                    >
                      <span className="text-xl shrink-0">{tool.icon}</span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {tool.title}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {tool.description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {activeTool === "diff" && <TextDiffTool />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
