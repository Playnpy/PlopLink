"use client";

import { useMemo, useState } from "react";
import { toSlug } from "@/app/lib/textTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const slug = useMemo(() => toSlug(input), [input]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="My Awesome Article!"
          className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <CopyableOutput label="Slug" value={slug} />
    </div>
  );
}
