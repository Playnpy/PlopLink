export type Category =
  | "YouTube"
  | "Image"
  | "Web Link"
  | "Text"
  | "Email"
  | "Phone"
  | "Google Maps";

export interface PocketItem {
  id: string;
  category: Category;
  content: string;
  title?: string;
  createdAt: string;
}

export const CATEGORIES: readonly Category[] = [
  "YouTube",
  "Image",
  "Web Link",
  "Email",
  "Phone",
  "Google Maps",
  "Text",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  YouTube: "📺",
  Image: "🖼️",
  "Web Link": "🌐",
  Email: "✉️",
  Phone: "📞",
  "Google Maps": "📍",
  Text: "📝",
};

export const CATEGORY_BADGE_STYLES: Record<Category, string> = {
  YouTube: "bg-red-50 text-red-700",
  Image: "bg-emerald-50 text-emerald-700",
  "Web Link": "bg-blue-50 text-blue-700",
  Email: "bg-purple-50 text-purple-700",
  Phone: "bg-cyan-50 text-cyan-700",
  "Google Maps": "bg-rose-50 text-rose-700",
  Text: "bg-amber-50 text-amber-700",
};
