import type { MouseEvent } from "react";
import { CATEGORY_BADGE_STYLES, CATEGORY_ICONS, type PocketItem } from "@/app/types";
import ItemContent from "@/app/components/ItemContent";

interface ItemCardProps {
  item: PocketItem;
  onCopy: (e: MouseEvent, item: PocketItem) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, onCopy, onDelete }: ItemCardProps) {
  return (
    <div
      onClick={(e) => onCopy(e, item)}
      title="Click to copy"
      className="prevent-autopaste cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/75 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col space-y-4 relative group/card"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity border-none outline-none"
        title="Delete"
      >
        ✕
      </button>

      <div className="flex items-center justify-between border-b border-slate-50 pb-3 pointer-events-none">
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${CATEGORY_BADGE_STYLES[item.category]}`}
        >
          <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
          <span>{item.category}</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400 mr-6">{item.createdAt}</span>
      </div>

      <div className="flex-1 pointer-events-none border-none outline-none">
        <ItemContent item={item} />
      </div>
    </div>
  );
}
