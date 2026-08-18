"use client";

import { useEffect, useState } from "react";
import { hashText } from "@/app/lib/devTools";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<{ sha1: string; sha256: string; sha512: string } | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes(null);
      return;
    }
    let cancelled = false;
    hashText(input).then((result) => {
      if (!cancelled) setHashes(result);
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Type or paste text to hash..."
          className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      <div className="space-y-2">
        <CopyableOutput label="SHA-1" value={hashes?.sha1 ?? ""} />
        <CopyableOutput label="SHA-256" value={hashes?.sha256 ?? ""} />
        <CopyableOutput label="SHA-512" value={hashes?.sha512 ?? ""} />
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        MD5 isn't included — modern browsers don't support it natively, and it's considered insecure anyway.
      </p>
    </div>
  );
}
