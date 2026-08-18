"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { CATEGORY_ICONS, type PocketItem } from "@/app/types";

interface ShareModalProps {
  items: PocketItem[];
  onClose: () => void;
}

export default function ShareModal({ items, onClose }: ShareModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(items.map((item) => item.id)));
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; qrDataUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const selectedCount = selectedIds.size;

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(items.map((item) => item.id)));
  };

  const handleSend = async () => {
    if (selectedCount === 0) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItems }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || `Server responded with ${response.status}`);
      }
      if (!payload?.id) {
        throw new Error("Unexpected server response");
      }

      const shareUrl = `${window.location.origin}/s/${payload.id}`;
      const qrDataUrl = await QRCode.toDataURL(shareUrl, { margin: 1, width: 260 });

      setResult({ url: shareUrl, qrDataUrl });
    } catch (err) {
      console.error("Error while sending", err);
      setError(err instanceof Error ? err.message : "Sending failed. Check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying the link", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {result ? "Scan to retrieve" : "Send to my phone"}
          </h3>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none">
            ✕
          </button>
        </div>

        {result ? (
          <div className="flex flex-col items-center space-y-4 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.qrDataUrl} alt="Share QR code" className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white p-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Scan this QR code with your phone to retrieve the {selectedCount} selected item
              {selectedCount > 1 ? "s" : ""}.
            </p>
            <div className="w-full flex items-center space-x-2">
              <input
                readOnly
                value={result.url}
                className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between shrink-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCount} of {items.length} selected
              </p>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 -mx-1 px-1">
              {items.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 italic py-4 text-center">Your library is empty.</p>
              ) : (
                items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 accent-indigo-600 shrink-0"
                    />
                    <span className="text-lg shrink-0">{CATEGORY_ICONS[item.category]}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {item.title || item.content}
                    </span>
                  </label>
                ))
              )}
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">{error}</p>}

            <button
              type="button"
              onClick={handleSend}
              disabled={selectedCount === 0 || isSending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 shrink-0"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
