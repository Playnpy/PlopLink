"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

interface QRCodeModalProps {
  content: string;
  onClose: () => void;
}

const MAX_QR_LENGTH = 800;

export default function QRCodeModal({ content, onClose }: QRCodeModalProps) {
  useEscapeKey(onClose);

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content.length > MAX_QR_LENGTH) {
      setError('This content is too long for a QR code. Try "Send to my phone" instead.');
      return;
    }
    QRCode.toDataURL(content, { margin: 1, width: 260 })
      .then(setQrDataUrl)
      .catch(() => setError("Couldn't generate a QR code for this content."));
  }, [content]);

  return (
    <div className="prevent-autopaste fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">QR code</h3>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 py-2 min-h-[200px] justify-center">
          {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
          {!error && qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR code" className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white p-2" />
          )}
          {!error && !qrDataUrl && <p className="text-sm text-slate-400 dark:text-slate-500">Generating...</p>}
        </div>
      </div>
    </div>
  );
}
