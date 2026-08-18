import type { FormEvent, RefObject } from "react";
import { CATEGORY_ICONS, type Category } from "@/app/types";

interface ComposerFormProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  attachedImage: string | null;
  onRemoveImage: () => void;
  selectedCategory: Category;
  onOpenCategoryModal: () => void;
  onSubmit: (e: FormEvent) => void;
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
  textareaRef,
}: ComposerFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400"
      >
        {attachedImage && (
          <div className="relative border-b border-slate-100 bg-slate-50 p-4 flex flex-col items-center border-none outline-none">
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
          placeholder="Drag an image or paste content here..."
          rows={3}
          className="w-full p-5 text-base md:text-lg text-slate-800 placeholder-slate-400 focus:outline-none resize-none bg-transparent border-none"
        />

        <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCategoryModal();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl shadow-sm text-sm font-semibold text-slate-700 transition active:scale-95"
          >
            <span className="text-lg">{CATEGORY_ICONS[selectedCategory]}</span>
            <span className="tracking-wide">{selectedCategory}</span>
            <span className="text-slate-400 text-[10px] ml-1">▼</span>
          </button>

          <button
            type="submit"
            onClick={(e) => e.stopPropagation()}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 active:scale-95 border-none outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
