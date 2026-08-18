"use client";

import { useEffect, useState, type ComponentType } from "react";
import { loadShortcuts, normalizeShortcut, saveShortcuts } from "@/app/lib/shortcuts";
import TextDiffTool from "@/app/components/tools/TextDiffTool";
import JsonFormatterTool from "@/app/components/tools/JsonFormatterTool";
import TextCleanerTool from "@/app/components/tools/TextCleanerTool";
import ListDedupeTool from "@/app/components/tools/ListDedupeTool";
import CaseConverterTool from "@/app/components/tools/CaseConverterTool";
import SlugGeneratorTool from "@/app/components/tools/SlugGeneratorTool";
import RegexTesterTool from "@/app/components/tools/RegexTesterTool";
import NumberBaseTool from "@/app/components/tools/NumberBaseTool";
import TimestampTool from "@/app/components/tools/TimestampTool";
import HashGeneratorTool from "@/app/components/tools/HashGeneratorTool";
import CsvJsonTool from "@/app/components/tools/CsvJsonTool";
import MarkdownPreviewTool from "@/app/components/tools/MarkdownPreviewTool";
import UuidGeneratorTool from "@/app/components/tools/UuidGeneratorTool";
import PasswordGeneratorTool from "@/app/components/tools/PasswordGeneratorTool";
import LoremIpsumTool from "@/app/components/tools/LoremIpsumTool";
import RandomPickerTool from "@/app/components/tools/RandomPickerTool";
import ColorConverterTool from "@/app/components/tools/ColorConverterTool";
import ImageCompressorTool from "@/app/components/tools/ImageCompressorTool";
import UnitConverterTool from "@/app/components/tools/UnitConverterTool";
import TextToSpeechTool from "@/app/components/tools/TextToSpeechTool";
import QuickTimerTool from "@/app/components/tools/QuickTimerTool";

type ToolId =
  | "diff"
  | "json"
  | "clean"
  | "dedupe"
  | "case"
  | "slug"
  | "regex"
  | "base"
  | "timestamp"
  | "hash"
  | "csv"
  | "markdown"
  | "uuid"
  | "password"
  | "lorem"
  | "picker"
  | "color"
  | "compress"
  | "units"
  | "speech"
  | "timer";

interface Tool {
  id: ToolId;
  icon: string;
  title: string;
  description: string;
  component: ComponentType;
}

interface ToolCategory {
  id: string;
  icon: string;
  title: string;
  tools: Tool[];
}

const CATEGORIES: ToolCategory[] = [
  {
    id: "text",
    icon: "📝",
    title: "Text",
    tools: [
      { id: "diff", icon: "🔍", title: "Text diff", description: "Compare two texts and see what changed", component: TextDiffTool },
      { id: "json", icon: "{ }", title: "JSON formatter", description: "Pretty-print and validate JSON", component: JsonFormatterTool },
      { id: "clean", icon: "🧹", title: "Text cleaner", description: "Strip extra spaces and blank lines", component: TextCleanerTool },
      { id: "dedupe", icon: "📋", title: "List dedupe & sort", description: "Remove duplicates and sort a list", component: ListDedupeTool },
      { id: "case", icon: "Aa", title: "Case converter", description: "Convert between camelCase, snake_case, etc.", component: CaseConverterTool },
      { id: "slug", icon: "🔗", title: "Slug generator", description: "Turn a title into a clean URL slug", component: SlugGeneratorTool },
      { id: "regex", icon: "🎯", title: "Regex tester", description: "Test a pattern against text, live", component: RegexTesterTool },
    ],
  },
  {
    id: "developer",
    icon: "💻",
    title: "Developer",
    tools: [
      { id: "base", icon: "01", title: "Number base converter", description: "Convert between binary, octal, decimal, hex", component: NumberBaseTool },
      { id: "timestamp", icon: "🕒", title: "Timestamp converter", description: "Convert Unix timestamps to readable dates", component: TimestampTool },
      { id: "hash", icon: "#️⃣", title: "Hash generator", description: "Generate SHA-1, SHA-256, SHA-512 hashes", component: HashGeneratorTool },
      { id: "csv", icon: "📊", title: "CSV ↔ JSON", description: "Convert between CSV and JSON", component: CsvJsonTool },
      { id: "markdown", icon: "Ⓜ️", title: "Markdown preview", description: "Live-render Markdown as HTML", component: MarkdownPreviewTool },
    ],
  },
  {
    id: "generate",
    icon: "✨",
    title: "Generate",
    tools: [
      { id: "uuid", icon: "🆔", title: "UUID generator", description: "Generate random UUID v4 values", component: UuidGeneratorTool },
      { id: "password", icon: "🔑", title: "Password generator", description: "Create strong random passwords", component: PasswordGeneratorTool },
      { id: "lorem", icon: "📄", title: "Lorem Ipsum generator", description: "Generate placeholder text", component: LoremIpsumTool },
      { id: "picker", icon: "🎲", title: "Random picker", description: "Randomly pick one item from a list", component: RandomPickerTool },
    ],
  },
  {
    id: "colors",
    icon: "🎨",
    title: "Colors",
    tools: [
      { id: "color", icon: "🌈", title: "Color converter", description: "Convert between HEX, RGB, and HSL", component: ColorConverterTool },
      { id: "compress", icon: "🖼️", title: "Image compressor", description: "Shrink an image's file size", component: ImageCompressorTool },
    ],
  },
  {
    id: "practical",
    icon: "🧭",
    title: "Practical",
    tools: [
      { id: "units", icon: "📐", title: "Unit converter", description: "Convert length, weight, and temperature", component: UnitConverterTool },
      { id: "speech", icon: "🔊", title: "Text to speech", description: "Read text aloud using your browser", component: TextToSpeechTool },
      { id: "timer", icon: "⏱️", title: "Quick timer", description: "A simple countdown timer with a beep", component: QuickTimerTool },
    ],
  },
];

const ALL_TOOLS = CATEGORIES.flatMap((c) => c.tools);

export default function ToolboxModal() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState<Record<string, string>>({});
  const [recordingToolId, setRecordingToolId] = useState<ToolId | null>(null);

  const openTool = (id: ToolId) => {
    setActiveTool(id);
    setIsPaletteOpen(false);
    setOpenCategory(null);
    setIsCatalogOpen(false);
  };

  // Load saved shortcuts once on mount.
  useEffect(() => {
    setShortcuts(loadShortcuts());
  }, []);

  // Single keydown handler for the whole toolbox:
  // 1. While recording a shortcut, capture it (Escape cancels, Backspace/Delete clears).
  // 2. Otherwise, Escape closes whatever popup is open (tool detail > catalog > speed-dial).
  // 3. Otherwise, a matching saved shortcut opens its tool from anywhere on the site.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (recordingToolId) {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === "Escape") {
          setRecordingToolId(null);
          return;
        }

        if (e.key === "Backspace" || e.key === "Delete") {
          setShortcuts((prev) => {
            const next = { ...prev };
            delete next[recordingToolId];
            saveShortcuts(next);
            return next;
          });
          setRecordingToolId(null);
          return;
        }

        const combo = normalizeShortcut(e);
        if (!combo) return; // bare modifier press — keep waiting

        setShortcuts((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(next)) {
            if (next[key] === combo) delete next[key];
          }
          next[recordingToolId] = combo;
          saveShortcuts(next);
          return next;
        });
        setRecordingToolId(null);
        return;
      }

      if (e.key === "Escape") {
        if (activeTool) {
          setActiveTool(null);
          return;
        }
        if (isCatalogOpen) {
          setIsCatalogOpen(false);
          return;
        }
        if (isPaletteOpen || openCategory) {
          setIsPaletteOpen(false);
          setOpenCategory(null);
        }
        return;
      }

      const combo = normalizeShortcut(e);
      if (!combo) return;
      const match = Object.entries(shortcuts).find(([, v]) => v === combo);
      if (match) {
        e.preventDefault();
        openTool(match[0] as ToolId);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [recordingToolId, activeTool, isCatalogOpen, isPaletteOpen, openCategory, shortcuts]);

  const closeAll = () => {
    setIsPaletteOpen(false);
    setOpenCategory(null);
  };

  const paletteVisibility = isPaletteOpen
    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
    : "opacity-0 scale-90 translate-y-2 pointer-events-none";

  const activeToolInfo = activeTool ? ALL_TOOLS.find((t) => t.id === activeTool) : null;
  const ActiveComponent = activeToolInfo?.component;

  return (
    <>
      <div
        className="group/toolbox fixed right-5 bottom-6 z-40 flex flex-col items-center gap-3"
        onMouseEnter={() => setIsPaletteOpen(true)}
        onMouseLeave={closeAll}
      >
        <div className={`flex flex-col items-center gap-3 transition-all duration-200 ease-out ${paletteVisibility}`}>
          {CATEGORIES.map((category) => (
            <div key={category.id} className="relative">
              {/* Flyout of tools, opens to the left of the category bubble on click */}
              <div
                className={`absolute right-full top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 transition-all duration-150 ease-out ${
                  openCategory === category.id
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-2 pointer-events-none"
                }`}
              >
                {category.tools.map((tool) => (
                  <div key={tool.id} className="group/item relative">
                    <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg">
                      {tool.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => openTool(tool.id)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg shadow-slate-300/40 dark:shadow-black/40 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform border-none outline-none"
                    >
                      {tool.icon}
                    </button>
                  </div>
                ))}
              </div>

              {/* Category bubble */}
              <button
                type="button"
                onClick={() => setOpenCategory((prev) => (prev === category.id ? null : category.id))}
                title={category.title}
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-lg shadow-slate-300/40 dark:shadow-black/40 flex items-center justify-center text-lg hover:scale-110 transition-transform border-none outline-none"
              >
                {category.icon}
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPaletteOpen((prev) => !prev)}
          onDoubleClick={() => {
            setIsPaletteOpen(false);
            setOpenCategory(null);
            setIsCatalogOpen(true);
          }}
          title="Toolbox (double-click for the full list)"
          className="prevent-autopaste w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-400/40 dark:shadow-indigo-900/60 flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-transform border-none outline-none"
        >
          🧰
        </button>
      </div>

      {isCatalogOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">🧰 All utilities</h3>
              <button
                onClick={() => {
                  setIsCatalogOpen(false);
                  setRecordingToolId(null);
                }}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {CATEGORIES.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-lg">{category.icon}</span>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{category.title}</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {category.tools.map((tool) => (
                      <div key={tool.id} className="group/card relative">
                        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-max max-w-[200px] whitespace-normal text-center bg-slate-900 dark:bg-slate-700 text-white text-[11px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/card:opacity-100 transition-opacity shadow-lg z-10">
                          {tool.description}
                        </span>
                        <div className="flex items-stretch gap-1">
                          <button
                            type="button"
                            onClick={() => openTool(tool.id)}
                            className="flex-1 min-w-0 flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left outline-none"
                          >
                            <span className="text-base shrink-0">{tool.icon}</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                              {tool.title}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecordingToolId((prev) => (prev === tool.id ? null : tool.id));
                            }}
                            title={
                              shortcuts[tool.id]
                                ? `Shortcut: ${shortcuts[tool.id]} — click to change, Backspace to clear`
                                : "Set a keyboard shortcut"
                            }
                            className={`shrink-0 w-8 rounded-xl border flex items-center justify-center text-sm transition outline-none ${
                              recordingToolId === tool.id
                                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 animate-pulse"
                                : "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            ⚙️
                          </button>
                        </div>
                        {(recordingToolId === tool.id || shortcuts[tool.id]) && (
                          <p className="mt-1 text-[10px] text-center font-mono">
                            {recordingToolId === tool.id ? (
                              <span className="text-indigo-600 dark:text-indigo-400">Press keys… (Esc to cancel)</span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">{shortcuts[tool.id]}</span>
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTool && ActiveComponent && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {activeToolInfo?.title}
                {activeTool && shortcuts[activeTool] && (
                  <span className="text-[10px] font-mono font-normal text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {shortcuts[activeTool]}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setActiveTool(null)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ActiveComponent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
