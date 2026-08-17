"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { CATEGORY_ICONS, type PocketItem } from "@/app/types";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabaseClient";

interface ShareModalProps {
  items: PocketItem[];
  onClose: () => void;
}

export default function ShareModal({ items, onClose }: ShareModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(items.map((item) => item.id)));
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; qrDataUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const selectedCount = selectedIds.size;

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(items.map((item) => item.id)));
  };

  const handleSend = async () => {
    if (selectedCount === 0) return;

    if (!isSupabaseConfigured) {
      setError(
        "Supabase n'est pas encore configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local (voir supabase/schema.sql)."
      );
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("shares")
        .insert({ items: selectedItems })
        .select("id")
        .single();

      if (insertError || !data) {
        throw insertError ?? new Error("Réponse vide de Supabase");
      }

      const shareUrl = `${window.location.origin}/s/${data.id}`;
      const qrDataUrl = await QRCode.toDataURL(shareUrl, { margin: 1, width: 260 });

      setResult({ url: shareUrl, qrDataUrl });
    } catch (err) {
      console.error("Erreur lors de l'envoi", err);
      setError("L'envoi a échoué. Vérifiez votre connexion et la configuration Supabase.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie du lien", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <h3 className="text-base font-bold text-slate-800">
            {result ? "Scannez pour récupérer" : "Envoyer sur mon téléphone"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors border-none outline-none">
            ✕
          </button>
        </div>

        {result ? (
          <div className="flex flex-col items-center space-y-4 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.qrDataUrl} alt="QR code du partage" className="rounded-xl border border-slate-100" />
            <p className="text-sm text-slate-500 text-center">
              Scannez ce QR code avec votre téléphone pour retrouver les {selectedCount} élément
              {selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}.
            </p>
            <div className="w-full flex items-center space-x-2">
              <input
                readOnly
                value={result.url}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shrink-0"
              >
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between shrink-0">
              <p className="text-xs text-slate-500">
                {selectedCount} sur {items.length} sélectionné{items.length > 1 ? "s" : ""}
              </p>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 -mx-1 px-1">
              {items.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-4 text-center">Votre bibliothèque est vide.</p>
              ) : (
                items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 accent-indigo-600 shrink-0"
                    />
                    <span className="text-lg shrink-0">{CATEGORY_ICONS[item.category]}</span>
                    <span className="text-sm text-slate-700 truncate">
                      {item.title || item.content}
                    </span>
                  </label>
                ))
              )}
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}

            <button
              type="button"
              onClick={handleSend}
              disabled={selectedCount === 0 || isSending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 active:scale-95 shrink-0"
            >
              {isSending ? "Envoi en cours..." : "Envoyer"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
