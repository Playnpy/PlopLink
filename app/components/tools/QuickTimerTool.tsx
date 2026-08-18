"use client";

import { useEffect, useRef, useState } from "react";

function playBeep() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio context unavailable — fail silently, the visual state still updates.
  }
}

export default function QuickTimerTool() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsDone(true);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = () => {
    if (remaining === 0) setRemaining(minutes * 60 + seconds);
    setIsDone(false);
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setIsDone(false);
    setRemaining(minutes * 60 + seconds);
  };

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="space-y-4">
      <div
        className={`text-center py-6 rounded-xl ${isDone ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-slate-50 dark:bg-slate-800/50"}`}
      >
        <p
          className={`text-4xl font-extrabold font-mono ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100"}`}
        >
          {mm}:{ss}
        </p>
        {isDone && <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Time&apos;s up! ⏰</p>}
      </div>

      {!isRunning && (
        <div className="flex items-center gap-2 justify-center">
          <input
            type="number"
            min={0}
            max={99}
            value={minutes}
            onChange={(e) => {
              const m = Math.max(0, Number(e.target.value));
              setMinutes(m);
              setRemaining(m * 60 + seconds);
            }}
            className="w-16 p-2 text-center text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <span className="text-xs text-slate-400 dark:text-slate-500">min</span>
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => {
              const s = Math.max(0, Math.min(59, Number(e.target.value)));
              setSeconds(s);
              setRemaining(minutes * 60 + s);
            }}
            className="w-16 p-2 text-center text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <span className="text-xs text-slate-400 dark:text-slate-500">sec</span>
        </div>
      )}

      <div className="flex gap-2">
        {!isRunning ? (
          <button
            type="button"
            onClick={start}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition active:scale-95"
          >
            ▶️ Start
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition active:scale-95"
          >
            ⏸ Pause
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition active:scale-95"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
