"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "plop_extension_promo_dismissed";
const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/ploplink/pjkkmjhlmnajghmjpaeejkdhfmnmhekn";

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
    <div className="prevent-autopaste flex items-center justify-between gap-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl px-5 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0">🧩</span>
        <p className="text-sm text-indigo-900 dark:text-indigo-200 min-w-0">
          <span className="font-bold">New: PlopLink Chrome extension.</span>{" "}
          <span className="text-indigo-700 dark:text-indigo-300">
            Save clipboard content to your library without opening the site.
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap"
        >
          Add to Chrome
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-indigo-400 dark:text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border-none outline-none text-sm"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
