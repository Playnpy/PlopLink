"use client";

import { useState } from "react";
import { hslToRgb, parseHex, rgbToHex, rgbToHsl, type RGB } from "@/app/lib/colorTools";
import CopyableOutput from "@/app/components/CopyableOutput";

const DEFAULT_RGB: RGB = { r: 79, g: 70, b: 229 };

export default function ColorConverterTool() {
  const [rgb, setRgb] = useState<RGB>(DEFAULT_RGB);
  const [hexInput, setHexInput] = useState(rgbToHex(DEFAULT_RGB));

  const hsl = rgbToHsl(rgb);
  const hex = rgbToHex(rgb);

  const applyHex = (value: string) => {
    setHexInput(value);
    const parsed = parseHex(value);
    if (parsed) setRgb(parsed);
  };

  const applyRgbField = (key: keyof RGB, value: string) => {
    const num = Math.max(0, Math.min(255, Number(value) || 0));
    const next = { ...rgb, [key]: num };
    setRgb(next);
    setHexInput(rgbToHex(next));
  };

  const applyHslField = (key: "h" | "s" | "l", value: string) => {
    const max = key === "h" ? 360 : 100;
    const num = Math.max(0, Math.min(max, Number(value) || 0));
    const nextHsl = { ...hsl, [key]: num };
    const nextRgb = hslToRgb(nextHsl);
    setRgb(nextRgb);
    setHexInput(rgbToHex(nextRgb));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => applyHex(e.target.value)}
          className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => applyHex(e.target.value)}
          spellCheck={false}
          className="flex-1 p-3 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">RGB</p>
        <div className="grid grid-cols-3 gap-2">
          {(["r", "g", "b"] as const).map((key) => (
            <input
              key={key}
              type="number"
              min={0}
              max={255}
              value={rgb[key]}
              onChange={(e) => applyRgbField(key, e.target.value)}
              className="p-2 text-sm text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">HSL</p>
        <div className="grid grid-cols-3 gap-2">
          {(["h", "s", "l"] as const).map((key) => (
            <input
              key={key}
              type="number"
              min={0}
              max={key === "h" ? 360 : 100}
              value={hsl[key]}
              onChange={(e) => applyHslField(key, e.target.value)}
              className="p-2 text-sm text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <CopyableOutput label="HEX" value={hex} />
        <CopyableOutput label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        <CopyableOutput label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
      </div>
    </div>
  );
}
