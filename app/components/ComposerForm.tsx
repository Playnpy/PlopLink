import { useState, type DragEvent, type FormEvent, type RefObject } from "react";
import { CATEGORY_ICONS, type Category } from "@/app/types";

interface ComposerFormProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  attachedImage: string | null;
  onRemoveImage: () => void;
  selectedCategory: Category;
  onOpenCategoryModal: () => void;
  onSubmit: (e: FormEvent) => void;
  onFileDrop: (file: File) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export default function ComposerForm({
  inputValue,
  onInputChange,
  attachedImage,
  onRemoveImage,
  selectedCategory,
  onOpenCategoryModal,
  onSubmit,
  onFileDrop,
  textareaRef,
}: ComposerFormProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileDrop(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/40 dark:shadow-none border overflow-hidden transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 ${
          isDragOver
            ? "border-indigo-400 ring-4 ring-indigo-500/10"
            : "border-slate-100 dark:border-slate-800"
        }`}
      >
        {isDragOver && (
          <div className="p-6 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-dashed border-indigo-200 dark:border-indigo-800">
            <span className="text-xl">📥</span>
            <span>Drop to add — images are attached, text files are pasted in</span>
          </div>
        )}

        {attachedImage && (
          <div className="relative border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 flex flex-col items-center border-none outline-none">
            <div className="p-0 m-0 border-none outline-none flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachedImage}
                alt="Preview"
                className="max-h-48 rounded-lg object-contain shadow-sm border-0 border-none outline-none ring-0"
              />
            </div>
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm text-white rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-red-600 shadow-sm transition-colors border-none outline-none"
            >
              ✕ Remove
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Drag a file here, or paste content..."
          rows={3}
          className="w-full p-5 text-base md:text-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none bg-transparent border-none"
        />

        <div className="bg-slate-50/80 dark:bg-slate-800/50 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCategoryModal();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 transition active:scale-95"
          >
            <span className="text-lg">{CATEGORY_ICONS[selectedCategory]}</span>
            <span className="tracking-wide">{selectedCategory}</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1">▼</span>
          </button>

          <button
            type="submit"
            onClick={(e) => e.stopPropagation()}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 border-none outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
