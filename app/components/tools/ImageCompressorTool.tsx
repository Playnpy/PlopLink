"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";

const FORMATS = [
  { mime: "image/jpeg", label: "JPEG" },
  { mime: "image/webp", label: "WebP" },
  { mime: "image/png", label: "PNG" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState("image/jpeg");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(f);
    img.onload = () => {
      setImageEl(img);
      // The image is decoded into `img` at this point — the object URL
      // itself is no longer needed and would otherwise leak.
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // Revoke the last compressed-result URL when this tool is closed/unmounted.
  useEffect(() => {
    return () => {
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return prev;
      });
    };
  }, []);

  useEffect(() => {
    if (!imageEl || !canvasRef.current) return;

    // Light debounce so dragging the quality slider doesn't re-encode the
    // full image on every single intermediate value.
    const timeout = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = imageEl.naturalWidth;
      canvas.height = imageEl.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(imageEl, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setResultUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
          setResultSize(blob.size);
        },
        format,
        format === "image/png" ? undefined : quality
      );
    }, 120);

    return () => clearTimeout(timeout);
  }, [imageEl, quality, format]);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };

  return (
    <div className="space-y-4">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`block rounded-xl border-2 border-dashed p-6 text-center text-sm transition cursor-pointer ${
          isDragOver
            ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
            : "border-slate-200 dark:border-slate-700"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
          }}
        />
        <span className="text-slate-500 dark:text-slate-400">
          {file ? file.name : "Drop an image here, or click to choose one"}
        </span>
      </label>

      <canvas ref={canvasRef} className="hidden" />

      {imageEl && (
        <>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.mime}
                type="button"
                onClick={() => setFormat(f.mime)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                  format === f.mime
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {format !== "image/png" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quality</label>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
            <span>Original: {formatBytes(file?.size ?? 0)}</span>
            <span>→</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {resultSize !== null ? formatBytes(resultSize) : "…"}
            </span>
          </div>

          {resultUrl && (
            <a
              href={resultUrl}
              download={`compressed.${format.split("/")[1]}`}
              className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition text-center shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
            >
              ⬇️ Download compressed image
            </a>
          )}
        </>
      )}
    </div>
  );
}
