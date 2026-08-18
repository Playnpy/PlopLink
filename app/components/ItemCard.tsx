import type { MouseEvent } from "react";
import { CATEGORY_BADGE_STYLES, CATEGORY_ICONS, type PocketItem } from "@/app/types";
import ItemContent from "@/app/components/ItemContent";
import QuickActions from "@/app/components/QuickActions";

interface ItemCardProps {
  item: PocketItem;
  onCopy: (e: MouseEvent, item: PocketItem) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenQR: (item: PocketItem) => void;
  onOpenTools: (item: PocketItem) => void;
}

export default function ItemCard({ item, onCopy, onDelete, onTogglePin, onOpenQR, onOpenTools }: ItemCardProps) {
  const canShowQR = item.category !== "Image";

  return (
    <div
      onClick={(e) => onCopy(e, item)}
      title="Click to copy"
      className="prevent-autopaste cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/75 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-indigo-800 hover:border-indigo-200 transition-all flex flex-col space-y-4 relative group/card"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(item.id);
          }}
          className={`transition-colors border-none outline-none ${
            item.pinned ? "text-indigo-500" : "text-slate-300 opacity-0 group-hover/card:opacity-100 hover:text-indigo-500"
          }`}
          title={item.pinned ? "Unpin" : "Pin"}
        >
          📌
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity border-none outline-none"
          title="Delete"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 pointer-events-none">
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${CATEGORY_BADGE_STYLES[item.category]}`}
        >
          <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
          <span>{item.category}</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-12">{item.createdAt}</span>
      </div>

      <div className="flex-1 pointer-events-none border-none outline-none">
        <ItemContent item={item} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-50 dark:border-slate-800 -mx-1 px-1">
        <QuickActions item={item} />
        {canShowQR && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQR(item);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition border-none outline-none"
          >
            <span>🔳</span>
            <span>QR</span>
          </button>
        )}
        {item.category === "Text" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTools(item);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition border-none outline-none"
          >
            <span>🛠️</span>
            <span>Tools</span>
          </button>
        )}
      </div>
    </div>
  );
}
