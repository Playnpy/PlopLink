"use client";

import { useState } from "react";
import CopyableOutput from "@/app/components/CopyableOutput";

export default function UuidGeneratorTool() {
  const [history, setHistory] = useState<string[]>(() => [crypto.randomUUID()]);

  const generate = () => {
    setHistory((prev) => [crypto.randomUUID(), ...prev].slice(0, 8));
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={generate}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
      >
        Generate new UUID
      </button>

      <div className="space-y-2">
        {history.map((id, i) => (
          <CopyableOutput key={id + i} value={id} />
        ))}
      </div>
    </div>
  );
}
