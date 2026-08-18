"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "plop_theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="prevent-autopaste fixed top-4 right-4 z-40 w-10 h-10 flex items-center justify-center text-2xl bg-transparent border-none outline-none hover:scale-110 active:scale-95 transition-transform duration-200"
      style={{
        filter: isDark
          ? "drop-shadow(0 0 8px rgba(129,140,248,0.6))"
          : "drop-shadow(0 0 8px rgba(251,191,36,0.55))",
      }}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
