"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "plop_extension_promo_dismissed";

export default function ExtensionPromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3.5">
      <div className="flex items-center gap-3">
        <span className="text-2xl shrink-0">🧩</span>
        <p className="text-sm text-indigo-900">
          <span className="font-bold">New: PlopLink Chrome extension.</span>{" "}
          <span className="text-indigo-700">
            Save clipboard content to your library without opening the site. Coming soon for download.
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 text-indigo-400 hover:text-indigo-700 transition-colors border-none outline-none text-sm"
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
