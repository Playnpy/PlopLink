import type { PocketItem } from "@/app/types";

interface QuickAction {
  label: string;
  href: string;
  icon: string;
}

function buildActions(item: PocketItem): QuickAction[] {
  switch (item.category) {
    case "Phone":
      return [
        { label: "Call", href: `tel:${item.content}`, icon: "📞" },
        { label: "Text", href: `sms:${item.content}`, icon: "💬" },
      ];
    case "Email":
      return [{ label: "Email", href: `mailto:${item.content}`, icon: "✉️" }];
    case "Google Maps":
      return [{ label: "Open", href: item.content, icon: "📍" }];
    case "Web Link":
      return [{ label: "Open", href: item.content, icon: "🔗" }];
    case "YouTube":
      return [{ label: "Open", href: item.content, icon: "▶️" }];
    default:
      return [];
  }
}

export default function QuickActions({ item }: { item: PocketItem }) {
  const actions = buildActions(item);
  if (actions.length === 0) return null;

  return (
    <>
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target={action.href.startsWith("http") ? "_blank" : undefined}
          rel={action.href.startsWith("http") ? "noreferrer" : undefined}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </a>
      ))}
    </>
  );
}
