"use client";

import { useRef, type ChangeEvent } from "react";

interface LineNumberedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function LineNumberedTextarea({ value, onChange, placeholder }: LineNumberedTextareaProps) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = value.split("\n").length;

  const handleScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <div
        ref={gutterRef}
        className="select-none text-right px-2 py-2 text-xs font-mono text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-700 overflow-hidden h-40"
        style={{ lineHeight: "1.5rem" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 h-40 p-2 text-xs font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none bg-transparent"
        style={{ lineHeight: "1.5rem" }}
      />
    </div>
  );
}
