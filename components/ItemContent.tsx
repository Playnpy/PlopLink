import type { PocketItem } from "@/app/types";

export default function ItemContent({ item }: { item: PocketItem }) {
  if (item.category === "Image") {
    return (
      <div className="w-full flex justify-start items-center p-0 m-0 border-none outline-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.content}
          alt={item.title}
          className="max-h-32 rounded-lg object-contain border-0 border-none outline-none ring-0 p-0"
        />
      </div>
    );
  }

  if (item.category === "Email" || item.category === "Phone") {
    return <span className="text-indigo-600 hover:underline break-all font-medium">{item.content}</span>;
  }

  if (item.category === "YouTube" && item.title) {
    return (
      <div className="space-y-1">
        <p className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-2">{item.title}</p>
        <span className="text-xs text-indigo-500 hover:underline break-all truncate block">{item.content}</span>
      </div>
    );
  }

  if (item.category === "Web Link" || item.category === "Google Maps") {
    return (
      <div className="space-y-0.5">
        {item.title && <p className="font-semibold text-slate-800 text-sm">{item.title}</p>}
        <span className="text-indigo-600 hover:underline break-all truncate block text-sm">{item.content}</span>
      </div>
    );
  }

  return <p className="whitespace-pre-wrap text-slate-700 line-clamp-3 text-sm leading-relaxed">{item.content}</p>;
}
