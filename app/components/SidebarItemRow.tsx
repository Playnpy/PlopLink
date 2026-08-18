import type { MouseEvent } from "react";
import type { PocketItem } from "@/app/types";
import ItemContent from "@/app/components/ItemContent";

interface SidebarItemRowProps {
  item: PocketItem;
  onCopy: (e: MouseEvent, item: PocketItem) => void;
  onEditTitle: (id: string, currentTitle?: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function SidebarItemRow({ item, onCopy, onEditTitle, onDelete, onTogglePin }: SidebarItemRowProps) {
  return (
    <div
      onClick={(e) => onCopy(e, item)}
      className="prevent-autopaste cursor-pointer group/item relative py-1.5 px-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-sm transition"
      title="Click to copy"
    >
      <div className="flex justify-between items-center mb-1 text-[9px] text-slate-400 dark:text-slate-500 font-medium">
        <span>{item.createdAt}</span>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(item.id);
            }}
            className={`transition ${
              item.pinned ? "text-indigo-500" : "opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-indigo-600"
            }`}
            title={item.pinned ? "Unpin" : "Pin"}
          >
            📌
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditTitle(item.id, item.title);
            }}
            className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-indigo-600 transition"
            title="Edit alias"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-red-500 transition"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 pointer-events-none">
        <ItemContent item={item} />
      </div>
    </div>
  );
}
