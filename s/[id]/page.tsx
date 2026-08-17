"use client";

import { use, useEffect, useState } from "react";
import type { PocketItem } from "@/app/types";
import { CATEGORY_BADGE_STYLES, CATEGORY_ICONS } from "@/app/types";
import ItemContent from "@/app/components/ItemContent";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabaseClient";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const { id } = use(params);
  const [items, setItems] = useState<PocketItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Supabase n'est pas configuré sur ce déploiement.");
      return;
    }

    let cancelled = false;

    supabase
      .from("shares")
      .select("items")
      .eq("id", id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError || !data) {
          setError("Ce lien de partage est introuvable ou a expiré.");
          return;
        }
        setItems(data.items as PocketItem[]);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCopy = async (item: PocketItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie", err);
    }
  };

  const downloadImage = (item: PocketItem) => {
    const mimeMatch = item.content.match(/^data:image\/(\w+);base64,/);
    const extension = mimeMatch ? mimeMatch[1] : "png";
    const safeName = (item.title || "image").trim().replace(/[\\/:*?"<>|]+/g, "_") || "image";

    const link = document.createElement("a");
    link.href = item.content;
    link.download = `${safeName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleItemClick = (item: PocketItem) => {
    if (item.category === "Image") {
      downloadImage(item);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      handleCopy(item);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col items-center p-6 sm:p-10">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center pt-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Plop<span className="text-indigo-600">Link</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Contenu partagé depuis votre bibliothèque.</p>
        </div>

        {error && (
          <div className="bg-white rounded-2xl border border-slate-100 border-dashed p-10 text-center text-slate-500">
            {error}
          </div>
        )}

        {!error && items === null && (
          <div className="bg-white rounded-2xl border border-slate-100 border-dashed p-10 text-center text-slate-400">
            Chargement...
          </div>
        )}

        {items && (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/75 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all space-y-3"
                title={item.category === "Image" ? "Appuyez pour télécharger" : "Appuyez pour copier"}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${CATEGORY_BADGE_STYLES[item.category]}`}
                  >
                    <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
                    <span>{item.category}</span>
                  </span>
                  {copiedId === item.id && (
                    <span className="text-xs font-semibold text-indigo-600">
                      {item.category === "Image" ? "Téléchargé !" : "Copié !"}
                    </span>
                  )}
                </div>
                <div className="pointer-events-none">
                  <ItemContent item={item} />
                </div>
                {item.category === "Image" && (
                  <p className="text-[11px] text-slate-400 font-medium">📥 Appuyez sur l'image pour la télécharger</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
