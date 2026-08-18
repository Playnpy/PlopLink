"use client";

import { useState, type ComponentType } from "react";
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
      { id: "diff", icon: "🔍", title: "Text diff", component: TextDiffTool },
      { id: "json", icon: "{ }", title: "JSON formatter", component: JsonFormatterTool },
      { id: "clean", icon: "🧹", title: "Text cleaner", component: TextCleanerTool },
      { id: "dedupe", icon: "📋", title: "List dedupe & sort", component: ListDedupeTool },
      { id: "case", icon: "Aa", title: "Case converter", component: CaseConverterTool },
      { id: "slug", icon: "🔗", title: "Slug generator", component: SlugGeneratorTool },
      { id: "regex", icon: "🎯", title: "Regex tester", component: RegexTesterTool },
    ],
  },
  {
    id: "developer",
    icon: "💻",
    title: "Developer",
    tools: [
      { id: "base", icon: "01", title: "Number base converter", component: NumberBaseTool },
      { id: "timestamp", icon: "🕒", title: "Timestamp converter", component: TimestampTool },
      { id: "hash", icon: "#️⃣", title: "Hash generator", component: HashGeneratorTool },
      { id: "csv", icon: "📊", title: "CSV ↔ JSON", component: CsvJsonTool },
      { id: "markdown", icon: "Ⓜ️", title: "Markdown preview", component: MarkdownPreviewTool },
    ],
  },
  {
    id: "generate",
    icon: "✨",
    title: "Generate",
    tools: [
      { id: "uuid", icon: "🆔", title: "UUID generator", component: UuidGeneratorTool },
      { id: "password", icon: "🔑", title: "Password generator", component: PasswordGeneratorTool },
      { id: "lorem", icon: "📄", title: "Lorem Ipsum generator", component: LoremIpsumTool },
      { id: "picker", icon: "🎲", title: "Random picker", component: RandomPickerTool },
    ],
  },
  {
    id: "colors",
    icon: "🎨",
    title: "Colors",
    tools: [
      { id: "color", icon: "🌈", title: "Color converter", component: ColorConverterTool },
      { id: "compress", icon: "🖼️", title: "Image compressor", component: ImageCompressorTool },
    ],
  },
  {
    id: "practical",
    icon: "🧭",
    title: "Practical",
    tools: [
      { id: "units", icon: "📐", title: "Unit converter", component: UnitConverterTool },
      { id: "speech", icon: "🔊", title: "Text to speech", component: TextToSpeechTool },
      { id: "timer", icon: "⏱️", title: "Quick timer", component: QuickTimerTool },
    ],
  },
];

const ALL_TOOLS = CATEGORIES.flatMap((c) => c.tools);

export default function ToolboxModal() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const openTool = (id: ToolId) => {
    setActiveTool(id);
    setIsPaletteOpen(false);
    setOpenCategory(null);
  };

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
          title="Toolbox"
          className="prevent-autopaste w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-400/40 dark:shadow-indigo-900/60 flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-transform border-none outline-none"
        >
          🧰
        </button>
      </div>

      {activeTool && ActiveComponent && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{activeToolInfo?.title}</h3>
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
