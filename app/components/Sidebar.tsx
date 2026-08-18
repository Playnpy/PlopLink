import type { MouseEvent } from "react";
import { CATEGORIES, CATEGORY_ICONS, type PocketItem } from "@/app/types";
import SidebarItemRow from "@/app/components/SidebarItemRow";

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  displayedItems: PocketItem[];
  openSidebarCategories: Record<string, boolean>;
  onToggleCategory: (cat: string) => void;
  onCopy: (e: MouseEvent, item: PocketItem) => void;
  onEditTitle: (id: string, currentTitle?: string) => void;
  onDelete: (id: string) => void;
  onOpenShare: () => void;
}

export default function Sidebar({
  searchQuery,
  onSearchChange,
  displayedItems,
  openSidebarCategories,
  onToggleCategory,
  onCopy,
  onEditTitle,
  onDelete,
  onOpenShare,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0 z-10 shadow-sm">
      <div className="p-6 border-b border-slate-50 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="PlopLink Logo"
          className="h-12 w-auto object-contain drop-shadow-sm border-0 border-none outline-none"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (e.currentTarget.parentElement && !e.currentTarget.parentElement.querySelector(".fallback-title")) {
              e.currentTarget.parentElement.insertAdjacentHTML(
                "beforeend",
                '<div class="fallback-title text-2xl font-bold text-indigo-700 flex items-center gap-2"><span>📥</span>PlopLink</div>'
              );
            }
          }}
        />
      </div>

      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 text-slate-800 placeholder-slate-400 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pt-3 pb-1">
        <button
          type="button"
          onClick={onOpenShare}
          className="prevent-autopaste w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition active:scale-95"
        >
          <span>📤</span>
          <span>Send to my phone</span>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3 px-2">My Drawers</h3>

        <nav className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const filteredItems = displayedItems.filter((item) => item.category === cat);
            const isOpen = !!openSidebarCategories[cat];

            return (
              <div key={cat} className="rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCategory(cat);
                  }}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 transition text-left rounded-lg group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                      {CATEGORY_ICONS[cat]}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      {cat}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {filteredItems.length > 0 && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                        {filteredItems.length}
                      </span>
                    )}
                    <span className="text-xs text-slate-300 group-hover:text-slate-500 transition-colors">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="pl-9 pr-2 py-1 space-y-1.5 max-h-60 overflow-y-auto mb-2">
                    {filteredItems.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-1">No results</p>
                    ) : (
                      filteredItems.map((item) => (
                        <SidebarItemRow
                          key={item.id}
                          item={item}
                          onCopy={onCopy}
                          onEditTitle={onEditTitle}
                          onDelete={onDelete}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
