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
  pinned?: boolean;
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
  YouTube: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  Image: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "Web Link": "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  Email: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  Phone: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
  "Google Maps": "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  Text: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
};
