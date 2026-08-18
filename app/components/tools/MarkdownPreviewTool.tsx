"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";

// marked doesn't sanitize embedded raw HTML by default (e.g. a pasted
// <script> tag would be preserved verbatim). This tool never saves or
// shares its content, so the risk is self-contained to the current tab —
// but this still strips the sharpest footguns before injecting the output.
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export default function MarkdownPreviewTool() {
  const [input, setInput] = useState("");

  const html = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return sanitizeHtml(marked.parse(input, { async: false }) as string);
    } catch {
      return "";
    }
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Markdown</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder={"# Title\n\nSome **bold** text and a [link](https://example.com)."}
            spellCheck={false}
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Preview</label>
          <div
            className="md-preview p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-[212px] overflow-y-auto text-slate-800 dark:text-slate-100 text-sm"
            dangerouslySetInnerHTML={{ __html: html || "<p class='text-slate-400 italic'>Nothing to preview yet.</p>" }}
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        This preview only renders in your browser — nothing here is saved or sent anywhere.
      </p>
    </div>
  );
}
