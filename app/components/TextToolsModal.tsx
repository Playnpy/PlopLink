"use client";

import { useMemo, useState } from "react";
import {
  countStats,
  decodeBase64,
  decodeUrl,
  encodeBase64,
  encodeUrl,
  toLowercase,
  toUppercase,
} from "@/app/lib/textTools";

interface TextToolsModalProps {
  content: string;
  onClose: () => void;
}

export default function TextToolsModal({ content, onClose }: TextToolsModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const stats = useMemo(() => countStats(content), [content]);

  const rows = useMemo(
    () => [
      { key: "upper", label: "UPPERCASE", value: toUppercase(content) },
      { key: "lower", label: "lowercase", value: toLowercase(content) },
      { key: "b64enc", label: "Base64 encode", value: encodeBase64(content) },
      { key: "b64dec", label: "Base64 decode", value: decodeBase64(content) },
      { key: "urlenc", label: "URL encode", value: encodeUrl(content) },
      { key: "urldec", label: "URL decode", value: decodeUrl(content) },
    ],
    [content]
  );

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <h3 className="text-base font-bold text-slate-800">Text tools</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors border-none outline-none"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 shrink-0">
          {stats.characters} characters · {stats.words} words · {stats.lines} line{stats.lines > 1 ? "s" : ""}
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
          {rows.map((row) =>
            row.value === null ? (
              <div key={row.key} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold text-slate-400">{row.label}</p>
                <p className="text-xs text-slate-400 italic mt-0.5">Not valid input for this format</p>
              </div>
            ) : (
              <div key={row.key} className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-500">{row.label}</p>
                  <button
                    onClick={() => handleCopy(row.key, row.value as string)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 border-none outline-none"
                  >
                    {copiedKey === row.key ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-sm text-slate-700 break-all line-clamp-2">{row.value || "(empty)"}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
