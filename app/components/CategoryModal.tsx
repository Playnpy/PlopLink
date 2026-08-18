import { CATEGORIES, CATEGORY_ICONS, type Category } from "@/app/types";

interface CategoryModalProps {
  selectedCategory: Category;
  onSelect: (cat: Category) => void;
  onClose: () => void;
}

export default function CategoryModal({ selectedCategory, onSelect, onClose }: CategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Force a category</h3>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none outline-none">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(cat);
              }}
              className={`flex items-center space-x-3 w-full p-3.5 rounded-xl border text-left transition ${
                selectedCategory === cat
                  ? "border-indigo-500 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              }`}
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
