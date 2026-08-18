"use client";

import { useMemo, useState } from "react";
import { toCamelCase, toConstantCase, toKebabCase, toSnakeCase, toTitleCase } from "@/app/lib/textTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function CaseConverterTool() {
  const [input, setInput] = useState("");

  const variants = useMemo(
    () => [
      { label: "camelCase", value: toCamelCase(input) },
      { label: "snake_case", value: toSnakeCase(input) },
      { label: "kebab-case", value: toKebabCase(input) },
      { label: "Title Case", value: toTitleCase(input) },
      { label: "CONSTANT_CASE", value: toConstantCase(input) },
    ],
    [input]
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Text</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="my variable name"
          className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="space-y-2">
        {variants.map((v) => (
          <CopyableOutput key={v.label} label={v.label} value={v.value} />
        ))}
      </div>
    </div>
  );
}
